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
}
