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
    private long salesCount;
    private BigDecimal totalSalesValue;
    private BigDecimal revenueToday;
    private BigDecimal purchaseToday;
    private BigDecimal receivables;
    private BigDecimal payables;
    private BigDecimal cashPosition;
    private long pendingApprovals;
}
