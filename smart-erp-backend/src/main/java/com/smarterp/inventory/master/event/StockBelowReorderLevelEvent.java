package com.smarterp.inventory.master.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
public class StockBelowReorderLevelEvent extends ApplicationEvent {
    private final UUID stockItemId;
    private final UUID companyId;
    private final String itemName;
    private final BigDecimal currentQuantity;
    private final BigDecimal reorderLevel;
    private final String performedBy;

    public StockBelowReorderLevelEvent(Object source, UUID stockItemId, UUID companyId, String itemName, BigDecimal currentQuantity, BigDecimal reorderLevel, String performedBy) {
        super(source);
        this.stockItemId = stockItemId;
        this.companyId = companyId;
        this.itemName = itemName;
        this.currentQuantity = currentQuantity;
        this.reorderLevel = reorderLevel;
        this.performedBy = performedBy;
    }
}
