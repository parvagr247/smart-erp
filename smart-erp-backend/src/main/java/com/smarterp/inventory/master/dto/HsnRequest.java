package com.smarterp.inventory.master.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HsnRequest {
    @NotBlank(message = "HSN code is required.")
    private String hsnCode;
    
    private String description;
    
    private UUID taxCategoryId;
}
