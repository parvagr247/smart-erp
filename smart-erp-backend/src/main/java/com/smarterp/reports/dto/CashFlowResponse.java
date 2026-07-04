package com.smarterp.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CashFlowResponse {
    private List<CashFlowRow> operatingRows;
    private List<CashFlowRow> investingRows;
    private List<CashFlowRow> financingRows;
    
    private BigDecimal totalOperating;
    private BigDecimal totalInvesting;
    private BigDecimal totalFinancing;
    
    private BigDecimal netIncrease;
    private BigDecimal openingCash;
    private BigDecimal closingCash;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashFlowRow {
        private String name;
        private BigDecimal amount;
    }
}
