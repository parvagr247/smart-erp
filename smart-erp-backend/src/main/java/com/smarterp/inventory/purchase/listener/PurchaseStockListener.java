package com.smarterp.inventory.purchase.listener;

import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.entity.PurchaseLine;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.purchase.domain.StockValuator;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.service.InventoryTransactionService;
import com.smarterp.inventory.master.dto.InventoryTransactionRequest;
import com.smarterp.inventory.master.entity.InventoryTransactionType;
import com.smarterp.inventory.master.entity.Warehouse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
@RequiredArgsConstructor
@Slf4j
public class PurchaseStockListener {

    private final PurchaseRepository purchaseRepository;
    private final StockItemRepository stockItemRepository;
    private final StockValuator stockValuator;
    private final InventoryTransactionService inventoryTransactionService;

    @EventListener
    @Transactional
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Stock listener reacting to PurchaseApprovedEvent for Purchase {}", event.getPurchaseId());
        processStockUpdates(event.getPurchaseId(), event.getPerformedBy());
    }

    private void processStockUpdates(java.util.UUID purchaseId, String performedBy) {
        Purchase purchase = purchaseRepository.findById(purchaseId).orElse(null);
        if (purchase == null) return;

        for (PurchaseLine line : purchase.getLineItems()) {
            StockItem item = line.getStockItem();

            BigDecimal buyQty = line.getQuantity();
            BigDecimal buyRate = line.getRate().subtract(line.getDiscount().divide(buyQty, 4, RoundingMode.HALF_UP));

            // Recalculate average cost valuation
            StockValuator.ValuationResult result = stockValuator.recalculateValuation(item, buyQty, buyRate);

            // Update average cost on item
            item.setAverageCost(result.newAverageCost);
            stockItemRepository.save(item);
            log.info("Stock Item {} average cost updated to {}", item.getName(), result.newAverageCost);

            // Determine warehouse
            Warehouse wh = line.getWarehouse() != null ? line.getWarehouse() : purchase.getWarehouse();
            if (wh == null) {
                log.warn("No warehouse specified for PurchaseLine or Purchase. Skipping inventory transaction log.");
                continue;
            }

            // Create Inventory Transaction (which will update current quantity on the item automatically)
            InventoryTransactionRequest req = InventoryTransactionRequest.builder()
                    .stockItemId(item.getId())
                    .warehouseId(wh.getId())
                    .transactionType(InventoryTransactionType.GOODS_RECEIPT)
                    .quantity(buyQty)
                    .rate(line.getRate())
                    .referenceNumber(purchase.getPurchaseNumber())
                    .transactionDate(purchase.getPurchaseDate())
                    .notes("Purchase receipt invoice: " + purchase.getPurchaseNumber())
                    .build();

            inventoryTransactionService.recordTransaction(req, purchase.getCompany(), performedBy);
        }
    }
}
