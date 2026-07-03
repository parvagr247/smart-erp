package com.smarterp.inventory.master.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnitRequest {
    @NotBlank(message = "Unit code is required.")
    private String code;
    
    @NotBlank(message = "Unit name is required.")
    private String name;
    
    private String abbreviation;
    
    @Builder.Default
    private Integer decimalPrecision = 0;
}
