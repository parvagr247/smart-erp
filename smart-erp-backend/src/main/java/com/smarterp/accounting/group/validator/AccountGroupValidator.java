package com.smarterp.accounting.group.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AccountGroupValidator {

    private final AccountGroupRepository repository;

    public void validateCreate(Company company, String name) {
        if (repository.existsByCompanyAndName(company, name.trim())) {
            throw new BusinessValidationException("Account group '" + name.trim() + "' already exists in this company.");
        }
    }

    public void validateUpdate(Company company, UUID groupId, String name) {
        if (repository.existsByCompanyAndNameAndIdNot(company, name.trim(), groupId)) {
            throw new BusinessValidationException("Another account group '" + name.trim() + "' already exists in this company.");
        }
    }

    public void validateDelete(AccountGroup group) {
        if (Boolean.TRUE.equals(group.getIsSystemGenerated())) {
            throw new BusinessValidationException("System-generated account groups cannot be deleted.");
        }
    }

    public void validateParentGroup(AccountGroup group, AccountGroup parentGroup) {
        if (parentGroup == null) return;

        // 1. Must belong to the same company
        if (!parentGroup.getCompany().getId().equals(group.getCompany().getId())) {
            throw new BusinessValidationException("Parent group must belong to the same company.");
        }

        // 2. Prevent circular reference (parentGroup cannot be the group itself)
        if (parentGroup.getId().equals(group.getId())) {
            throw new BusinessValidationException("A group cannot be its own parent.");
        }

        // 3. Traverse parent chain to prevent circular loops
        AccountGroup current = parentGroup;
        while (current.getParentGroup() != null) {
            if (current.getParentGroup().getId().equals(group.getId())) {
                throw new BusinessValidationException("Circular parent-child relationship detected.");
            }
            current = current.getParentGroup();
        }
    }
}
