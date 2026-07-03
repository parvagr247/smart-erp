package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockRegisterResponse {
    private List<RegisterRow> rows;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRow {
        private UUID itemId;
        private String name;
        private String sku;
        private BigDecimal openingQuantity;
        private BigDecimal inwardQuantity;
        private BigDecimal outwardQuantity;
        private BigDecimal closingQuantity;
    }
}
