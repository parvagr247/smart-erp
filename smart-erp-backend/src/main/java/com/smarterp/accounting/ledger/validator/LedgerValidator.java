package com.smarterp.accounting.ledger.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.ledger.dto.LedgerRequest;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class LedgerValidator {

    private final LedgerRepository repository;

    public void validateCreate(Company company, LedgerRequest request, AccountGroup group) {
        // 1. Unique ledger names within a company
        if (repository.existsByCompanyAndName(company, request.getName().trim())) {
            throw new BusinessValidationException("Ledger '" + request.getName().trim() + "' already exists in this company.");
        }
        
        // 2. Validate group alignment
        validateGroup(company, group);

        // 3. Opening balance validation
        validateOpeningBalance(request);
    }

    public void validateUpdate(Company company, UUID ledgerId, LedgerRequest request, AccountGroup group) {
        // 1. Unique ledger name check
        if (repository.existsByCompanyAndNameAndIdNot(company, request.getName().trim(), ledgerId)) {
            throw new BusinessValidationException("Another ledger '" + request.getName().trim() + "' already exists in this company.");
        }
        
        // 2. Validate group alignment
        validateGroup(company, group);

        // 3. Opening balance validation
        validateOpeningBalance(request);
    }

    private void validateGroup(Company company, AccountGroup group) {
        if (!group.getCompany().getId().equals(company.getId())) {
            throw new BusinessValidationException("The selected account group does not belong to this company.");
        }
        if (Boolean.FALSE.equals(group.getIsActive())) {
            throw new BusinessValidationException("Selected group is currently inactive.");
        }
    }

    private void validateOpeningBalance(LedgerRequest request) {
        BigDecimal ob = request.getOpeningBalance();
        if (ob != null && ob.compareTo(BigDecimal.ZERO) > 0) {
            if (request.getBalanceType() == null) {
                throw new BusinessValidationException("Balance type (DEBIT or CREDIT) is required when opening balance is greater than zero.");
            }
        }
    }
}
