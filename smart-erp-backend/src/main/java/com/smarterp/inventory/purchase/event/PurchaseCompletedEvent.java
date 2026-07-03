package com.smarterp.inventory.purchase.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class PurchaseCompletedEvent extends ApplicationEvent {
    private final UUID purchaseId;
    private final UUID companyId;
    private final String performedBy;

    public PurchaseCompletedEvent(Object source, UUID purchaseId, UUID companyId, String performedBy) {
        super(source);
        this.purchaseId = purchaseId;
        this.companyId = companyId;
        this.performedBy = performedBy;
    }
}
