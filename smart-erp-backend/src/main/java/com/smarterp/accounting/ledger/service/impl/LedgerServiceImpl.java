package com.smarterp.accounting.ledger.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.accounting.ledger.dto.LedgerRequest;
import com.smarterp.accounting.ledger.dto.LedgerResponse;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.event.LedgerCreatedEvent;
import com.smarterp.accounting.ledger.event.LedgerUpdatedEvent;
import com.smarterp.accounting.ledger.mapper.LedgerMapper;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.ledger.service.LedgerService;
import com.smarterp.accounting.ledger.validator.LedgerValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final LedgerMapper mapper;
    private final LedgerValidator validator;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public LedgerResponse createLedger(LedgerRequest request, Company company) {
        AccountGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + request.getGroupId()));

        validator.validateCreate(company, request, group);

        Ledger ledger = mapper.toEntity(request, company, group);
        Ledger savedLedger = repository.save(ledger);

        // Log Audit Event
        log.info("System Audit Log [Ledger Created] - Ledger ID: {}, Name: '{}', Company ID: {}", 
                 savedLedger.getId(), savedLedger.getName(), company.getId());

        // Publish Event
        eventPublisher.publishEvent(new LedgerCreatedEvent(this, savedLedger.getId(), company.getId()));

        return mapper.toResponse(savedLedger);
    }

    @Override
    public LedgerResponse updateLedger(UUID id, LedgerRequest request, Company company) {
        Ledger ledger = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found with ID: " + id));

        if (!ledger.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Ledger not found in this company scope.");
        }

        AccountGroup group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + request.getGroupId()));

        validator.validateUpdate(company, id, request, group);
        mapper.updateEntityFromRequest(request, ledger, group);

        Ledger updatedLedger = repository.save(ledger);

        // Log Audit Event
        log.info("System Audit Log [Ledger Updated] - Ledger ID: {}, Name: '{}', Company ID: {}", 
                 updatedLedger.getId(), updatedLedger.getName(), company.getId());

        // Publish Event
        eventPublisher.publishEvent(new LedgerUpdatedEvent(this, updatedLedger.getId(), company.getId()));

        return mapper.toResponse(updatedLedger);
    }

    @Override
    public void deleteLedger(UUID id, Company company) {
        Ledger ledger = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found with ID: " + id));

        if (!ledger.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Ledger not found in this company scope.");
        }

        repository.delete(ledger);

        // Log Audit Event
        log.info("System Audit Log [Ledger Deleted] - Ledger ID: {}, Name: '{}', Company ID: {}", 
                 id, ledger.getName(), company.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public LedgerResponse getLedger(UUID id, Company company) {
        Ledger ledger = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found with ID: " + id));

        if (!ledger.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Ledger not found in this company scope.");
        }

        return mapper.toResponse(ledger);
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
            search != null && !search.trim().isEmpty() ? search.trim() : null,
            groupId,
            isActive,
            balanceType,
            gstApplicable,
            pageable
        );
        
        return ledgersPage.map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long countLedgers(Company company) {
        return repository.countByCompany(company);
    }
}
