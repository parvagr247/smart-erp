package com.smarterp.inventory.sales.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesLineRequest {
    private UUID id;

    @NotNull(message = "Stock Item ID is required")
    private UUID stockItemId;

    private UUID warehouseId;

    @NotNull(message = "Quantity is required")
    private BigDecimal quantity;

    @NotNull(message = "Rate is required")
    private BigDecimal rate;

    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal taxPercentage = BigDecimal.ZERO;

    private String batchNumber;
}
