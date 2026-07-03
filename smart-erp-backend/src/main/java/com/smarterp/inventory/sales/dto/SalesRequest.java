package com.smarterp.inventory.sales.dto;

import com.smarterp.inventory.sales.entity.SalesStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesRequest {
    private LocalDate salesDate;
    private LocalDate dueDate;
    private String paymentTerms;

    @NotNull(message = "Customer is required")
    private UUID customerId;

    @NotNull(message = "Warehouse is required")
    private UUID warehouseId;

    private SalesStatus status;

    @Builder.Default
    private BigDecimal invoiceDiscountAmount = BigDecimal.ZERO;

    @Builder.Default
    private Boolean isTaxInclusive = false;

    private String notes;
    private String attachments;

    @NotEmpty(message = "Line items cannot be empty")
    @Valid
    private List<SalesLineRequest> lineItems;
}
