package com.smarterp.inventory.purchase.listener;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.event.PurchaseCompletedEvent;
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
public class PurchaseAccountingListener {

    private final PurchaseRepository purchaseRepository;
    private final LedgerRepository ledgerRepository;
    private final AccountGroupRepository groupRepository;

    @EventListener
    @Transactional
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Accounting listener reacting to PurchaseApprovedEvent for Purchase {}", event.getPurchaseId());
        postLedgerJournals(event.getPurchaseId());
    }

    @EventListener
    @Transactional
    public void onPurchaseCompleted(PurchaseCompletedEvent event) {
        log.info("Accounting listener reacting to PurchaseCompletedEvent for Purchase {}", event.getPurchaseId());
        postLedgerJournals(event.getPurchaseId());
    }

    private void postLedgerJournals(java.util.UUID purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId).orElse(null);
        if (purchase == null) return;
        Company company = purchase.getCompany();

        // 1. Debit Purchase Account (tax-exclusive taxable gross amount)
        BigDecimal taxableTotal = purchase.getGrossAmount().subtract(purchase.getDiscountAmount());
        Ledger purchaseLedger = getOrCreateLedger(company, "Purchase Account", "Purchase", GroupNature.EXPENSE);
        purchaseLedger.setOpeningBalance(purchaseLedger.getOpeningBalance().add(taxableTotal));
        ledgerRepository.save(purchaseLedger);

        // 2. Credit Supplier Account (grandTotal)
        Ledger supplierLedger = getOrCreateLedger(company, purchase.getSupplier().getName() + " Ledger", "Current Liabilities", GroupNature.LIABILITY);
        supplierLedger.setOpeningBalance(supplierLedger.getOpeningBalance().add(purchase.getGrandTotal()));
        ledgerRepository.save(supplierLedger);

        // 3. Debit Taxes (Duties & Taxes under Liabilities)
        if (purchase.getCgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cgstLedger = getOrCreateLedger(company, "CGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            cgstLedger.setOpeningBalance(cgstLedger.getOpeningBalance().subtract(purchase.getCgst()));
            ledgerRepository.save(cgstLedger);
        }
        if (purchase.getSgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger sgstLedger = getOrCreateLedger(company, "SGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            sgstLedger.setOpeningBalance(sgstLedger.getOpeningBalance().subtract(purchase.getSgst()));
            ledgerRepository.save(sgstLedger);
        }
        if (purchase.getIgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger igstLedger = getOrCreateLedger(company, "IGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            igstLedger.setOpeningBalance(igstLedger.getOpeningBalance().subtract(purchase.getIgst()));
            ledgerRepository.save(igstLedger);
        }
        if (purchase.getCess().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cessLedger = getOrCreateLedger(company, "CESS Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            cessLedger.setOpeningBalance(cessLedger.getOpeningBalance().subtract(purchase.getCess()));
            ledgerRepository.save(cessLedger);
        }
        log.info("Ledger balances updated for Purchase: {}", purchase.getPurchaseNumber());
    }

    private Ledger getOrCreateLedger(Company company, String name, String groupName, GroupNature nature) {
        return ledgerRepository.findByCompanyAndName(company, name)
                .orElseGet(() -> {
                    AccountGroup group = groupRepository.findByCompanyAndName(company, groupName)
                            .orElseGet(() -> {
                                AccountGroup parent = null;
                                if (groupName.equals("Duties & Taxes")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Current Liabilities").orElse(null);
                                } else if (groupName.equals("Purchase")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Expense").orElse(null);
                                } else if (groupName.equals("Current Assets")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Assets").orElse(null);
                                }
                                return groupRepository.save(AccountGroup.builder()
                                        .name(groupName)
                                        .nature(nature)
                                        .parentGroup(parent)
                                        .company(company)
                                        .isSystemGenerated(true)
                                        .isActive(true)
                                        .build());
                            });
                    return ledgerRepository.save(Ledger.builder()
                            .name(name)
                            .group(group)
                            .company(company)
                            .balanceType(nature == GroupNature.ASSET || nature == GroupNature.EXPENSE ? BalanceType.DEBIT : BalanceType.CREDIT)
                            .openingBalance(BigDecimal.ZERO)
                            .isActive(true)
                            .build());
                });
    }
}
