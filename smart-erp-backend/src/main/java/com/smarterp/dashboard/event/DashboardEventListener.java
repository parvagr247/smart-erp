package com.smarterp.dashboard.event;

import com.smarterp.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DashboardEventListener {

    private final DashboardService dashboardService;

    @EventListener
    public void onLedgerCreated(com.smarterp.accounting.ledger.event.LedgerCreatedEvent event) {
        log.info("Evicting dashboard cache due to LedgerCreatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onLedgerUpdated(com.smarterp.accounting.ledger.event.LedgerUpdatedEvent event) {
        log.info("Evicting dashboard cache due to LedgerUpdatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onPartnerCreated(com.smarterp.inventory.partner.event.PartnerCreatedEvent event) {
        log.info("Evicting dashboard cache due to PartnerCreatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onPartnerUpdated(com.smarterp.inventory.partner.event.PartnerUpdatedEvent event) {
        log.info("Evicting dashboard cache due to PartnerUpdatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onStockItemCreated(com.smarterp.inventory.master.event.StockItemCreatedEvent event) {
        log.info("Evicting dashboard cache due to StockItemCreatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onStockAdjusted(com.smarterp.inventory.master.event.StockAdjustedEvent event) {
        log.info("Evicting dashboard cache due to StockAdjustedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onWarehouseCreated(com.smarterp.inventory.master.event.WarehouseCreatedEvent event) {
        log.info("Evicting dashboard cache due to WarehouseCreatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onPurchaseCreated(com.smarterp.inventory.purchase.event.PurchaseCreatedEvent event) {
        log.info("Evicting dashboard cache due to PurchaseCreatedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onPurchaseApproved(com.smarterp.inventory.purchase.event.PurchaseApprovedEvent event) {
        log.info("Evicting dashboard cache due to PurchaseApprovedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }

    @EventListener
    public void onPurchaseCompleted(com.smarterp.inventory.purchase.event.PurchaseCompletedEvent event) {
        log.info("Evicting dashboard cache due to PurchaseCompletedEvent for company {}", event.getCompanyId());
        dashboardService.evictCache(event.getCompanyId());
    }
}
