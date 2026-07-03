package com.smarterp.inventory.master.dto;

import com.smarterp.inventory.master.entity.InventoryTransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransactionRequest {
    @NotNull(message = "Stock Item is required")
    private UUID stockItemId;

    @NotNull(message = "Warehouse is required")
    private UUID warehouseId;

    private UUID targetWarehouseId;

    @NotNull(message = "Transaction type is required")
    private InventoryTransactionType transactionType;

    @NotNull(message = "Quantity is required")
    private BigDecimal quantity;

    private BigDecimal rate;

    @NotNull(message = "Reference Number is required")
    private String referenceNumber;

    private LocalDate transactionDate;

    private String notes;
}
