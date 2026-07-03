package com.smarterp.accounting.voucher.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherLineRequest {
    private UUID id;

    @NotNull(message = "Ledger ID is required")
    private UUID ledgerId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Entry type is required (DEBIT or CREDIT)")
    private String entryType;
}
