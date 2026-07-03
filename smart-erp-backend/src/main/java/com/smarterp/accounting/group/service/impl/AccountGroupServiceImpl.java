package com.smarterp.accounting.group.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.group.dto.AccountGroupRequest;
import com.smarterp.accounting.group.dto.AccountGroupResponse;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.event.GroupCreatedEvent;
import com.smarterp.accounting.group.mapper.AccountGroupMapper;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.accounting.group.service.AccountGroupService;
import com.smarterp.accounting.group.validator.AccountGroupValidator;
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
    private final AccountGroupMapper mapper;
    private final AccountGroupValidator validator;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public AccountGroupResponse createGroup(AccountGroupRequest request, Company company) {
        validator.validateCreate(company, request.getName());
        
        AccountGroup parentGroup = null;
        if (request.getParentGroupId() != null) {
            parentGroup = repository.findById(request.getParentGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent group not found with ID: " + request.getParentGroupId()));
        }

        AccountGroup group = mapper.toEntity(request, company, parentGroup);
        validator.validateParentGroup(group, parentGroup);
        
        AccountGroup savedGroup = repository.save(group);
        
        // Log Audit Event
        log.info("System Audit Log [Group Created] - Group ID: {}, Name: '{}', Company ID: {}", 
                 savedGroup.getId(), savedGroup.getName(), company.getId());

        // Publish Event
        eventPublisher.publishEvent(new GroupCreatedEvent(this, savedGroup.getId(), company.getId()));

        return mapper.toResponse(savedGroup);
    }

    @Override
    public AccountGroupResponse updateGroup(UUID id, AccountGroupRequest request, Company company) {
        AccountGroup group = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + id));

        if (!group.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Account group not found in this company scope.");
        }

        validator.validateUpdate(company, id, request.getName());

        AccountGroup parentGroup = null;
        if (request.getParentGroupId() != null) {
            parentGroup = repository.findById(request.getParentGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent group not found with ID: " + request.getParentGroupId()));
        }

        validator.validateParentGroup(group, parentGroup);
        mapper.updateEntityFromRequest(request, group, parentGroup);

        AccountGroup updatedGroup = repository.save(group);

        // Log Audit Event
        log.info("System Audit Log [Group Updated] - Group ID: {}, Name: '{}', Company ID: {}", 
                 updatedGroup.getId(), updatedGroup.getName(), company.getId());

        return mapper.toResponse(updatedGroup);
    }

    @Override
    public void deleteGroup(UUID id, Company company) {
        AccountGroup group = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + id));

        if (!group.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Account group not found in this company scope.");
        }

        validator.validateDelete(group);
        repository.delete(group);

        // Log Audit Event
        log.info("System Audit Log [Group Deleted] - Group ID: {}, Name: '{}', Company ID: {}", 
                 id, group.getName(), company.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountGroupResponse> getGroups(Company company) {
        return repository.findByCompanyOrderByNameAsc(company)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountGroupResponse getGroup(UUID id, Company company) {
        AccountGroup group = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account group not found with ID: " + id));

        if (!group.getCompany().getId().equals(company.getId())) {
            throw new ResourceNotFoundException("Account group not found in this company scope.");
        }

        return mapper.toResponse(group);
    }

    @Override
    @Transactional(readOnly = true)
    public long countGroups(Company company) {
        return repository.countByCompany(company);
    }
}
