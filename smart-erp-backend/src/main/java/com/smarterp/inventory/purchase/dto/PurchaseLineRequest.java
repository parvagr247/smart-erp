package com.smarterp.inventory.purchase.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseLineRequest {

    private UUID stockItemId;
    private BigDecimal quantity;
    private BigDecimal rate;
    private BigDecimal discount; // Flat item discount
    private UUID warehouseId;
    private String batchNumber;
}
