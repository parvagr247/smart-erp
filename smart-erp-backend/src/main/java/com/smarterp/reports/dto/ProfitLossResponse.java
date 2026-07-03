package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfitLossResponse {
    private List<ProfitLossRow> incomeRows;
    private List<ProfitLossRow> expenseRows;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal grossProfit;
    private BigDecimal netProfit;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProfitLossRow {
        private String name;
        private BigDecimal amount;
    }
}
