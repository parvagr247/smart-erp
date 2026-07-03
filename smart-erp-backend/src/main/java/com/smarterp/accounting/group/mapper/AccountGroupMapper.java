package com.smarterp.accounting.group.mapper;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.group.dto.AccountGroupRequest;
import com.smarterp.accounting.group.dto.AccountGroupResponse;
import com.smarterp.accounting.group.entity.AccountGroup;
import org.springframework.stereotype.Component;

@Component
public class AccountGroupMapper {

    public AccountGroup toEntity(AccountGroupRequest request, Company company, AccountGroup parentGroup) {
        if (request == null) return null;
        return AccountGroup.builder()
                .name(request.getName().trim())
                .nature(request.getNature())
                .parentGroup(parentGroup)
                .description(request.getDescription())
                .company(company)
                .isSystemGenerated(false)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
    }

    public AccountGroupResponse toResponse(AccountGroup entity) {
        if (entity == null) return null;
        return AccountGroupResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .nature(entity.getNature())
                .parentGroupId(entity.getParentGroup() != null ? entity.getParentGroup().getId() : null)
                .parentGroupName(entity.getParentGroup() != null ? entity.getParentGroup().getName() : null)
                .description(entity.getDescription())
                .isSystemGenerated(entity.getIsSystemGenerated())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(AccountGroupRequest request, AccountGroup entity, AccountGroup parentGroup) {
        if (request == null || entity == null) return;
        entity.setName(request.getName().trim());
        entity.setNature(request.getNature());
        entity.setParentGroup(parentGroup);
        entity.setDescription(request.getDescription());
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }
    }
}
