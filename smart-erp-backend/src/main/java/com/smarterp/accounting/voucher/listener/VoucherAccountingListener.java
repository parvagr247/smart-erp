package com.smarterp.accounting.voucher.listener;

import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.voucher.entity.Voucher;
import com.smarterp.accounting.voucher.entity.VoucherLine;
import com.smarterp.accounting.voucher.event.VoucherApprovedEvent;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class VoucherAccountingListener {

    private final VoucherRepository repository;
    private final LedgerRepository ledgerRepository;

    @EventListener
    @Transactional
    public void onVoucherApproved(VoucherApprovedEvent event) {
        log.info("Voucher Accounting listener reacting to VoucherApprovedEvent for Voucher ID: {}", event.getVoucherId());
        Voucher voucher = repository.findById(event.getVoucherId()).orElse(null);
        if (voucher == null) return;

        for (VoucherLine line : voucher.getLineItems()) {
            Ledger ledger = line.getLedger();
            BigDecimal amount = line.getAmount();
            boolean isDebit = "DEBIT".equalsIgnoreCase(line.getEntryType());

            boolean isDebitNature = ledger.getBalanceType() == BalanceType.DEBIT;

            BigDecimal delta = amount;
            if (isDebit) {
                if (!isDebitNature) {
                    delta = amount.negate(); // Debit decreases Credit-nature accounts (Liability, Equity, Income)
                }
            } else { // CREDIT
                if (isDebitNature) {
                    delta = amount.negate(); // Credit decreases Debit-nature accounts (Asset, Expense)
                }
            }

            ledger.setOpeningBalance(ledger.getOpeningBalance().add(delta));
            ledgerRepository.save(ledger);
            log.info("Updated ledger {} balance by delta {} (New Balance: {})", ledger.getName(), delta, ledger.getOpeningBalance());
        }
    }
}
