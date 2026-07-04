package com.smarterp.inventory.sales.listener;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.accounting.voucher.entity.Voucher;
import com.smarterp.accounting.voucher.entity.VoucherLine;
import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.entity.VoucherType;
import com.smarterp.accounting.voucher.event.VoucherApprovedEvent;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import com.smarterp.accounting.voucher.service.VoucherService;
import com.smarterp.inventory.sales.entity.Sales;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import com.smarterp.inventory.sales.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class SalesAccountingListener {

    private final SalesRepository salesRepository;
    private final LedgerRepository ledgerRepository;
    private final AccountGroupRepository groupRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherService voucherService;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    @Transactional
    public void onSalesApproved(SalesApprovedEvent event) {
        log.info("Sales Accounting listener reacting to SalesApprovedEvent for Sales ID: {}", event.getSalesId());
        postSalesLedgerJournals(event.getSalesId());
    }

    private void postSalesLedgerJournals(java.util.UUID salesId) {
        Sales sales = salesRepository.findById(salesId).orElse(null);
        if (sales == null) return;
        Company company = sales.getCompany();

        // 1. Build Voucher Header
        Voucher voucher = Voucher.builder()
                .voucherNumber(voucherService.generateVoucherNo(company, VoucherType.JOURNAL))
                .voucherDate(sales.getSalesDate())
                .voucherType(VoucherType.JOURNAL)
                .status(VoucherStatus.APPROVED)
                .narration("Auto-posted from Sales Invoice: " + sales.getSalesNumber() + " | Customer: " + sales.getCustomer().getName())
                .company(company)
                .createdBy(sales.getCreatedBy())
                .lineItems(new ArrayList<>())
                .build();

        // 2. Debit Customer Ledger Account (grandTotal) under nature ASSET
        Ledger customerLedger = getOrCreateLedger(company, sales.getCustomer().getName() + " Ledger", "Current Assets", GroupNature.ASSET);
        VoucherLine customerLine = VoucherLine.builder()
                .voucher(voucher)
                .ledger(customerLedger)
                .amount(sales.getGrandTotal())
                .entryType("DEBIT")
                .build();
        voucher.getLineItems().add(customerLine);

        // 3. Credit Sales Account (taxable gross amount) under nature INCOME
        BigDecimal taxableTotal = sales.getGrossAmount().subtract(sales.getDiscountAmount());
        Ledger salesLedger = getOrCreateLedger(company, "Sales Account", "Sales", GroupNature.INCOME);
        VoucherLine salesLine = VoucherLine.builder()
                .voucher(voucher)
                .ledger(salesLedger)
                .amount(taxableTotal)
                .entryType("CREDIT")
                .build();
        voucher.getLineItems().add(salesLine);

        // 4. Credit Taxes (Duties & Taxes under Liabilities)
        if (sales.getCgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cgstLedger = getOrCreateLedger(company, "CGST Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(cgstLedger).amount(sales.getCgst()).entryType("CREDIT").build());
        }
        if (sales.getSgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger sgstLedger = getOrCreateLedger(company, "SGST Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(sgstLedger).amount(sales.getSgst()).entryType("CREDIT").build());
        }
        if (sales.getIgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger igstLedger = getOrCreateLedger(company, "IGST Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(igstLedger).amount(sales.getIgst()).entryType("CREDIT").build());
        }
        if (sales.getCess().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cessLedger = getOrCreateLedger(company, "CESS Output Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(cessLedger).amount(sales.getCess()).entryType("CREDIT").build());
        }

        // 5. Debit/Credit Round Off Account
        BigDecimal roundOff = sales.getRoundOff();
        if (roundOff != null && roundOff.compareTo(BigDecimal.ZERO) != 0) {
            Ledger roundOffLedger = getOrCreateLedger(company, "Round Off Account", "Indirect Expenses", GroupNature.EXPENSE);
            boolean isDebit = roundOff.compareTo(BigDecimal.ZERO) < 0; // Negative roundOff means we Debit Round Off Account
            VoucherLine roundLine = VoucherLine.builder()
                    .voucher(voucher)
                    .ledger(roundOffLedger)
                    .amount(roundOff.abs())
                    .entryType(isDebit ? "DEBIT" : "CREDIT")
                    .build();
            voucher.getLineItems().add(roundLine);
        }

        Voucher savedVoucher = voucherRepository.save(voucher);
        log.info("Voucher {} created & posted for Sales Invoice: {}", savedVoucher.getVoucherNumber(), sales.getSalesNumber());

        // Publish event to trigger VoucherAccountingListener for ledger balance updates
        eventPublisher.publishEvent(new VoucherApprovedEvent(this, savedVoucher.getId(), company.getId()));
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
                                } else if (groupName.equals("Indirect Expenses")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Expense").orElse(null);
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
