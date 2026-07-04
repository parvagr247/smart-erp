package com.smarterp.common.audit;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.ActivityTimeline;
import com.smarterp.inventory.master.repository.ActivityTimelineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventListener {

    private final ActivityTimelineRepository timelineRepository;

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "System";
    }

    private void saveAuditLog(UUID companyId, String entityType, UUID entityId, String action, String details, String performedBy) {
        if (companyId == null) return;
        
        Company companyProxy = new Company();
        companyProxy.setId(companyId);
        ActivityTimeline logEntry = ActivityTimeline.builder()
                .company(companyProxy)
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .details(details)
                .performedBy(performedBy != null ? performedBy : getCurrentUser())
                .build();
        timelineRepository.save(logEntry);
        log.info("[AUDIT SAVED] Action: {}, Entity: {} ({})", action, entityType, entityId);
    }

    @EventListener
    public void onCompanyCreated(com.smarterp.administration.company.event.CompanyCreatedEvent event) {
        saveAuditLog(event.getCompanyId(), "Company", event.getCompanyId(), "CREATED", "Company profile initialized.", null);
    }

    @EventListener
    public void onPurchaseApproved(com.smarterp.inventory.purchase.event.PurchaseApprovedEvent event) {
        saveAuditLog(event.getCompanyId(), "Purchase", event.getPurchaseId(), "APPROVED", "Purchase Invoice Approved & Posted to Ledgers.", event.getPerformedBy());
    }
}
