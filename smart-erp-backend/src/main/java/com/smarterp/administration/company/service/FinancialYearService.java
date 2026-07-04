package com.smarterp.administration.company.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FinancialYearService {

    private final CompanyRepository companyRepository;
    private final LedgerRepository ledgerRepository;

    public void switchFinancialYear(Company company, String nextFy) {
        log.info("Switching company {} financial year to: {}", company.getId(), nextFy);
        company.setFinancialYear(nextFy);
        companyRepository.save(company);
    }

    public void closeYearAndTransferBalances(Company company, String currentFy, String nextFy) {
        log.info("Closing financial year {} for company {} and transferring opening balances to {}", currentFy, company.getId(), nextFy);
        
        List<Ledger> ledgers = ledgerRepository.findByCompany(company);
        for (Ledger ledger : ledgers) {
            BigDecimal currentBalance = ledger.getOpeningBalance() != null ? ledger.getOpeningBalance() : BigDecimal.ZERO;
            
            if (ledger.getGroup() != null) {
                var nature = ledger.getGroup().getNature();
                if (nature == com.smarterp.accounting.group.entity.GroupNature.ASSET || 
                    nature == com.smarterp.accounting.group.entity.GroupNature.LIABILITY) {
                    ledger.setOpeningBalance(currentBalance);
                } else {
                    ledger.setOpeningBalance(BigDecimal.ZERO);
                }
            }
            ledgerRepository.save(ledger);
        }
        
        company.setFinancialYear(nextFy);
        companyRepository.save(company);
    }
}
