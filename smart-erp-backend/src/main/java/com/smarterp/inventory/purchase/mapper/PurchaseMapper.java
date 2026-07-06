package com.smarterp.inventory.purchase.mapper;

import com.smarterp.inventory.purchase.dto.PurchaseLineResponse;
import com.smarterp.inventory.purchase.dto.PurchaseResponse;
import com.smarterp.inventory.purchase.entity.Purchase;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PurchaseMapper {

    public PurchaseResponse mapToSummaryResponse(Purchase purchase) {
        return PurchaseResponse.builder()
                .id(purchase.getId())
                .purchaseNumber(purchase.getPurchaseNumber())
                .purchaseDate(purchase.getPurchaseDate())
                .dueDate(purchase.getDueDate())
                .paymentTerms(purchase.getPaymentTerms())
                .supplierId(purchase.getSupplier().getId())
                .supplierName(purchase.getSupplier().getName())
                .warehouseId(purchase.getWarehouse().getId())
                .warehouseName(purchase.getWarehouse().getName())
                .status(purchase.getStatus())
                .grossAmount(purchase.getGrossAmount())
                .discountAmount(purchase.getDiscountAmount())
                .taxAmount(purchase.getTaxAmount())
                .cgst(purchase.getCgst())
                .sgst(purchase.getSgst())
                .igst(purchase.getIgst())
                .cess(purchase.getCess())
                .roundOff(purchase.getRoundOff())
                .grandTotal(purchase.getGrandTotal())
                .notes(purchase.getNotes())
                .attachments(purchase.getAttachments())
                .createdBy(purchase.getCreatedBy())
                .lineItems(null)
                .build();
    }

    public PurchaseResponse mapToResponse(Purchase purchase) {
        List<PurchaseLineResponse> lines = purchase.getLineItems().stream()
                .map(line -> PurchaseLineResponse.builder()
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

        return PurchaseResponse.builder()
                .id(purchase.getId())
                .purchaseNumber(purchase.getPurchaseNumber())
                .purchaseDate(purchase.getPurchaseDate())
                .dueDate(purchase.getDueDate())
                .paymentTerms(purchase.getPaymentTerms())
                .supplierId(purchase.getSupplier().getId())
                .supplierName(purchase.getSupplier().getName())
                .warehouseId(purchase.getWarehouse().getId())
                .warehouseName(purchase.getWarehouse().getName())
                .status(purchase.getStatus())
                .grossAmount(purchase.getGrossAmount())
                .discountAmount(purchase.getDiscountAmount())
                .taxAmount(purchase.getTaxAmount())
                .cgst(purchase.getCgst())
                .sgst(purchase.getSgst())
                .igst(purchase.getIgst())
                .cess(purchase.getCess())
                .roundOff(purchase.getRoundOff())
                .grandTotal(purchase.getGrandTotal())
                .notes(purchase.getNotes())
                .attachments(purchase.getAttachments())
                .createdBy(purchase.getCreatedBy())
                .lineItems(lines)
                .build();
    }
}
