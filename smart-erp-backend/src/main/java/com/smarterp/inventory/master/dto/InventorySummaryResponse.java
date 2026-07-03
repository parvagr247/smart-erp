package com.smarterp.inventory.master.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventorySummaryResponse {
    private long totalItems;
    private long totalWarehouses;
    private long totalBrands;
    private long lowStockCount;
    private long outOfStockCount;
}
