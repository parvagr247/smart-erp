package com.smarterp.inventory.master.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxCategoryRequest {
    @NotBlank(message = "Tax code is required.")
    private String taxCode;
    
    @NotBlank(message = "Tax category name is required.")
    private String name;
    
    @NotNull(message = "GST rate is required.")
    private BigDecimal gstRate;
    
    private BigDecimal cgstRate;
    private BigDecimal sgstRate;
    private BigDecimal igstRate;
    private BigDecimal cessRate;
    
    private LocalDate effectiveDate;
}
