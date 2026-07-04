package com.smarterp.accounting.group.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.accounting.group.dto.AccountGroupRequest;
import com.smarterp.accounting.group.dto.AccountGroupResponse;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.group.event.GroupCreatedEvent;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.accounting.group.service.AccountGroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AccountGroupServiceImpl implements AccountGroupService {

    private final AccountGroupRepository repository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public AccountGroupResponse createGroup(AccountGroupRequest request, Company company) {
        validateCreate(company, request.getName());
        
        AccountGroup parentGroup = null;
        if (request.getParentGroupId() != null) {
            parentGroup = repository.findById(request.getParentGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent group not found with ID: " + request.getParentGroupId()));
        }

        AccountGroup group = request.toEntity(company, parentGroup);
        validateParentGroup(group, parentGroup);
        
        AccountGroup savedGroup = repository.save(group);
        
        // Log Audit Event
        log.info("System Audit Log [Group Created] - Group ID: {}, Name: '{}', Company ID: {}", 
                 savedGroup.getId(), savedGroup.getName(), company.getId());

        // Publish Event
        eventPublisher.publishEvent(new GroupCreatedEvent(this, savedGroup.getId(), company.getId()));

        return AccountGroupResponse.fromEntity(savedGroup);
    }

    @Override
    public AccountGroupResponse updateGroup(UUID id, AccountGroupRequest request, Company company) {
        AccountGroup group = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + id));

        if (!group.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Account group not found in this company scope.");
        }

        validateUpdate(company, id, request.getName());

        AccountGroup parentGroup = null;
        if (request.getParentGroupId() != null) {
            parentGroup = repository.findById(request.getParentGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent group not found with ID: " + request.getParentGroupId()));
        }

        validateParentGroup(group, parentGroup);
        request.updateEntity(group, parentGroup);

        AccountGroup updatedGroup = repository.save(group);

        // Log Audit Event
        log.info("System Audit Log [Group Updated] - Group ID: {}, Name: '{}', Company ID: {}", 
                 updatedGroup.getId(), updatedGroup.getName(), company.getId());

        return AccountGroupResponse.fromEntity(updatedGroup);
    }

    @Override
    public void deleteGroup(UUID id, Company company) {
        AccountGroup group = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + id));

        if (!group.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Account group not found in this company scope.");
        }

        validateDelete(group);
        repository.delete(group);

        // Log Audit Event
        log.info("System Audit Log [Group Deleted] - Group ID: {}, Name: '{}', Company ID: {}", 
                 id, group.getName(), company.getId());
    }

    @Override
    @Transactional
    public List<AccountGroupResponse> getGroups(Company company) {
        List<AccountGroup> groups = repository.findByCompanyOrderByNameAsc(company);
        if (groups.isEmpty()) {
            log.info("Self-healing: pre-populating default account groups for company {}", company.getId());
            initializeStandardGroups(company);
            groups = repository.findByCompanyOrderByNameAsc(company);
        }
        return groups.stream()
                .map(AccountGroupResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void initializeStandardGroups(Company company) {
        // 1. Assets Tree
        AccountGroup assets = createSystemGroup("Assets", GroupNature.ASSET, null, company);
        AccountGroup currentAssets = createSystemGroup("Current Assets", GroupNature.ASSET, assets, company);
        createSystemGroup("Bank Accounts", GroupNature.ASSET, currentAssets, company);
        createSystemGroup("Cash-in-Hand", GroupNature.ASSET, currentAssets, company);
        createSystemGroup("Fixed Assets", GroupNature.ASSET, assets, company);

        // 2. Liabilities Tree
        AccountGroup liabilities = createSystemGroup("Liabilities", GroupNature.LIABILITY, null, company);
        AccountGroup currentLiabilities = createSystemGroup("Current Liabilities", GroupNature.LIABILITY, liabilities, company);
        createSystemGroup("Duties & Taxes", GroupNature.LIABILITY, currentLiabilities, company);
        createSystemGroup("Loans", GroupNature.LIABILITY, liabilities, company);

        // 3. Capital (Equity)
        createSystemGroup("Capital", GroupNature.CAPITAL, null, company);

        // 4. Income Tree
        AccountGroup income = createSystemGroup("Income", GroupNature.INCOME, null, company);
        AccountGroup directIncome = createSystemGroup("Direct Income", GroupNature.INCOME, income, company);
        createSystemGroup("Sales", GroupNature.INCOME, directIncome, company);
        createSystemGroup("Indirect Income", GroupNature.INCOME, income, company);

        // 5. Expense Tree
        AccountGroup expense = createSystemGroup("Expense", GroupNature.EXPENSE, null, company);
        AccountGroup directExpense = createSystemGroup("Direct Expense", GroupNature.EXPENSE, expense, company);
        createSystemGroup("Purchase", GroupNature.EXPENSE, directExpense, company);
        createSystemGroup("Indirect Expense", GroupNature.EXPENSE, expense, company);
    }

    private AccountGroup createSystemGroup(String name, GroupNature nature, AccountGroup parent, Company company) {
        AccountGroup group = AccountGroup.builder()
                .name(name)
                .nature(nature)
                .parentGroup(parent)
                .description("System-generated " + name + " account group.")
                .company(company)
                .isSystemGenerated(true)
                .isActive(true)
                .build();
        return repository.save(group);
    }

    @Override
    @Transactional(readOnly = true)
    public AccountGroupResponse getGroup(UUID id, Company company) {
        AccountGroup group = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + id));

        if (!group.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Account group not found in this company scope.");
        }

        return AccountGroupResponse.fromEntity(group);
    }

    @Override
    @Transactional(readOnly = true)
    public long countGroups(Company company) {
        return repository.countByCompany(company);
    }

    /* ==========================================================================
       Validation Rules
       ========================================================================== */
    private void validateCreate(Company company, String name) {
        if (repository.existsByCompanyAndName(company, name.trim())) {
            throw new BusinessValidationException("Account group '" + name.trim() + "' already exists in this company.");
        }
    }

    private void validateUpdate(Company company, UUID groupId, String name) {
        if (repository.existsByCompanyAndNameAndIdNot(company, name.trim(), groupId)) {
            throw new BusinessValidationException("Another account group '" + name.trim() + "' already exists in this company.");
        }
    }

    private void validateDelete(AccountGroup group) {
        if (Boolean.TRUE.equals(group.getIsSystemGenerated())) {
            throw new BusinessValidationException("System-generated account groups cannot be deleted.");
        }
    }

    private void validateParentGroup(AccountGroup group, AccountGroup parentGroup) {
        if (parentGroup == null) return;

        if (!parentGroup.getCompany().getId().equals(group.getCompany().getId())) {
            throw new BusinessValidationException("Parent group must belong to the same company.");
        }

        if (parentGroup.getId().equals(group.getId())) {
            throw new BusinessValidationException("A group cannot be its own parent.");
        }

        AccountGroup current = parentGroup;
        while (current.getParentGroup() != null) {
            if (current.getParentGroup().getId().equals(group.getId())) {
                throw new BusinessValidationException("Circular parent-child relationship detected.");
            }
            current = current.getParentGroup();
        }
    }
}
