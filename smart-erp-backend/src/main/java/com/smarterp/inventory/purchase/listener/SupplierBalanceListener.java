package com.smarterp.inventory.purchase.listener;

import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class SupplierBalanceListener {

    private final PurchaseRepository purchaseRepository;
    private final PartnerRepository partnerRepository;

    @EventListener
    @Transactional
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Supplier balance listener reacting to PurchaseApprovedEvent for Purchase {}", event.getPurchaseId());
        Purchase purchase = purchaseRepository.findById(event.getPurchaseId()).orElse(null);
        if (purchase == null) return;

        BusinessPartner supplier = purchase.getSupplier();
        BigDecimal currentOutstanding = supplier.getOutstandingBalance() != null ? supplier.getOutstandingBalance() : BigDecimal.ZERO;
        
        supplier.setOutstandingBalance(currentOutstanding.add(purchase.getGrandTotal()));
        supplier.setLastPurchaseDate(purchase.getPurchaseDate());
        partnerRepository.save(supplier);
        log.info("Supplier {} outstanding balance updated to {}", supplier.getName(), supplier.getOutstandingBalance());
    }
}
