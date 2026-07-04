package com.smarterp.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DayBookResponse {
    private List<DayBookRow> rows;
    private BigDecimal totalDebit;
    private BigDecimal totalCredit;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DayBookRow {
        private UUID voucherId;
        private String voucherNumber;
        private String voucherType;
        private LocalDate date;
        private String ledgerName;
        private BigDecimal debitAmount;
        private BigDecimal creditAmount;
        private String narration;
    }
}
