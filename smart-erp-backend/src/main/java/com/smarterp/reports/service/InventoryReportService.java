package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.entity.InventoryTransaction;
import com.smarterp.inventory.master.repository.InventoryTransactionRepository;
import com.smarterp.reports.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class InventoryReportService {

    private final StockItemRepository stockItemRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public InventoryValuationResponse getInventoryValuation(Company company) {
        log.info("Generating Inventory Valuation for company: {}", company.getId());
        List<StockItem> items = stockItemRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company));

        List<InventoryValuationResponse.ValuationRow> rows = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (StockItem item : items) {
            BigDecimal qty = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
            BigDecimal cost = item.getAverageCost() != null ? item.getAverageCost() : BigDecimal.ZERO;
            BigDecimal val = qty.multiply(cost);

            rows.add(InventoryValuationResponse.ValuationRow.builder()
                    .itemId(item.getId())
                    .name(item.getName())
                    .sku(item.getSku())
                    .currentStock(qty)
                    .averageCost(cost)
                    .valuation(val)
                    .build());

            totalValue = totalValue.add(val);
        }

        return InventoryValuationResponse.builder()
                .rows(rows)
                .totalValue(totalValue)
                .build();
    }

    public StockRegisterResponse getStockRegister(Company company, LocalDate startDate, LocalDate endDate) {
        log.info("Generating Stock Register for company: {}", company.getId());
        List<StockItem> items = stockItemRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company));

        List<StockRegisterResponse.RegisterRow> rows = new ArrayList<>();

        for (StockItem item : items) {
            List<InventoryTransaction> txs = inventoryTransactionRepository.findAllByCompanyAndStockItemIdOrderByTransactionDateDescCreatedAtDesc(company, item.getId());

            BigDecimal opening = item.getOpeningQuantity() != null ? item.getOpeningQuantity() : BigDecimal.ZERO;
            BigDecimal inward = BigDecimal.ZERO;
            BigDecimal outward = BigDecimal.ZERO;

            for (InventoryTransaction tx : txs) {
                LocalDate txDate = tx.getTransactionDate();
                BigDecimal qty = tx.getQuantity() != null ? tx.getQuantity() : BigDecimal.ZERO;

                if (startDate != null && txDate.isBefore(startDate)) {
                    opening = opening.add(qty);
                } else if (endDate == null || !txDate.isAfter(endDate)) {
                    if (qty.compareTo(BigDecimal.ZERO) > 0) {
                        inward = inward.add(qty);
                    } else {
                        outward = outward.add(qty.abs());
                    }
                }
            }

            BigDecimal closing = opening.add(inward).subtract(outward);

            rows.add(StockRegisterResponse.RegisterRow.builder()
                    .itemId(item.getId())
                    .name(item.getName())
                    .sku(item.getSku())
                    .openingQuantity(opening)
                    .inwardQuantity(inward)
                    .outwardQuantity(outward)
                    .closingQuantity(closing)
                    .build());
        }

        return StockRegisterResponse.builder().rows(rows).build();
    }
}
