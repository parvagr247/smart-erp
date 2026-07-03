package com.smarterp.inventory.master.specification;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.StockItem;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class StockItemSpecification {

    public static Specification<StockItem> searchAndFilter(
            Company company,
            String search,
            UUID warehouseId,
            UUID categoryId,
            UUID groupId,
            UUID brandId,
            UUID manufacturerId,
            String stockStatus) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Company Scope
            predicates.add(criteriaBuilder.equal(root.get("company"), company));

            // 2. Fuzzy Search: code, name, barcode, sku, alias
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("sku")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("barcode")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("alias")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            // 3. Filters
            if (warehouseId != null) {
                predicates.add(criteriaBuilder.equal(root.get("warehouse").get("id"), warehouseId));
            }
            if (groupId != null) {
                predicates.add(criteriaBuilder.equal(root.get("stockGroup").get("id"), groupId));
            }
            if (brandId != null) {
                predicates.add(criteriaBuilder.equal(root.get("brand").get("id"), brandId));
            }
            if (manufacturerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("manufacturer").get("id"), manufacturerId));
            }
            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.join("categories").get("id"), categoryId));
            }

            // 4. Stock Status (LOW_STOCK, OUT_OF_STOCK)
            if (stockStatus != null && !stockStatus.trim().isEmpty()) {
                if (stockStatus.equalsIgnoreCase("OUT_OF_STOCK")) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("openingQuantity"), BigDecimal.ZERO));
                } else if (stockStatus.equalsIgnoreCase("LOW_STOCK")) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("openingQuantity"), root.get("reorderLevel")));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
