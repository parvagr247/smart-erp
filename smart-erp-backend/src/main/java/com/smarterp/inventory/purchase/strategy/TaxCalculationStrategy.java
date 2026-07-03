package com.smarterp.inventory.purchase.strategy;

import com.smarterp.inventory.master.entity.StockItem;
import java.math.BigDecimal;

public interface TaxCalculationStrategy {
    
    class TaxCalculationResult {
        public BigDecimal taxableAmount = BigDecimal.ZERO;
        public BigDecimal taxAmount = BigDecimal.ZERO;
        public BigDecimal cgst = BigDecimal.ZERO;
        public BigDecimal sgst = BigDecimal.ZERO;
        public BigDecimal igst = BigDecimal.ZERO;
        public BigDecimal cess = BigDecimal.ZERO;
    }

    TaxCalculationResult calculateTax(
            StockItem item,
            BigDecimal qty,
            BigDecimal rate,
            BigDecimal lineDiscount,
            boolean isTaxInclusive,
            boolean isIntraState
    );
}
