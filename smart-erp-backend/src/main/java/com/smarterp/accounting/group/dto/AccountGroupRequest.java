package com.smarterp.accounting.group.dto;

import com.smarterp.accounting.group.entity.GroupNature;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountGroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(min = 2, max = 100, message = "Group name must be between 2 and 100 characters")
    private String name;

    @NotNull(message = "Group nature is required")
    private GroupNature nature;

    private UUID parentGroupId;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    private Boolean isActive;

    public com.smarterp.accounting.group.entity.AccountGroup toEntity(
            com.smarterp.administration.company.entity.Company company, 
            com.smarterp.accounting.group.entity.AccountGroup parentGroup) {
        return com.smarterp.accounting.group.entity.AccountGroup.builder()
                .name(this.name.trim())
                .nature(this.nature)
                .parentGroup(parentGroup)
                .description(this.description)
                .company(company)
                .isSystemGenerated(false)
                .isActive(this.isActive != null ? this.isActive : true)
                .build();
    }

    public void updateEntity(
            com.smarterp.accounting.group.entity.AccountGroup entity, 
            com.smarterp.accounting.group.entity.AccountGroup parentGroup) {
        if (entity == null) return;
        entity.setName(this.name.trim());
        entity.setNature(this.nature);
        entity.setParentGroup(parentGroup);
        entity.setDescription(this.description);
        if (this.isActive != null) {
            entity.setIsActive(this.isActive);
        }
    }
}
