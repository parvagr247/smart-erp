package com.smarterp.accounting.voucher.dto;

import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.entity.VoucherType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherRequest {
    private LocalDate voucherDate;

    @NotNull(message = "Voucher Type is required")
    private VoucherType voucherType;

    private VoucherStatus status;

    private String narration;

    @NotEmpty(message = "Voucher entries cannot be empty")
    @Valid
    private List<VoucherLineRequest> lineItems;
}
