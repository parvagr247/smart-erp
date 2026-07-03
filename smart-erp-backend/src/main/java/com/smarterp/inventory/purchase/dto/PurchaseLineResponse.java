package com.smarterp.inventory.purchase.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseLineResponse {

    private UUID id;
    private UUID stockItemId;
    private String stockItemName;
    private String sku;
    private BigDecimal quantity;
    private BigDecimal rate;
    private BigDecimal discount;
    private BigDecimal taxPercentage;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private UUID warehouseId;
    private String warehouseName;
    private String batchNumber;
}
