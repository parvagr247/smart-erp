package com.smarterp.accounting.journal.listener;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JournalPostingListener {

    @EventListener
    public void onPurchaseCompleted(com.smarterp.inventory.purchase.event.PurchaseCompletedEvent event) {
        log.info("[ACCOUNTING INTEGRATION] JournalPostingListener reacting to PurchaseCompletedEvent for Purchase: {}", event.getPurchaseId());
        log.info("[ACCOUNTING INTEGRATION] Ready to execute custom double-entry ledger journal postings for company: {}", event.getCompanyId());
    }
}
