package com.smarterp.inventory.master.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
public class StockAdjustedEvent extends ApplicationEvent {
    private final UUID itemId;
    private final UUID companyId;
    private final String name;
    private final BigDecimal oldQuantity;
    private final BigDecimal newQuantity;
    private final String reason;

    public StockAdjustedEvent(Object source, UUID itemId, UUID companyId, String name, BigDecimal oldQuantity, BigDecimal newQuantity, String reason) {
        super(source);
        this.itemId = itemId;
        this.companyId = companyId;
        this.name = name;
        this.oldQuantity = oldQuantity;
        this.newQuantity = newQuantity;
        this.reason = reason;
    }
}
