package com.smarterp.accounting.ledger.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.accounting.ledger.dto.LedgerRequest;
import com.smarterp.accounting.ledger.dto.LedgerResponse;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.ledger.service.LedgerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.smarterp.common.aop.annotations.AuditOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LedgerServiceImpl implements LedgerService {

    private final LedgerRepository repository;
    private final AccountGroupRepository groupRepository;

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    @AuditOperation(action = "CREATED", entityType = "Ledger", details = "'Ledger account created.'")
    public LedgerResponse createLedger(LedgerRequest request, Company company) {
        AccountGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + request.getGroupId()));

        validateCreate(company, request, group);

        Ledger ledger = request.toEntity(company, group);
        Ledger savedLedger = repository.save(ledger);

        return LedgerResponse.fromEntity(savedLedger);
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = "ledgers", key = "#company.id + '-' + #id"),
        @CacheEvict(value = "dashboard", key = "#company.id")
    })
    @AuditOperation(action = "UPDATED", entityType = "Ledger", details = "'Ledger account parameters updated.'")
    public LedgerResponse updateLedger(UUID id, LedgerRequest request, Company company) {
        Ledger ledger = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found with ID: " + id));

        if (!ledger.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Ledger not found in this company scope.");
        }

        AccountGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + request.getGroupId()));

        validateUpdate(company, id, request, group);
        request.updateEntity(ledger, group);

        Ledger updatedLedger = repository.save(ledger);

        return LedgerResponse.fromEntity(updatedLedger);
    }

    @Override
    @Caching(evict = {
        @CacheEvict(value = "ledgers", key = "#company.id + '-' + #id"),
        @CacheEvict(value = "dashboard", key = "#company.id")
    })
    @AuditOperation(action = "DELETED", entityType = "Ledger", details = "'Ledger account deleted.'", entityId = "#id")
    public void deleteLedger(UUID id, Company company) {
        Ledger ledger = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found with ID: " + id));

        if (!ledger.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Ledger not found in this company scope.");
        }

        repository.delete(ledger);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "ledgers", key = "#company.id + '-' + #id")
    public LedgerResponse getLedger(UUID id, Company company) {
        Ledger ledger = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found with ID: " + id));

        if (!ledger.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Ledger not found in this company scope.");
        }

        return LedgerResponse.fromEntity(ledger);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LedgerResponse> searchAndFilterLedgers(
            Company company,
            String search,
            UUID groupId,
            Boolean isActive,
            BalanceType balanceType,
            Boolean gstApplicable,
            Pageable pageable) {
        
        Page<Ledger> ledgersPage = repository.searchAndFilter(
            company,
            search != null && !search.trim().isEmpty() ? "%" + search.trim().toLowerCase() + "%" : null,
            groupId,
            isActive,
            balanceType,
            gstApplicable,
            pageable
        );
        
        return ledgersPage.map(LedgerResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public long countLedgers(Company company) {
        return repository.countByCompany(company);
    }

    /* ==========================================================================
       Validation Rules
       ========================================================================== */
    private void validateCreate(Company company, LedgerRequest request, AccountGroup group) {
        if (repository.existsByCompanyAndName(company, request.getName().trim())) {
            throw new BusinessValidationException("Ledger '" + request.getName().trim() + "' already exists in this company.");
        }
        validateGroup(company, group);
        validateOpeningBalance(request);
    }

    private void validateUpdate(Company company, UUID ledgerId, LedgerRequest request, AccountGroup group) {
        if (repository.existsByCompanyAndNameAndIdNot(company, request.getName().trim(), ledgerId)) {
            throw new BusinessValidationException("Another ledger '" + request.getName().trim() + "' already exists in this company.");
        }
        validateGroup(company, group);
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
        java.math.BigDecimal ob = request.getOpeningBalance();
        if (ob != null && ob.compareTo(java.math.BigDecimal.ZERO) > 0) {
            if (request.getBalanceType() == null) {
                throw new BusinessValidationException("Balance type (DEBIT or CREDIT) is required when opening balance is greater than zero.");
            }
        }
    }
}
