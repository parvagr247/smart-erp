package com.smarterp.accounting.voucher.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherLineResponse {
    private UUID id;
    private UUID ledgerId;
    private String ledgerName;
    private String ledgerCode;
    private BigDecimal amount;
    private String entryType;
}
