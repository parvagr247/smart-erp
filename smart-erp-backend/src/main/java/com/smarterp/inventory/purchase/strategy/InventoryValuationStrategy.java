package com.smarterp.inventory.purchase.strategy;

import com.smarterp.inventory.master.entity.StockItem;
import java.math.BigDecimal;

public interface InventoryValuationStrategy {
    
    class ValuationResult {
        public BigDecimal newQuantity;
        public BigDecimal newAverageCost;
    }

    ValuationResult recalculateValuation(
            StockItem item,
            BigDecimal incomingQty,
            BigDecimal incomingRate
    );
}
