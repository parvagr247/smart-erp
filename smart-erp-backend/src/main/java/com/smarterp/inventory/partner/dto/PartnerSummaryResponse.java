package com.smarterp.inventory.partner.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerSummaryResponse {
    private long totalCustomers;
    private long totalSuppliers;
    private long totalPartners;
    private BigDecimal outstandingReceivables;
    private BigDecimal outstandingPayables;
}
