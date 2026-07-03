package com.smarterp.inventory.sales.dto;

import com.smarterp.inventory.sales.entity.SalesStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesResponse {
    private UUID id;
    private String salesNumber;
    private LocalDate salesDate;
    private LocalDate dueDate;
    private String paymentTerms;
    private UUID customerId;
    private String customerName;
    private UUID warehouseId;
    private String warehouseName;
    private SalesStatus status;
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
    private List<SalesLineResponse> lineItems;
    private java.time.LocalDateTime createdAt;
}
