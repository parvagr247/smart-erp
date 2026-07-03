package com.smarterp.inventory.purchase.listener;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.ActivityTimeline;
import com.smarterp.inventory.master.repository.ActivityTimelineRepository;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.event.PurchaseCompletedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class PurchaseTimelineListener {

    private final PurchaseRepository purchaseRepository;
    private final ActivityTimelineRepository timelineRepository;

    @EventListener
    @Transactional
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Timeline listener reacting to PurchaseApprovedEvent for Purchase {}", event.getPurchaseId());
        logTimeline(event.getPurchaseId(), "POST_APPROVED", "Purchase Invoice Approved & Posted to Ledgers", event.getPerformedBy());
    }

    @EventListener
    @Transactional
    public void onPurchaseCompleted(PurchaseCompletedEvent event) {
        log.info("Timeline listener reacting to PurchaseCompletedEvent for Purchase {}", event.getPurchaseId());
        logTimeline(event.getPurchaseId(), "COMPLETED", "Purchase Voucher Transaction Cycle Completed", event.getPerformedBy());
    }

    private void logTimeline(UUID purchaseId, String action, String details, String performedBy) {
        Purchase purchase = purchaseRepository.findById(purchaseId).orElse(null);
        if (purchase == null) return;

        timelineRepository.save(ActivityTimeline.builder()
                .entityType("PURCHASE")
                .entityId(purchaseId)
                .action(action)
                .details(details + " | Invoice: " + purchase.getPurchaseNumber())
                .performedBy(performedBy)
                .company(purchase.getCompany())
                .build());
    }
}
