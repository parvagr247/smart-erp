package com.smarterp.inventory.master.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class InventoryTransactionCreatedEvent extends ApplicationEvent {
    private final UUID transactionId;
    private final UUID companyId;

    public InventoryTransactionCreatedEvent(Object source, UUID transactionId, UUID companyId) {
        super(source);
        this.transactionId = transactionId;
        this.companyId = companyId;
    }
}
