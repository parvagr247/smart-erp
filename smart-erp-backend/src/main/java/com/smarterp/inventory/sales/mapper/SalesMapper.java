package com.smarterp.inventory.sales.mapper;

import com.smarterp.inventory.sales.dto.SalesLineResponse;
import com.smarterp.inventory.sales.dto.SalesResponse;
import com.smarterp.inventory.sales.entity.Sales;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SalesMapper {

    public SalesResponse mapToSummaryResponse(Sales s) {
        return SalesResponse.builder()
                .id(s.getId())
                .salesNumber(s.getSalesNumber())
                .salesDate(s.getSalesDate())
                .dueDate(s.getDueDate())
                .paymentTerms(s.getPaymentTerms())
                .customerId(s.getCustomer().getId())
                .customerName(s.getCustomer().getName())
                .warehouseId(s.getWarehouse().getId())
                .warehouseName(s.getWarehouse().getName())
                .status(s.getStatus())
                .grossAmount(s.getGrossAmount())
                .discountAmount(s.getDiscountAmount())
                .taxAmount(s.getTaxAmount())
                .cgst(s.getCgst())
                .sgst(s.getSgst())
                .igst(s.getIgst())
                .cess(s.getCess())
                .roundOff(s.getRoundOff())
                .grandTotal(s.getGrandTotal())
                .notes(s.getNotes())
                .attachments(s.getAttachments())
                .createdBy(s.getCreatedBy())
                .lineItems(null)
                .build();
    }

    public SalesResponse mapToResponse(Sales s) {
        List<SalesLineResponse> lines = s.getLineItems().stream()
                .map(line -> SalesLineResponse.builder()
                        .id(line.getId())
                        .stockItemId(line.getStockItem().getId())
                        .stockItemName(line.getStockItem().getName())
                        .sku(line.getStockItem().getSku())
                        .quantity(line.getQuantity())
                        .rate(line.getRate())
                        .discount(line.getDiscount())
                        .taxPercentage(line.getTaxPercentage())
                        .taxAmount(line.getTaxAmount())
                        .totalAmount(line.getTotalAmount())
                        .warehouseId(line.getWarehouse() != null ? line.getWarehouse().getId() : null)
                        .warehouseName(line.getWarehouse() != null ? line.getWarehouse().getName() : "")
                        .batchNumber(line.getBatchNumber())
                        .build())
                .collect(Collectors.toList());

        return SalesResponse.builder()
                .id(s.getId())
                .salesNumber(s.getSalesNumber())
                .salesDate(s.getSalesDate())
                .dueDate(s.getDueDate())
                .paymentTerms(s.getPaymentTerms())
                .customerId(s.getCustomer().getId())
                .customerName(s.getCustomer().getName())
                .warehouseId(s.getWarehouse().getId())
                .warehouseName(s.getWarehouse().getName())
                .status(s.getStatus())
                .grossAmount(s.getGrossAmount())
                .discountAmount(s.getDiscountAmount())
                .taxAmount(s.getTaxAmount())
                .cgst(s.getCgst())
                .sgst(s.getSgst())
                .igst(s.getIgst())
                .cess(s.getCess())
                .roundOff(s.getRoundOff())
                .grandTotal(s.getGrandTotal())
                .notes(s.getNotes())
                .attachments(s.getAttachments())
                .createdBy(s.getCreatedBy())
                .lineItems(lines)
                .createdAt(s.getCreatedAt())
                .build();
    }
}
