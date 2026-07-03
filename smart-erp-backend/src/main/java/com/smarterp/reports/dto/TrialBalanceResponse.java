package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrialBalanceResponse {
    private List<TrialBalanceRow> rows;
    private BigDecimal totalDebit;
    private BigDecimal totalCredit;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TrialBalanceRow {
        private UUID ledgerId;
        private String ledgerName;
        private String groupName;
        private BigDecimal debitAmount;
        private BigDecimal creditAmount;
    }
}
