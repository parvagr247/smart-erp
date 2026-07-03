package com.smarterp.inventory.purchase.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class PurchaseApprovedEvent extends ApplicationEvent {
    private final UUID purchaseId;
    private final UUID companyId;
    private final String performedBy;

    public PurchaseApprovedEvent(Object source, UUID purchaseId, UUID companyId, String performedBy) {
        super(source);
        this.purchaseId = purchaseId;
        this.companyId = companyId;
        this.performedBy = performedBy;
    }
}
