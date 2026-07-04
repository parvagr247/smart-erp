package com.smarterp.inventory.purchase.domain;

import com.smarterp.inventory.master.entity.StockItem;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class TaxCalculator {
    
    public static class TaxCalculationResult {
        public BigDecimal taxableAmount = BigDecimal.ZERO;
        public BigDecimal taxAmount = BigDecimal.ZERO;
        public BigDecimal cgst = BigDecimal.ZERO;
        public BigDecimal sgst = BigDecimal.ZERO;
        public BigDecimal igst = BigDecimal.ZERO;
        public BigDecimal cess = BigDecimal.ZERO;
    }

    public TaxCalculationResult calculateTax(
            StockItem item,
            BigDecimal qty,
            BigDecimal rate,
            BigDecimal lineDiscount,
            boolean isTaxInclusive,
            boolean isIntraState) {

        TaxCalculationResult result = new TaxCalculationResult();
        BigDecimal rawAmount = qty.multiply(rate);

        BigDecimal taxRate = BigDecimal.ZERO;
        BigDecimal cessRate = BigDecimal.ZERO;

        if (item.getTaxCategory() != null) {
            taxRate = item.getTaxCategory().getGstRate() != null ? item.getTaxCategory().getGstRate() : BigDecimal.ZERO;
            cessRate = item.getTaxCategory().getCessRate() != null ? item.getTaxCategory().getCessRate() : BigDecimal.ZERO;
        }

        BigDecimal taxableAmount;
        BigDecimal taxAmount;

        if (isTaxInclusive) {
            BigDecimal divider = BigDecimal.ONE.add(taxRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            taxableAmount = rawAmount.subtract(lineDiscount).divide(divider, 2, RoundingMode.HALF_UP);
            taxAmount = rawAmount.subtract(lineDiscount).subtract(taxableAmount);
        } else {
            taxableAmount = rawAmount.subtract(lineDiscount);
            taxAmount = taxableAmount.multiply(taxRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        }

        BigDecimal cgst = BigDecimal.ZERO;
        BigDecimal sgst = BigDecimal.ZERO;
        BigDecimal igst = BigDecimal.ZERO;
        BigDecimal cess = taxableAmount.multiply(cessRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));

        if (isIntraState) {
            BigDecimal localRate = taxRate.divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
            cgst = taxableAmount.multiply(localRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            sgst = taxableAmount.multiply(localRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
        } else {
            igst = taxAmount;
        }

        result.taxableAmount = taxableAmount;
        result.taxAmount = taxAmount;
        result.cgst = cgst;
        result.sgst = sgst;
        result.igst = igst;
        result.cess = cess;

        return result;
    }
}
