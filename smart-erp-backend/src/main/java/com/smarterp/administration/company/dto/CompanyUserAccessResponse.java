package com.smarterp.administration.company.dto;

import com.smarterp.auth.entity.enums.Role;
import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUserAccessResponse {
    private UUID userId;
    private String fullName;
    private String email;
    private Role role;
    private boolean hasAccess;
}
