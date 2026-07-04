package com.smarterp.inventory.master.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseRequest {
    @NotBlank(message = "Warehouse code is required.")
    private String code;
    
    @NotBlank(message = "Warehouse name is required.")
    private String name;
    
    private String address;
}
