package com.smarterp.inventory.purchase.dto;

import com.smarterp.inventory.purchase.entity.PurchaseStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseRequest {

    private LocalDate purchaseDate;
    private LocalDate dueDate;
    private String paymentTerms;
    private UUID supplierId;
    private UUID warehouseId;
    private PurchaseStatus status;
    private List<PurchaseLineRequest> lineItems;
    private BigDecimal invoiceDiscountAmount;
    private Boolean isTaxInclusive;
    private String notes;
    private String attachments;
}
