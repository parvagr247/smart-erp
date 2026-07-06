package com.smarterp.accounting.voucher.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.voucher.dto.VoucherLineRequest;
import com.smarterp.accounting.voucher.dto.VoucherRequest;
import com.smarterp.accounting.voucher.entity.VoucherStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class VoucherValidator {

    private final LedgerRepository ledgerRepository;

    public void validateRequest(VoucherRequest request, Company company) {
        if (request.getLineItems() == null || request.getLineItems().size() < 2) {
            throw new BusinessValidationException("A voucher must contain at least 2 ledger entries.");
        }
        
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;
        
        for (VoucherLineRequest line : request.getLineItems()) {
            if (line.getLedgerId() == null) {
                throw new BusinessValidationException("Ledger ID is required.");
            }
            if (line.getAmount() == null || line.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Amount must be greater than zero.");
            }
            if (line.getEntryType() == null || (!"DEBIT".equalsIgnoreCase(line.getEntryType()) && !"CREDIT".equalsIgnoreCase(line.getEntryType()))) {
                throw new BusinessValidationException("Entry type must be DEBIT or CREDIT.");
            }
            
            ledgerRepository.findById(line.getLedgerId())
                    .filter(l -> l.getCompany().getId().equals(company.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Ledger not found."));

            if ("DEBIT".equalsIgnoreCase(line.getEntryType())) {
                totalDebit = totalDebit.add(line.getAmount());
            } else {
                totalCredit = totalCredit.add(line.getAmount());
            }
        }
        
        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new BusinessValidationException("Voucher is out of balance. Total Debits: " + totalDebit + ", Total Credits: " + totalCredit);
        }
    }

    public boolean canTransition(VoucherStatus current, VoucherStatus target) {
        if (current == target) return true;
        switch (current) {
            case DRAFT:
                return target == VoucherStatus.APPROVED || target == VoucherStatus.CANCELLED;
            case APPROVED:
                return target == VoucherStatus.CANCELLED;
            case CANCELLED:
                return false;
            default:
                return false;
        }
    }
}
