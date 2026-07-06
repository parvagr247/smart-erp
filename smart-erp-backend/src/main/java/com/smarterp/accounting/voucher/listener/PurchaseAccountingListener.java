package com.smarterp.accounting.voucher.listener;

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
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
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
public class PurchaseAccountingListener {

    private final PurchaseRepository purchaseRepository;
    private final LedgerRepository ledgerRepository;
    private final AccountGroupRepository groupRepository;
    private final VoucherRepository voucherRepository;
    private final VoucherService voucherService;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    @Transactional
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Accounting listener reacting to PurchaseApprovedEvent for Purchase {}", event.getPurchaseId());
        postLedgerJournals(event.getPurchaseId());
    }

    private void postLedgerJournals(java.util.UUID purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId).orElse(null);
        if (purchase == null) return;
        Company company = purchase.getCompany();

        // 1. Build Voucher Header
        Voucher voucher = Voucher.builder()
                .voucherNumber(voucherService.generateVoucherNo(company, VoucherType.JOURNAL))
                .voucherDate(purchase.getPurchaseDate())
                .voucherType(VoucherType.JOURNAL)
                .status(VoucherStatus.APPROVED)
                .narration("Auto-posted from Purchase Invoice: " + purchase.getPurchaseNumber() + " | Supplier: " + purchase.getSupplier().getName())
                .company(company)
                .createdBy(purchase.getCreatedBy())
                .lineItems(new ArrayList<>())
                .build();

        // 2. Debit Purchase Account (tax-exclusive taxable gross amount)
        BigDecimal taxableTotal = purchase.getGrossAmount().subtract(purchase.getDiscountAmount());
        Ledger purchaseLedger = getOrCreateLedger(company, "Purchase Account", "Purchase", GroupNature.EXPENSE);
        VoucherLine purchaseLine = VoucherLine.builder()
                .voucher(voucher)
                .ledger(purchaseLedger)
                .amount(taxableTotal)
                .entryType("DEBIT")
                .build();
        voucher.getLineItems().add(purchaseLine);

        // 3. Credit Supplier Account (grandTotal)
        Ledger supplierLedger = getOrCreateLedger(company, purchase.getSupplier().getName() + " Ledger", "Current Liabilities", GroupNature.LIABILITY);
        VoucherLine supplierLine = VoucherLine.builder()
                .voucher(voucher)
                .ledger(supplierLedger)
                .amount(purchase.getGrandTotal())
                .entryType("CREDIT")
                .build();
        voucher.getLineItems().add(supplierLine);

        // 4. Debit Taxes (Duties & Taxes under Liabilities)
        if (purchase.getCgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cgstLedger = getOrCreateLedger(company, "CGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(cgstLedger).amount(purchase.getCgst()).entryType("DEBIT").build());
        }
        if (purchase.getSgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger sgstLedger = getOrCreateLedger(company, "SGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(sgstLedger).amount(purchase.getSgst()).entryType("DEBIT").build());
        }
        if (purchase.getIgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger igstLedger = getOrCreateLedger(company, "IGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(igstLedger).amount(purchase.getIgst()).entryType("DEBIT").build());
        }
        if (purchase.getCess().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cessLedger = getOrCreateLedger(company, "CESS Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            voucher.getLineItems().add(VoucherLine.builder().voucher(voucher).ledger(cessLedger).amount(purchase.getCess()).entryType("DEBIT").build());
        }

        // 5. Debit/Credit Round Off Account
        BigDecimal roundOff = purchase.getRoundOff();
        if (roundOff != null && roundOff.compareTo(BigDecimal.ZERO) != 0) {
            Ledger roundOffLedger = getOrCreateLedger(company, "Round Off Account", "Indirect Expenses", GroupNature.EXPENSE);
            boolean isDebit = roundOff.compareTo(BigDecimal.ZERO) > 0;
            VoucherLine roundLine = VoucherLine.builder()
                    .voucher(voucher)
                    .ledger(roundOffLedger)
                    .amount(roundOff.abs())
                    .entryType(isDebit ? "DEBIT" : "CREDIT")
                    .build();
            voucher.getLineItems().add(roundLine);
        }

        Voucher savedVoucher = voucherRepository.save(voucher);
        log.info("Voucher {} created & posted for Purchase Invoice: {}", savedVoucher.getVoucherNumber(), purchase.getPurchaseNumber());

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
                                } else if (groupName.equals("Purchase")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Expense").orElse(null);
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
