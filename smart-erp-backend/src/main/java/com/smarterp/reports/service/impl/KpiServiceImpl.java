package com.smarterp.reports.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.reports.dto.KpiResponse;
import com.smarterp.reports.service.KpiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class KpiServiceImpl implements KpiService {

    private final SalesRepository salesRepository;
    private final PurchaseRepository purchaseRepository;
    private final LedgerRepository ledgerRepository;
    private final StockItemRepository stockItemRepository;

    @Override
    public KpiResponse calculateKpis(Company company) {
        log.info("Calculating KPIs for company ID: {}", company.getId());

        // 1. Revenue (Sum of all completed/approved sales grand totals)
        BigDecimal revenue = salesRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company))
                .stream()
                .map(s -> s.getGrandTotal() != null ? s.getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Purchase Volume (Sum of all purchases grand totals)
        BigDecimal purchaseVolume = purchaseRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company))
                .stream()
                .map(p -> p.getGrandTotal() != null ? p.getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Average Order Value
        long salesCount = salesRepository.countByCompany(company);
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (salesCount > 0) {
            averageOrderValue = revenue.divide(BigDecimal.valueOf(salesCount), 2, RoundingMode.HALF_UP);
        }

        // 4. Outstanding Collections (Receivables under Current Assets / Sundry Debtors)
        BigDecimal outstandingCollection = ledgerRepository.findAll((root, query, cb) -> cb.and(
                        cb.equal(root.get("company"), company),
                        cb.equal(root.get("group").get("name"), "Current Assets")
                ))
                .stream()
                .map(l -> l.getOpeningBalance() != null ? l.getOpeningBalance() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 5. Gross Margin: (Revenue - COGS) / Revenue * 100
        BigDecimal grossMargin = BigDecimal.ZERO;
        if (revenue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal cogs = purchaseVolume; // Approximation of Cost of Goods Sold
            BigDecimal margin = revenue.subtract(cogs);
            grossMargin = margin.divide(revenue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP);
        }

        // 6. Inventory Turnover: COGS / Avg Inventory Valuation
        BigDecimal totalInventoryValue = stockItemRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company))
                .stream()
                .map(item -> item.getOpeningValue() != null ? item.getOpeningValue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal inventoryTurnover = BigDecimal.ZERO;
        if (totalInventoryValue.compareTo(BigDecimal.ZERO) > 0) {
            inventoryTurnover = purchaseVolume.divide(totalInventoryValue, 2, RoundingMode.HALF_UP);
        }

        // 7. Month-over-Month Sales Growth
        LocalDate startThisMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate startLastMonth = startThisMonth.minusMonths(1);

        BigDecimal salesThisMonth = salesRepository.findAll((root, query, cb) -> cb.and(
                        cb.equal(root.get("company"), company),
                        cb.greaterThanOrEqualTo(root.get("salesDate"), startThisMonth)
                ))
                .stream()
                .map(s -> s.getGrandTotal() != null ? s.getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal salesLastMonth = salesRepository.findAll((root, query, cb) -> cb.and(
                        cb.equal(root.get("company"), company),
                        cb.greaterThanOrEqualTo(root.get("salesDate"), startLastMonth),
                        cb.lessThan(root.get("salesDate"), startThisMonth)
                ))
                .stream()
                .map(s -> s.getGrandTotal() != null ? s.getGrandTotal() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal salesGrowth = BigDecimal.ZERO;
        if (salesLastMonth.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal growthDelta = salesThisMonth.subtract(salesLastMonth);
            salesGrowth = growthDelta.divide(salesLastMonth, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP);
        } else if (salesThisMonth.compareTo(BigDecimal.ZERO) > 0) {
            salesGrowth = BigDecimal.valueOf(100.00); // 100% growth if starting from zero sales
        }

        return KpiResponse.builder()
                .revenue(revenue)
                .grossMargin(grossMargin)
                .inventoryTurnover(inventoryTurnover)
                .averageOrderValue(averageOrderValue)
                .outstandingCollection(outstandingCollection)
                .purchaseVolume(purchaseVolume)
                .salesGrowth(salesGrowth)
                .build();
    }
}
