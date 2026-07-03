package com.smarterp.inventory.partner.specification;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class PartnerSpecification {

    public static Specification<BusinessPartner> searchAndFilter(
            Company company,
            String search,
            PartnerType type,
            PartnerStatus status) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Company Context constraint
            predicates.add(criteriaBuilder.equal(root.get("company"), company));

            // 2. Fuzzy Search: Name, Code, GST, PAN, Phone, Email
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate searchPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("gstNumber")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("pan")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchPattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("mobile")), searchPattern)
                );
                predicates.add(searchPredicate);
            }

            // 3. Filter by Partner Type: if filtering by CUSTOMER, include CUSTOMER and BOTH. If SUPPLIER, include SUPPLIER and BOTH.
            if (type != null) {
                if (type == PartnerType.CUSTOMER) {
                    predicates.add(root.get("type").in(PartnerType.CUSTOMER, PartnerType.BOTH));
                } else if (type == PartnerType.SUPPLIER) {
                    predicates.add(root.get("type").in(PartnerType.SUPPLIER, PartnerType.BOTH));
                } else {
                    predicates.add(criteriaBuilder.equal(root.get("type"), PartnerType.BOTH));
                }
            }

            // 4. Filter by Partner Status
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
