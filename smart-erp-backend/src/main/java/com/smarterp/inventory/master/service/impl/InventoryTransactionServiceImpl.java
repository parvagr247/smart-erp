package com.smarterp.inventory.master.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.audit.AuditLogService;
import com.smarterp.inventory.master.dto.InventoryTransactionRequest;
import com.smarterp.inventory.master.dto.InventoryTransactionResponse;
import com.smarterp.inventory.master.entity.InventoryTransaction;
import com.smarterp.inventory.master.entity.InventoryTransactionType;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.repository.InventoryTransactionRepository;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.master.service.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    private final InventoryTransactionRepository repository;
    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final AuditLogService auditLogService;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;
    private final org.springframework.cache.CacheManager cacheManager;

    @Override
    public InventoryTransactionResponse recordTransaction(InventoryTransactionRequest request, Company company, String performedBy) {
        log.info("Recording inventory transaction type {} for company {}", request.getTransactionType(), company.getId());

        StockItem item = stockItemRepository.findById(request.getStockItemId())
                .filter(i -> i.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

        Warehouse wh = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        Warehouse targetWh = null;
        if (request.getTargetWarehouseId() != null) {
            targetWh = warehouseRepository.findById(request.getTargetWarehouseId())
                    .filter(w -> w.getCompany().getId().equals(company.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Target warehouse not found."));
        }

        BigDecimal qtyDelta = request.getQuantity();
        BigDecimal oldQty = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;

        // Process sign of quantity depending on transaction type
        if (request.getTransactionType() == InventoryTransactionType.GOODS_ISSUE ||
            request.getTransactionType() == InventoryTransactionType.TRANSFER_OUT) {
            qtyDelta = qtyDelta.abs().negate(); // Always negative
        } else if (request.getTransactionType() == InventoryTransactionType.GOODS_RECEIPT ||
                   request.getTransactionType() == InventoryTransactionType.TRANSFER_IN) {
            qtyDelta = qtyDelta.abs(); // Always positive
        }

        InventoryTransaction tx = InventoryTransaction.builder()
                .company(company)
                .stockItem(item)
                .warehouse(wh)
                .targetWarehouse(targetWh)
                .transactionType(request.getTransactionType())
                .quantity(qtyDelta)
                .rate(request.getRate() != null ? request.getRate() : BigDecimal.ZERO)
                .referenceNumber(request.getReferenceNumber().trim())
                .transactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : LocalDate.now())
                .notes(request.getNotes())
                .performedBy(performedBy)
                .build();

        InventoryTransaction savedTx = repository.save(tx);

        // Update StockItem current quantity (only for non-warehouse-transfer adjustments, or if targetWh is null)
        // If it's a transfer within the company, net stock item change is 0.
        boolean isLocalWarehouseTransfer = (request.getTransactionType() == InventoryTransactionType.TRANSFER_OUT && targetWh != null);
        
        if (isLocalWarehouseTransfer) {
            InventoryTransaction targetTx = InventoryTransaction.builder()
                    .company(company)
                    .stockItem(item)
                    .warehouse(targetWh)
                    .targetWarehouse(wh)
                    .transactionType(InventoryTransactionType.TRANSFER_IN)
                    .quantity(qtyDelta.abs()) // Always positive for TRANSFER_IN
                    .rate(request.getRate() != null ? request.getRate() : BigDecimal.ZERO)
                    .referenceNumber(request.getReferenceNumber().trim())
                    .transactionDate(request.getTransactionDate() != null ? request.getTransactionDate() : LocalDate.now())
                    .notes("Transfer from " + wh.getName() + ": " + (request.getNotes() != null ? request.getNotes() : ""))
                    .performedBy(performedBy)
                    .build();
            repository.save(targetTx);
            auditLogService.saveLog(company.getId(), "InventoryTransaction", targetTx.getId(), "CREATED", "Inbound transfer transaction recorded for target warehouse: " + targetWh.getName());
        } else {
            BigDecimal newQty = oldQty.add(qtyDelta);
            item.setCurrentQuantity(newQty);
            stockItemRepository.save(item);
            
            auditLogService.saveLog(company.getId(), "StockItem", item.getId(), "ADJUSTED", 
                    "Stock quantity adjusted for " + item.getName() + ". Old Qty: " + oldQty + ", New Qty: " + item.getCurrentQuantity() + ". Reason: Transaction: " + tx.getTransactionType());

            if (item.getReorderLevel() != null && newQty.compareTo(item.getReorderLevel()) <= 0) {
                log.warn("Stock level for item {} has fallen below reorder level. Current Qty: {}, Reorder Level: {}", item.getName(), newQty, item.getReorderLevel());
                eventPublisher.publishEvent(new com.smarterp.inventory.master.event.StockBelowReorderLevelEvent(
                        this, item.getId(), company.getId(), item.getName(), newQty, item.getReorderLevel(), performedBy));
            }
        }

        // Evict stock-items cache to prevent stale item profiles
        try {
            org.springframework.cache.Cache cache = cacheManager.getCache("stock-items");
            if (cache != null) {
                cache.evict(company.getId() + "-" + item.getId());
            }
            org.springframework.cache.Cache dbCache = cacheManager.getCache("dashboard");
            if (dbCache != null) {
                dbCache.evict(company.getId());
            }
        } catch (Exception e) {
            log.warn("Failed to evict cache for stock-items or dashboard:", e);
        }

        auditLogService.saveLog(company.getId(), "InventoryTransaction", savedTx.getId(), "CREATED", "Inventory transaction of type " + tx.getTransactionType() + " recorded.");

        return mapToResponse(savedTx);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getTransactions(Company company) {
        return repository.findAllByCompanyOrderByTransactionDateDescCreatedAtDesc(company)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getTransactionsByItem(Company company, UUID itemId) {
        return repository.findAllByCompanyAndStockItemIdOrderByTransactionDateDescCreatedAtDesc(company, itemId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InventoryTransactionResponse mapToResponse(InventoryTransaction tx) {
        return InventoryTransactionResponse.builder()
                .id(tx.getId())
                .stockItemId(tx.getStockItem().getId())
                .stockItemName(tx.getStockItem().getName())
                .sku(tx.getStockItem().getSku())
                .warehouseId(tx.getWarehouse().getId())
                .warehouseName(tx.getWarehouse().getName())
                .targetWarehouseId(tx.getTargetWarehouse() != null ? tx.getTargetWarehouse().getId() : null)
                .targetWarehouseName(tx.getTargetWarehouse() != null ? tx.getTargetWarehouse().getName() : "")
                .transactionType(tx.getTransactionType())
                .quantity(tx.getQuantity())
                .rate(tx.getRate())
                .referenceNumber(tx.getReferenceNumber())
                .transactionDate(tx.getTransactionDate())
                .notes(tx.getNotes())
                .performedBy(tx.getPerformedBy())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
