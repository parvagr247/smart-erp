package com.smarterp.common.config;

import com.smarterp.accounting.voucher.event.VoucherApprovedEvent;
import com.smarterp.accounting.voucher.event.VoucherCreatedEvent;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class CacheEvictionListener {

    private final CacheManager cacheManager;

    @EventListener
    public void handleVoucherCreated(VoucherCreatedEvent event) {
        log.debug("Evicting dashboard cache on VoucherCreatedEvent for company: {}", event.getCompanyId());
        evictDashboard(event.getCompanyId());
    }

    @EventListener
    public void handleVoucherApproved(VoucherApprovedEvent event) {
        log.debug("Evicting dashboard cache on VoucherApprovedEvent for company: {}", event.getCompanyId());
        evictDashboard(event.getCompanyId());
    }

    @EventListener
    public void handlePurchaseApproved(PurchaseApprovedEvent event) {
        log.debug("Evicting dashboard cache on PurchaseApprovedEvent for company: {}", event.getCompanyId());
        evictDashboard(event.getCompanyId());
    }

    @EventListener
    public void handleSalesApproved(SalesApprovedEvent event) {
        log.debug("Evicting dashboard cache on SalesApprovedEvent for company: {}", event.getCompanyId());
        evictDashboard(event.getCompanyId());
    }

    private void evictDashboard(UUID companyId) {
        if (companyId == null) return;
        Cache cache = cacheManager.getCache("dashboard");
        if (cache != null) {
            cache.evict(companyId);
        }
    }
}
