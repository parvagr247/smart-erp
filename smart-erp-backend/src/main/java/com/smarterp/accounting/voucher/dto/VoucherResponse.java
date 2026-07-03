package com.smarterp.accounting.voucher.dto;

import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.entity.VoucherType;
import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherResponse {
    private UUID id;
    private String voucherNumber;
    private LocalDate voucherDate;
    private VoucherType voucherType;
    private VoucherStatus status;
    private String narration;
    private List<VoucherLineResponse> lineItems;
    private String createdBy;
    private java.time.LocalDateTime createdAt;
}
