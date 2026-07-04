package com.smarterp.accounting.group.dto;

import com.smarterp.accounting.group.entity.GroupNature;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountGroupResponse {
    private UUID id;
    private String name;
    private GroupNature nature;
    private UUID parentGroupId;
    private String parentGroupName;
    private String description;
    private Boolean isSystemGenerated;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AccountGroupResponse fromEntity(com.smarterp.accounting.group.entity.AccountGroup entity) {
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
}
