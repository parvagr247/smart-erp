package com.smarterp.inventory.master.dto;

import com.smarterp.inventory.master.entity.InventoryTransactionType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransactionResponse {
    private UUID id;
    private UUID stockItemId;
    private String stockItemName;
    private String sku;
    private UUID warehouseId;
    private String warehouseName;
    private UUID targetWarehouseId;
    private String targetWarehouseName;
    private InventoryTransactionType transactionType;
    private BigDecimal quantity;
    private BigDecimal rate;
    private String referenceNumber;
    private LocalDate transactionDate;
    private String notes;
    private String performedBy;
    private java.time.LocalDateTime createdAt;
}
