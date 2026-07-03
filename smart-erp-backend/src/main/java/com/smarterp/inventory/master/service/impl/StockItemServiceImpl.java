package com.smarterp.inventory.master.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.InventorySummaryResponse;
import com.smarterp.inventory.master.dto.StockItemRequest;
import com.smarterp.inventory.master.dto.StockItemResponse;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.mapper.StockItemMapper;
import com.smarterp.inventory.master.repository.BrandRepository;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.master.service.StockItemService;
import com.smarterp.inventory.master.specification.StockItemSpecification;
import com.smarterp.inventory.master.validator.StockItemValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class StockItemServiceImpl implements StockItemService {

    private final StockItemRepository repository;
    private final WarehouseRepository warehouseRepository;
    private final BrandRepository brandRepository;
    private final StockItemMapper mapper;
    private final StockItemValidator validator;

    @Override
    public StockItemResponse createItem(StockItemRequest request, Company company) {
        log.info("Creating stock item {} under company {}", request.getName(), company.getId());
        validator.validateCreate(company, request);

        StockItem item = mapper.toEntity(request, company);
        StockItem savedItem = repository.save(item);

        return mapper.toResponse(savedItem);
    }

    @Override
    public StockItemResponse updateItem(UUID id, StockItemRequest request, Company company) {
        log.info("Updating stock item {} under company {}", id, company.getId());
        StockItem item = repository.findById(id)
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

        validator.validateUpdate(company, id, request);
        mapper.updateEntity(item, request);

        StockItem savedItem = repository.save(item);
        return mapper.toResponse(savedItem);
    }

    @Override
    @Transactional(readOnly = true)
    public StockItemResponse getItemById(UUID id, Company company) {
        log.info("Fetching stock item {} under company {}", id, company.getId());
        StockItem item = repository.findById(id)
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

        return mapper.toResponse(item);
    }

    @Override
    public void deleteItem(UUID id, Company company) {
        log.info("Deleting stock item {} under company {}", id, company.getId());
        StockItem item = repository.findById(id)
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

        repository.delete(item);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockItemResponse> getItems(
            Company company, String search, UUID warehouseId, UUID categoryId, 
            UUID groupId, UUID brandId, UUID manufacturerId, String stockStatus, Pageable pageable) {
        log.info("Listing stock items under company {} with criteria Search={}, Status={}", company.getId(), search, stockStatus);
        Specification<StockItem> spec = StockItemSpecification.searchAndFilter(
                company, search, warehouseId, categoryId, groupId, brandId, manufacturerId, stockStatus
        );
        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public InventorySummaryResponse getSummary(Company company) {
        log.info("Compiling inventory dashboard summary for company {}", company.getId());
        long totalItems = repository.countByCompany(company);
        long totalWarehouses = warehouseRepository.countByCompany(company);
        long totalBrands = brandRepository.countByCompany(company);

        // Simple count of low stock and out of stock items
        long outOfStockCount = repository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.lessThanOrEqualTo(root.get("openingQuantity"), BigDecimal.ZERO)
        )).size();

        long lowStockCount = repository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.lessThanOrEqualTo(root.get("openingQuantity"), root.get("reorderLevel"))
        )).size();

        return InventorySummaryResponse.builder()
                .totalItems(totalItems)
                .totalWarehouses(totalWarehouses)
                .totalBrands(totalBrands)
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .build();
    }
}
