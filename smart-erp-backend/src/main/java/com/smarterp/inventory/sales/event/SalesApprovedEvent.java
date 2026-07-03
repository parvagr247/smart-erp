package com.smarterp.inventory.sales.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class SalesApprovedEvent extends ApplicationEvent {
    private final UUID salesId;
    private final UUID companyId;
    private final String performedBy;

    public SalesApprovedEvent(Object source, UUID salesId, UUID companyId, String performedBy) {
        super(source);
        this.salesId = salesId;
        this.companyId = companyId;
        this.performedBy = performedBy;
    }
}
