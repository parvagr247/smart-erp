package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashBankBookResponse {
    private UUID ledgerId;
    private String ledgerName;
    private BigDecimal openingBalance;
    private BigDecimal closingBalance;
    private List<BookLine> lines;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookLine {
        private UUID transactionId;
        private String transactionType;
        private String voucherNumber;
        private LocalDate date;
        private String oppositeLedgerName;
        private BigDecimal debitAmount;
        private BigDecimal creditAmount;
        private String narration;
    }
}
