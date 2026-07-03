package com.smarterp.accounting.ledger.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.dto.LedgerRequest;
import com.smarterp.accounting.ledger.dto.LedgerResponse;
import com.smarterp.accounting.ledger.entity.BalanceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface LedgerService {

    LedgerResponse createLedger(LedgerRequest request, Company company);

    LedgerResponse updateLedger(UUID id, LedgerRequest request, Company company);

    void deleteLedger(UUID id, Company company);

    LedgerResponse getLedger(UUID id, Company company);

    Page<LedgerResponse> searchAndFilterLedgers(
        Company company,
        String search,
        UUID groupId,
        Boolean isActive,
        BalanceType balanceType,
        Boolean gstApplicable,
        Pageable pageable
    );
    
    long countLedgers(Company company);
}
