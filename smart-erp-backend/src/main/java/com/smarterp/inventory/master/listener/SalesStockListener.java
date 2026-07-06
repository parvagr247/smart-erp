package com.smarterp.inventory.master.listener;

import com.smarterp.inventory.sales.entity.Sales;
import com.smarterp.inventory.sales.entity.SalesLine;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.inventory.master.service.InventoryTransactionService;
import com.smarterp.inventory.master.dto.InventoryTransactionRequest;
import com.smarterp.inventory.master.entity.InventoryTransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class SalesStockListener {

    private final SalesRepository salesRepository;
    private final InventoryTransactionService inventoryTransactionService;

    @EventListener
    @Transactional
    public void onSalesApproved(SalesApprovedEvent event) {
        log.info("Stock listener reacting to SalesApprovedEvent for Sales ID: {}", event.getSalesId());
        Sales sales = salesRepository.findById(event.getSalesId()).orElse(null);
        if (sales == null) return;

        for (SalesLine line : sales.getLineItems()) {
            InventoryTransactionRequest req = InventoryTransactionRequest.builder()
                    .stockItemId(line.getStockItem().getId())
                    .warehouseId(line.getWarehouse() != null ? line.getWarehouse().getId() : sales.getWarehouse().getId())
                    .transactionType(InventoryTransactionType.GOODS_ISSUE)
                    .quantity(line.getQuantity())
                    .rate(line.getRate())
                    .referenceNumber(sales.getSalesNumber())
                    .transactionDate(sales.getSalesDate())
                    .notes("Sales dispatch invoice: " + sales.getSalesNumber())
                    .build();

            inventoryTransactionService.recordTransaction(req, sales.getCompany(), event.getPerformedBy());
        }
    }
}
