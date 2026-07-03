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
    public void onUserCreated(com.smarterp.auth.event.UserCreatedEvent event) {
        log.info("[AUDIT LOG] User registered: {} ({})", event.getEmail(), event.getUserId());
    }

    @EventListener
    public void onLoginSucceeded(com.smarterp.auth.event.LoginSucceededEvent event) {
        log.info("[AUDIT LOG] Login Succeeded for user: {}", event.getEmail());
    }

    @EventListener
    public void onPasswordChanged(com.smarterp.auth.event.PasswordChangedEvent event) {
        log.info("[AUDIT LOG] Password Changed for user: {}", event.getEmail());
    }

    @EventListener
    public void onRoleAssigned(com.smarterp.auth.event.RoleAssignedEvent event) {
        log.info("[AUDIT LOG] Role assigned to user {}: {}", event.getUserId(), event.getNewRole());
    }

    @EventListener
    public void onLedgerCreated(com.smarterp.accounting.ledger.event.LedgerCreatedEvent event) {
        saveAuditLog(event.getCompanyId(), "Ledger", event.getLedgerId(), "CREATED", "Ledger account created.", null);
    }

    @EventListener
    public void onLedgerUpdated(com.smarterp.accounting.ledger.event.LedgerUpdatedEvent event) {
        saveAuditLog(event.getCompanyId(), "Ledger", event.getLedgerId(), "UPDATED", "Ledger account parameters updated.", null);
    }

    @EventListener
    public void onPartnerCreated(com.smarterp.inventory.partner.event.PartnerCreatedEvent event) {
        saveAuditLog(event.getCompanyId(), "BusinessPartner", event.getPartnerId(), "CREATED", "Business Partner onboarded.", null);
    }

    @EventListener
    public void onPartnerUpdated(com.smarterp.inventory.partner.event.PartnerUpdatedEvent event) {
        saveAuditLog(event.getCompanyId(), "BusinessPartner", event.getPartnerId(), "UPDATED", "Business Partner profile updated.", null);
    }

    @EventListener
    public void onPartnerBlocked(com.smarterp.inventory.partner.event.PartnerBlockedEvent event) {
        saveAuditLog(event.getCompanyId(), "BusinessPartner", event.getPartnerId(), "BLOCKED", "Business Partner blocked.", null);
    }

    @EventListener
    public void onStockItemCreated(com.smarterp.inventory.master.event.StockItemCreatedEvent event) {
        saveAuditLog(event.getCompanyId(), "StockItem", event.getItemId(), "CREATED", "Stock Item " + event.getName() + " onboarded.", null);
    }

    @EventListener
    public void onStockAdjusted(com.smarterp.inventory.master.event.StockAdjustedEvent event) {
        saveAuditLog(event.getCompanyId(), "StockItem", event.getItemId(), "ADJUSTED", 
                "Stock quantity adjusted for " + event.getName() + ". Old Qty: " + event.getOldQuantity() + ", New Qty: " + event.getNewQuantity() + ". Reason: " + event.getReason(), null);
    }

    @EventListener
    public void onWarehouseCreated(com.smarterp.inventory.master.event.WarehouseCreatedEvent event) {
        saveAuditLog(event.getCompanyId(), "Warehouse", event.getWarehouseId(), "CREATED", "Warehouse " + event.getName() + " registered.", null);
    }

    @EventListener
    public void onPurchaseCreated(com.smarterp.inventory.purchase.event.PurchaseCreatedEvent event) {
        saveAuditLog(event.getCompanyId(), "Purchase", event.getPurchaseId(), "CREATED", 
                "Purchase Voucher created. Supplier: " + event.getSupplierName() + " | Grand Total: " + event.getGrandTotal(), event.getPerformedBy());
    }

    @EventListener
    public void onPurchaseApproved(com.smarterp.inventory.purchase.event.PurchaseApprovedEvent event) {
        saveAuditLog(event.getCompanyId(), "Purchase", event.getPurchaseId(), "APPROVED", "Purchase Invoice Approved & Posted to Ledgers.", event.getPerformedBy());
    }

    @EventListener
    public void onPurchaseCompleted(com.smarterp.inventory.purchase.event.PurchaseCompletedEvent event) {
        saveAuditLog(event.getCompanyId(), "Purchase", event.getPurchaseId(), "COMPLETED", "Purchase Voucher transaction cycle completed.", event.getPerformedBy());
    }
}
