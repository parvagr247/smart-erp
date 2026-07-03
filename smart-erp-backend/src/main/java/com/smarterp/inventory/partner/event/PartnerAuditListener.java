package com.smarterp.inventory.partner.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PartnerAuditListener {

    @EventListener
    public void onPartnerCreated(PartnerCreatedEvent event) {
        log.info("[AUDIT] Business partner {} successfully CREATED in company scope {}.", event.getPartnerId(), event.getCompanyId());
    }

    @EventListener
    public void onPartnerUpdated(PartnerUpdatedEvent event) {
        log.info("[AUDIT] Business partner {} successfully UPDATED in company scope {}.", event.getPartnerId(), event.getCompanyId());
    }

    @EventListener
    public void onPartnerBlocked(PartnerBlockedEvent event) {
        log.warn("[AUDIT] Business partner {} has been BLOCKED in company scope {}.", event.getPartnerId(), event.getCompanyId());
    }
}
