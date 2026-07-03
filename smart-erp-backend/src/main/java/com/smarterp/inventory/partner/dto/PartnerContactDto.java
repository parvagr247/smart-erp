package com.smarterp.inventory.partner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerContactDto {
    private UUID id;
    
    @NotBlank(message = "Contact name is required.")
    private String contactName;
    
    private String designation;
    
    private String email;
    
    private String phone;
    
    private String mobile;
    
    @Builder.Default
    private Boolean isPrimary = false;
}
