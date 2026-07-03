package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceSheetResponse {
    private List<BalanceSheetRow> assetRows;
    private List<BalanceSheetRow> liabilityRows;
    private BigDecimal totalAssets;
    private BigDecimal totalLiabilities;
    private BigDecimal netProfit;
    private BigDecimal totalLiabilitiesAndEquity;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BalanceSheetRow {
        private String name;
        private BigDecimal amount;
    }
}
