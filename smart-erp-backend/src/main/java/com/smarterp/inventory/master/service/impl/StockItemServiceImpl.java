package com.smarterp.inventory.master.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.inventory.master.dto.InventorySummaryResponse;
import com.smarterp.inventory.master.dto.StockItemRequest;
import com.smarterp.inventory.master.dto.StockItemResponse;
import com.smarterp.inventory.master.entity.*;
import com.smarterp.inventory.master.repository.*;
import com.smarterp.inventory.master.service.StockItemService;
import com.smarterp.inventory.master.specification.StockItemSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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
    private final ManufacturerRepository manufacturerRepository;
    private final StockGroupRepository stockGroupRepository;
    private final StockCategoryRepository stockCategoryRepository;
    private final UnitRepository unitRepository;
    private final TaxCategoryRepository taxCategoryRepository;
    private final HsnRepository hsnRepository;
    private final com.smarterp.common.audit.AuditLogService auditLogService;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public StockItemResponse createItem(StockItemRequest request, Company company) {
        log.info("Creating stock item {} under company {}", request.getName(), company.getId());
        validateCreate(company, request);

        Brand brand = request.getBrandId() != null ? brandRepository.findById(request.getBrandId()).orElse(null) : null;
        Manufacturer manufacturer = request.getManufacturerId() != null ? manufacturerRepository.findById(request.getManufacturerId()).orElse(null) : null;
        StockGroup stockGroup = request.getStockGroupId() != null ? stockGroupRepository.findById(request.getStockGroupId()).orElse(null) : null;
        Unit primaryUnit = request.getPrimaryUnitId() != null ? unitRepository.findById(request.getPrimaryUnitId()).orElse(null) : null;
        Unit secondaryUnit = request.getSecondaryUnitId() != null ? unitRepository.findById(request.getSecondaryUnitId()).orElse(null) : null;
        Warehouse warehouse = request.getWarehouseId() != null ? warehouseRepository.findById(request.getWarehouseId()).orElse(null) : null;
        TaxCategory taxCategory = request.getTaxCategoryId() != null ? taxCategoryRepository.findById(request.getTaxCategoryId()).orElse(null) : null;
        Hsn hsn = request.getHsnId() != null ? hsnRepository.findById(request.getHsnId()).orElse(null) : null;
        
        java.util.Set<StockCategory> categories = new java.util.HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(stockCategoryRepository.findAllById(request.getCategoryIds()));
        }

        StockItem item = request.toEntity(company, brand, manufacturer, stockGroup, primaryUnit, secondaryUnit, warehouse, taxCategory, hsn, categories);
        item.setCurrentQuantity(item.getOpeningQuantity() != null ? item.getOpeningQuantity() : java.math.BigDecimal.ZERO);
        StockItem savedItem = repository.save(item);

        auditLogService.saveLog(company.getId(), "StockItem", savedItem.getId(), "CREATED", "Stock Item " + savedItem.getName() + " onboarded.");

        return StockItemResponse.fromEntity(savedItem);
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = "stock-items", key = "#company.id + '-' + #id"),
        @CacheEvict(value = "dashboard", key = "#company.id")
    })
    public StockItemResponse updateItem(UUID id, StockItemRequest request, Company company) {
        log.info("Updating stock item {} under company {}", id, company.getId());
        StockItem item = repository.findById(id)
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

        validateUpdate(company, id, request);
        
        BigDecimal oldQty = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
        
        Brand brand = request.getBrandId() != null ? brandRepository.findById(request.getBrandId()).orElse(null) : null;
        Manufacturer manufacturer = request.getManufacturerId() != null ? manufacturerRepository.findById(request.getManufacturerId()).orElse(null) : null;
        StockGroup stockGroup = request.getStockGroupId() != null ? stockGroupRepository.findById(request.getStockGroupId()).orElse(null) : null;
        Unit primaryUnit = request.getPrimaryUnitId() != null ? unitRepository.findById(request.getPrimaryUnitId()).orElse(null) : null;
        Unit secondaryUnit = request.getSecondaryUnitId() != null ? unitRepository.findById(request.getSecondaryUnitId()).orElse(null) : null;
        Warehouse warehouse = request.getWarehouseId() != null ? warehouseRepository.findById(request.getWarehouseId()).orElse(null) : null;
        TaxCategory taxCategory = request.getTaxCategoryId() != null ? taxCategoryRepository.findById(request.getTaxCategoryId()).orElse(null) : null;
        Hsn hsn = request.getHsnId() != null ? hsnRepository.findById(request.getHsnId()).orElse(null) : null;
        
        java.util.Set<StockCategory> categories = new java.util.HashSet<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories.addAll(stockCategoryRepository.findAllById(request.getCategoryIds()));
        }

        request.updateEntity(item, brand, manufacturer, stockGroup, primaryUnit, secondaryUnit, warehouse, taxCategory, hsn, categories);
        StockItem savedItem = repository.save(item);
        
        BigDecimal newQty = savedItem.getCurrentQuantity() != null ? savedItem.getCurrentQuantity() : BigDecimal.ZERO;
        
        if (oldQty.compareTo(newQty) != 0) {
            auditLogService.saveLog(company.getId(), "StockItem", savedItem.getId(), "ADJUSTED", 
                "Stock quantity adjusted for " + savedItem.getName() + ". Old Qty: " + oldQty + ", New Qty: " + newQty + ". Reason: Manual Stock adjustment / edit"
            );
        }

        return StockItemResponse.fromEntity(savedItem);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "stock-items", key = "#company.id + '-' + #id")
    public StockItemResponse getItemById(UUID id, Company company) {
        log.info("Fetching stock item {} under company {}", id, company.getId());
        StockItem item = repository.findById(id)
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

        StockItemResponse response = StockItemResponse.fromEntity(item);
        response.setLastPurchaseDate(inventoryTransactionRepository.findLastTransactionDate(company, id, InventoryTransactionType.GOODS_RECEIPT));
        response.setLastSalesDate(inventoryTransactionRepository.findLastTransactionDate(company, id, InventoryTransactionType.GOODS_ISSUE));
        return response;
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = "stock-items", key = "#company.id + '-' + #id"),
        @CacheEvict(value = "dashboard", key = "#company.id")
    })
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
        return repository.findAll(spec, pageable).map(StockItemResponse::fromEntity);
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
                cb.lessThanOrEqualTo(root.get("currentQuantity"), BigDecimal.ZERO)
        )).size();

        long lowStockCount = repository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.lessThanOrEqualTo(root.get("currentQuantity"), root.get("reorderLevel"))
        )).size();

        return InventorySummaryResponse.builder()
                .totalItems(totalItems)
                .totalWarehouses(totalWarehouses)
                .totalBrands(totalBrands)
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .build();
    }

    /* ==========================================================================
       Validation Rules
       ========================================================================== */
    private void validateCreate(Company company, StockItemRequest request) {
        if (repository.existsByCompanyAndCode(company, request.getCode().trim())) {
            throw new BusinessValidationException("Stock item code '" + request.getCode().trim() + "' already exists in this company.");
        }
        if (repository.existsByCompanyAndSku(company, request.getSku().trim())) {
            throw new BusinessValidationException("SKU '" + request.getSku().trim() + "' already exists in this company.");
        }
        validateValues(request);
    }

    private void validateUpdate(Company company, UUID id, StockItemRequest request) {
        if (repository.existsByCompanyAndCodeAndIdNot(company, request.getCode().trim(), id)) {
            throw new BusinessValidationException("Another stock item with code '" + request.getCode().trim() + "' already exists in this company.");
        }
        if (repository.existsByCompanyAndSkuAndIdNot(company, request.getSku().trim(), id)) {
            throw new BusinessValidationException("Another stock item with SKU '" + request.getSku().trim() + "' already exists in this company.");
        }
        validateValues(request);
    }

    private void validateValues(StockItemRequest request) {
        if (request.getOpeningQuantity() != null && request.getOpeningQuantity().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Opening quantity cannot be negative.");
        }
        if (request.getOpeningValue() != null && request.getOpeningValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Opening value cannot be negative.");
        }
        if (request.getMinimumStock() != null && request.getMinimumStock().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Minimum stock cannot be negative.");
        }
        if (request.getMaximumStock() != null && request.getMaximumStock().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Maximum stock cannot be negative.");
        }
        if (request.getReorderLevel() != null && request.getReorderLevel().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Reorder level cannot be negative.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public StockItem getItemEntity(UUID id, Company company) {
        return repository.findById(id)
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));
    }
}
