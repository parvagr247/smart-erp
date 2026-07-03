package com.smarterp.inventory.purchase.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
public class PurchaseCreatedEvent extends ApplicationEvent {
    private final UUID purchaseId;
    private final UUID companyId;
    private final String supplierName;
    private final BigDecimal grandTotal;
    private final String performedBy;

    public PurchaseCreatedEvent(Object source, UUID purchaseId, UUID companyId, String supplierName, BigDecimal grandTotal, String performedBy) {
        super(source);
        this.purchaseId = purchaseId;
        this.companyId = companyId;
        this.supplierName = supplierName;
        this.grandTotal = grandTotal;
        this.performedBy = performedBy;
    }
}
