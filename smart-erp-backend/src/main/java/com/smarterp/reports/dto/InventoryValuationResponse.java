package com.smarterp.reports.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryValuationResponse {
    private List<ValuationRow> rows;
    private BigDecimal totalValue;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ValuationRow {
        private UUID itemId;
        private String name;
        private String sku;
        private BigDecimal currentStock;
        private BigDecimal averageCost;
        private BigDecimal valuation;
    }
}
