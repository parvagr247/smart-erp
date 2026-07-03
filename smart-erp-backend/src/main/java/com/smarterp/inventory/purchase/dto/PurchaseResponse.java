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
public class PurchaseResponse {

    private UUID id;
    private String purchaseNumber;
    private LocalDate purchaseDate;
    private LocalDate dueDate;
    private String paymentTerms;
    private UUID supplierId;
    private String supplierName;
    private UUID warehouseId;
    private String warehouseName;
    private PurchaseStatus status;
    private BigDecimal grossAmount;
    private BigDecimal discountAmount;
    private BigDecimal taxAmount;
    private BigDecimal cgst;
    private BigDecimal sgst;
    private BigDecimal igst;
    private BigDecimal cess;
    private BigDecimal roundOff;
    private BigDecimal grandTotal;
    private String notes;
    private String attachments;
    private String createdBy;
    private List<PurchaseLineResponse> lineItems;
}
