package com.smarterp.inventory.partner.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {
    private UUID id;
    
    @NotBlank(message = "Address type is required.")
    private String addressType;
    
    @NotBlank(message = "Address line 1 is required.")
    private String addressLine1;
    
    private String addressLine2;
    
    @NotBlank(message = "City is required.")
    private String city;
    
    @NotBlank(message = "State is required.")
    private String state;
    
    @NotBlank(message = "Country is required.")
    private String country;
    
    @NotBlank(message = "Pincode is required.")
    private String pincode;
}
