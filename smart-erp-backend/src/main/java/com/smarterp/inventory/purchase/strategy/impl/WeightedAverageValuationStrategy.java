package com.smarterp.inventory.purchase.strategy.impl;

import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.purchase.strategy.InventoryValuationStrategy;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class WeightedAverageValuationStrategy implements InventoryValuationStrategy {

    @Override
    public ValuationResult recalculateValuation(
            StockItem item,
            BigDecimal incomingQty,
            BigDecimal incomingRate) {

        ValuationResult result = new ValuationResult();
        BigDecimal oldQty = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
        BigDecimal oldCost = item.getAverageCost() != null ? item.getAverageCost() : BigDecimal.ZERO;

        BigDecimal newQty = oldQty.add(incomingQty);
        BigDecimal newCost = oldCost;

        if (newQty.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal oldVal = oldQty.multiply(oldCost);
            BigDecimal newVal = incomingQty.multiply(incomingRate);
            newCost = oldVal.add(newVal).divide(newQty, 4, RoundingMode.HALF_UP);
        }

        result.newQuantity = newQty;
        result.newAverageCost = newCost;
        return result;
    }
}
