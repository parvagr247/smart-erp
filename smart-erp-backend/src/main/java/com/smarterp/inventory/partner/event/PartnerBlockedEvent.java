package com.smarterp.inventory.partner.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
import java.util.UUID;

@Getter
public class PartnerBlockedEvent extends ApplicationEvent {
    private final UUID partnerId;
    private final UUID companyId;

    public PartnerBlockedEvent(Object source, UUID partnerId, UUID companyId) {
        super(source);
        this.partnerId = partnerId;
        this.companyId = companyId;
    }
}
