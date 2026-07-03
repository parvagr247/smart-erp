package com.smarterp.inventory.master.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenericLookupRequest {
    @NotBlank(message = "Name field is required.")
    private String name;
    
    private String description;
    
    private String code;
    
    private Integer dueDays;
    
    private String symbol;
    
    private java.math.BigDecimal exchangeRate;
}
