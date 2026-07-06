package com.smarterp.dashboard.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.dashboard.dto.DashboardSummaryResponse;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DashboardSummaryService {

    private final LedgerRepository ledgerRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final PurchaseRepository purchaseRepository;
    private final SalesRepository salesRepository;
    private final VoucherRepository voucherRepository;

    @Cacheable(value = "dashboard", key = "#company.id")
    public DashboardSummaryResponse getSummary(Company company) {
        log.info("Loading dashboard summary from database for company {}.", company.getId());
        long ledgerCount = ledgerRepository.countByCompany(company);
        long partnerCount = partnerRepository.countByCompany(company);
        long stockItemCount = stockItemRepository.countByCompany(company);
        long warehouseCount = warehouseRepository.countByCompany(company);

        BigDecimal totalInventoryValue = stockItemRepository.sumInventoryValueByCompany(company);

        long lowStockCount = stockItemRepository.countLowStockByCompany(company);

        long purchaseCount = purchaseRepository.countByCompany(company);
        BigDecimal totalPurchaseValue = purchaseRepository.sumGrandTotalByCompany(company);

        long salesCount = salesRepository.countByCompany(company);
        BigDecimal totalSalesValue = salesRepository.sumGrandTotalByCompany(company);

        BigDecimal revenueToday = salesRepository.sumGrandTotalByCompanyAndDate(company, java.time.LocalDate.now());

        BigDecimal purchaseToday = purchaseRepository.sumGrandTotalByCompanyAndDate(company, java.time.LocalDate.now());

        BigDecimal receivables = ledgerRepository.sumOpeningBalanceByCompanyAndGroupName(company, "Current Assets");

        BigDecimal payables = ledgerRepository.sumOpeningBalanceByCompanyAndGroupName(company, "Current Liabilities");

        BigDecimal cashPosition = ledgerRepository.sumOpeningBalanceByCompanyAndGroupNames(company, Arrays.asList("Bank Accounts", "Cash-in-Hand"));

        long draftPurchases = purchaseRepository.count((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("status"), com.smarterp.inventory.purchase.entity.PurchaseStatus.DRAFT)
        ));

        long draftSales = salesRepository.count((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("status"), com.smarterp.inventory.sales.entity.SalesStatus.DRAFT)
        ));

        long draftVouchers = voucherRepository.count((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("status"), com.smarterp.accounting.voucher.entity.VoucherStatus.DRAFT)
        ));

        long pendingApprovals = draftPurchases + draftSales + draftVouchers;

        return DashboardSummaryResponse.builder()
                .ledgerCount(ledgerCount)
                .partnerCount(partnerCount)
                .stockItemCount(stockItemCount)
                .warehouseCount(warehouseCount)
                .totalInventoryValue(totalInventoryValue)
                .lowStockCount(lowStockCount)
                .purchaseCount(purchaseCount)
                .totalPurchaseValue(totalPurchaseValue)
                .salesCount(salesCount)
                .totalSalesValue(totalSalesValue)
                .revenueToday(revenueToday)
                .purchaseToday(purchaseToday)
                .receivables(receivables)
                .payables(payables)
                .cashPosition(cashPosition)
                .pendingApprovals(pendingApprovals)
                .build();
    }
}
