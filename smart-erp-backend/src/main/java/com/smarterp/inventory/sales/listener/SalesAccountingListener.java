package com.smarterp.inventory.sales.listener;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.inventory.sales.entity.Sales;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import com.smarterp.inventory.sales.event.SalesCompletedEvent;
import com.smarterp.inventory.sales.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class SalesAccountingListener {

    private final SalesRepository salesRepository;
    private final LedgerRepository ledgerRepository;
    private final AccountGroupRepository groupRepository;

    @EventListener
    @Transactional
    public void onSalesApproved(SalesApprovedEvent event) {
        log.info("Sales Accounting listener reacting to SalesApprovedEvent for Sales ID: {}", event.getSalesId());
        postSalesLedgerJournals(event.getSalesId());
    }

    @EventListener
    @Transactional
    public void onSalesCompleted(SalesCompletedEvent event) {
        log.info("Sales Accounting listener reacting to SalesCompletedEvent for Sales ID: {}", event.getSalesId());
        postSalesLedgerJournals(event.getSalesId());
    }

    private void postSalesLedgerJournals(java.util.UUID salesId) {
        Sales sales = salesRepository.findById(salesId).orElse(null);
        if (sales == null) return;
        Company company = sales.getCompany();

        // 1. Debit Customer Ledger Account (grandTotal) under nature ASSET
        Ledger customerLedger = getOrCreateLedger(company, sales.getCustomer().getName() + " Ledger", "Current Assets", GroupNature.ASSET);
        customerLedger.setOpeningBalance(customerLedger.getOpeningBalance().add(sales.getGrandTotal()));
        ledgerRepository.save(customerLedger);

        // 2. Credit Sales Account (taxable gross amount) under nature INCOME
        BigDecimal taxableTotal = sales.getGrossAmount().subtract(sales.getDiscountAmount());
        Ledger salesLedger = getOrCreateLedger(company, "Sales Account", "Sales", GroupNature.INCOME);
        salesLedger.setOpeningBalance(salesLedger.getOpeningBalance().add(taxableTotal));
        ledgerRepository.save(salesLedger);

        // 3. Credit Taxes (Duties & Taxes under Liabilities)
        if (sales.getCgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cgstLedger = getOrCreateLedger(company, "CGST Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            cgstLedger.setOpeningBalance(cgstLedger.getOpeningBalance().add(sales.getCgst()));
            ledgerRepository.save(cgstLedger);
        }
        if (sales.getSgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger sgstLedger = getOrCreateLedger(company, "SGST Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            sgstLedger.setOpeningBalance(sgstLedger.getOpeningBalance().add(sales.getSgst()));
            ledgerRepository.save(sgstLedger);
        }
        if (sales.getIgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger igstLedger = getOrCreateLedger(company, "IGST Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            igstLedger.setOpeningBalance(igstLedger.getOpeningBalance().add(sales.getIgst()));
            ledgerRepository.save(igstLedger);
        }
        if (sales.getCess().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cessLedger = getOrCreateLedger(company, "CESS Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            cessLedger.setOpeningBalance(cessLedger.getOpeningBalance().add(sales.getCess()));
            ledgerRepository.save(cessLedger);
        }
        log.info("Ledger balances successfully posted for Sales Invoice: {}", sales.getSalesNumber());
    }

    private Ledger getOrCreateLedger(Company company, String name, String groupName, GroupNature nature) {
        return ledgerRepository.findByCompanyAndName(company, name)
                .orElseGet(() -> {
                    AccountGroup group = groupRepository.findByCompanyAndName(company, groupName)
                            .orElseGet(() -> {
                                AccountGroup parent = null;
                                if (groupName.equals("Duties & Taxes")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Current Liabilities").orElse(null);
                                } else if (groupName.equals("Sales")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Income").orElse(null);
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
