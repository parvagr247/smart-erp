package com.smarterp.inventory.purchase.listener;

import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.entity.PurchaseLine;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.event.PurchaseCompletedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.purchase.strategy.InventoryValuationStrategy;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
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
    private final InventoryValuationStrategy valuationStrategy;

    @EventListener
    @Transactional
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Stock listener reacting to PurchaseApprovedEvent for Purchase {}", event.getPurchaseId());
        processStockUpdates(event.getPurchaseId());
    }

    @EventListener
    @Transactional
    public void onPurchaseCompleted(PurchaseCompletedEvent event) {
        log.info("Stock listener reacting to PurchaseCompletedEvent for Purchase {}", event.getPurchaseId());
        processStockUpdates(event.getPurchaseId());
    }

    private void processStockUpdates(java.util.UUID purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId).orElse(null);
        if (purchase == null) return;

        for (PurchaseLine line : purchase.getLineItems()) {
            StockItem item = line.getStockItem();

            BigDecimal buyQty = line.getQuantity();
            BigDecimal buyRate = line.getRate().subtract(line.getDiscount().divide(buyQty, 4, RoundingMode.HALF_UP));

            InventoryValuationStrategy.ValuationResult result = valuationStrategy.recalculateValuation(item, buyQty, buyRate);

            item.setCurrentQuantity(result.newQuantity);
            item.setAverageCost(result.newAverageCost);
            stockItemRepository.save(item);
            log.info("Stock Item {} updated. New Qty: {}, New Avg Cost: {}", item.getName(), result.newQuantity, result.newAverageCost);
        }
    }
}
