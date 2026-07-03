package com.smarterp.common.notification;

import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final StockItemRepository stockItemRepository;

    @EventListener
    public void onPurchaseCreated(com.smarterp.inventory.purchase.event.PurchaseCreatedEvent event) {
        log.info("Notification listener reacting to PurchaseCreatedEvent");
        notificationService.sendNotification(
                event.getCompanyId(),
                "Purchase Voucher Created",
                "Voucher ID: " + event.getPurchaseId() + " has been created for supplier '" + event.getSupplierName() + "' with amount: ₹" + event.getGrandTotal(),
                "INFO"
        );
    }

    @EventListener
    public void onPartnerBlocked(com.smarterp.inventory.partner.event.PartnerBlockedEvent event) {
        log.info("Notification listener reacting to PartnerBlockedEvent");
        notificationService.sendNotification(
                event.getCompanyId(),
                "Business Partner Blocked",
                "Business partner ID: " + event.getPartnerId() + " has been blocked from further financial transactions.",
                "WARNING"
        );
    }

    @EventListener
    public void onCompanyCreated(com.smarterp.administration.company.event.CompanyCreatedEvent event) {
        log.info("Notification listener reacting to CompanyCreatedEvent");
        notificationService.sendNotification(
                event.getCompanyId(),
                "Company Tenant Initialized",
                "Tenant with context ID: " + event.getCompanyId() + " has been successfully initialized.",
                "INFO"
        );
    }

    @EventListener
    public void onStockAdjusted(com.smarterp.inventory.master.event.StockAdjustedEvent event) {
        log.info("Notification listener reacting to StockAdjustedEvent");
        StockItem item = stockItemRepository.findById(event.getItemId()).orElse(null);
        if (item == null) return;

        BigDecimal reorder = item.getReorderLevel() != null ? item.getReorderLevel() : BigDecimal.ZERO;
        BigDecimal current = event.getNewQuantity() != null ? event.getNewQuantity() : BigDecimal.ZERO;

        if (current.compareTo(reorder) <= 0) {
            notificationService.sendNotification(
                    event.getCompanyId(),
                    "LOW STOCK WARNING: " + item.getName(),
                    "Item stock quantity (" + current + ") is at or below the reorder level limit (" + reorder + "). Please place a procurement request.",
                    "WARNING"
            );
        }
    }
}
