package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutstandingResponse {
    private List<OutstandingRow> rows;
    private BigDecimal totalOutstanding;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OutstandingRow {
        private UUID partnerId;
        private String partnerName;
        private String partnerType;
        private BigDecimal outstandingAmount;
        private String phone;
        private String email;
    }
}
