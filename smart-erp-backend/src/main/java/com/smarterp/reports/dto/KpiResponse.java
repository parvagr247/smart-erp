package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiResponse {
    private BigDecimal revenue;
    private BigDecimal grossMargin;
    private BigDecimal inventoryTurnover;
    private BigDecimal averageOrderValue;
    private BigDecimal outstandingCollection;
    private BigDecimal purchaseVolume;
    private BigDecimal salesGrowth;
}
