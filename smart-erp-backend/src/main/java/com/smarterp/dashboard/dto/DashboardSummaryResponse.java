package com.smarterp.dashboard.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {
    private long ledgerCount;
    private long partnerCount;
    private long stockItemCount;
    private long warehouseCount;
    private BigDecimal totalInventoryValue;
    private long lowStockCount;
    private long purchaseCount;
    private BigDecimal totalPurchaseValue;
}
