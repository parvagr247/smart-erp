package com.smarterp.dashboard.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.dashboard.dto.DashboardSummaryResponse;
import com.smarterp.dashboard.dto.RecentActivityResponse;
import com.smarterp.dashboard.service.DashboardService;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.purchase.entity.Purchase;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@lombok.extern.slf4j.Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final LedgerRepository ledgerRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final PurchaseRepository purchaseRepository;
    private final com.smarterp.inventory.sales.repository.SalesRepository salesRepository;
    private final com.smarterp.accounting.voucher.repository.VoucherRepository voucherRepository;

    @Override
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

            BigDecimal cashPosition = ledgerRepository.sumOpeningBalanceByCompanyAndGroupNames(company, java.util.Arrays.asList("Bank Accounts", "Cash-in-Hand"));

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

    @Override
    public RecentActivityResponse getRecentActivity(Company company) {
        log.info("Loading dashboard recent activity from database for company {}.", company.getId());
            List<RecentActivityResponse.ActivityItem> list = new ArrayList<>();

            // Fetch latest 3 Ledgers
            List<Ledger> ledgers = ledgerRepository.searchAndFilter(
                    company, null, null, null, null, null,
                    PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"))
            ).getContent();
            
            for (Ledger l : ledgers) {
                list.add(RecentActivityResponse.ActivityItem.builder()
                        .type("LEDGER")
                        .title("Ledger Created: " + l.getName())
                        .details("Opened with balance type " + l.getBalanceType() + " under group " + (l.getGroup() != null ? l.getGroup().getName() : "General"))
                        .timestamp(l.getCreatedAt())
                        .build());
            }

            // Fetch latest 3 Business Partners
            Specification<BusinessPartner> partnerSpec = (root, query, cb) -> cb.equal(root.get("company"), company);
            List<BusinessPartner> partners = partnerRepository.findAll(
                    partnerSpec,
                    PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"))
            ).getContent();
            
            for (BusinessPartner p : partners) {
                list.add(RecentActivityResponse.ActivityItem.builder()
                        .type("PARTNER")
                        .title("Business Partner Created: " + p.getName())
                        .details("Registered as type " + p.getType() + " with code " + p.getCode())
                        .timestamp(p.getCreatedAt())
                        .build());
            }

            // Fetch latest 3 Stock Items
            Specification<StockItem> itemSpec = (root, query, cb) -> cb.equal(root.get("company"), company);
            List<StockItem> items = stockItemRepository.findAll(
                    itemSpec,
                    PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"))
            ).getContent();

            for (StockItem i : items) {
                list.add(RecentActivityResponse.ActivityItem.builder()
                        .type("STOCK_ITEM")
                        .title("Stock Item Onboarded: " + i.getName())
                        .details("SKU: " + i.getSku() + " | Initial Qty: " + i.getOpeningQuantity())
                        .timestamp(i.getCreatedAt())
                        .build());
            }

            // Fetch latest 3 Purchases
            Specification<Purchase> purchaseSpec = (root, query, cb) -> cb.equal(root.get("company"), company);
            List<Purchase> purchases = purchaseRepository.findAll(
                    purchaseSpec,
                    PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "createdAt"))
            ).getContent();

            for (Purchase p : purchases) {
                list.add(RecentActivityResponse.ActivityItem.builder()
                        .type("PURCHASE")
                        .title("Purchase Voucher: " + p.getPurchaseNumber())
                        .details("Supplier: " + p.getSupplier().getName() + " | Grand Total: ₹" + p.getGrandTotal() + " | Status: " + p.getStatus())
                        .timestamp(p.getCreatedAt())
                        .build());
            }

            // Merge, sort desc by timestamp, and return top 5
            List<RecentActivityResponse.ActivityItem> sorted = list.stream()
                    .sorted((a, b) -> {
                        if (a.getTimestamp() == null && b.getTimestamp() == null) return 0;
                        if (a.getTimestamp() == null) return 1;
                        if (b.getTimestamp() == null) return -1;
                        return b.getTimestamp().compareTo(a.getTimestamp());
                    })
                    .limit(5)
                    .collect(Collectors.toList());

            return RecentActivityResponse.builder().activities(sorted).build();
    }

    @Override
    public com.smarterp.dashboard.dto.SearchResultResponse search(Company company, String query) {
        if (query == null || query.trim().isEmpty()) {
            return com.smarterp.dashboard.dto.SearchResultResponse.builder().hits(new java.util.ArrayList<>()).build();
        }
        String cleanQuery = query.trim().toLowerCase();
        List<com.smarterp.dashboard.dto.SearchResultResponse.SearchHit> hits = new java.util.ArrayList<>();

        // 1. Search Ledgers
        ledgerRepository.findByCompany(company).stream()
                .filter(l -> l.getName().toLowerCase().contains(cleanQuery))
                .limit(5)
                .forEach(l -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                        .id(l.getId())
                        .type("LEDGER")
                        .title(l.getName())
                        .subtitle("Ledger Account | Group: " + (l.getGroup() != null ? l.getGroup().getName() : "General"))
                        .path("/accounting/ledgers/" + l.getId())
                        .build()));

        // 2. Search Business Partners
        partnerRepository.findAll((root, q, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + cleanQuery + "%"),
                        cb.like(cb.lower(root.get("code")), "%" + cleanQuery + "%")
                )
        )).stream().limit(5).forEach(p -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                .id(p.getId())
                .type("PARTNER")
                .title(p.getName())
                .subtitle("Business Partner (" + p.getType() + ") | Code: " + p.getCode())
                .path("/inventory/partners/" + p.getId())
                .build()));

        // 3. Search Stock Items
        stockItemRepository.findAll((root, q, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + cleanQuery + "%"),
                        cb.like(cb.lower(root.get("sku")), "%" + cleanQuery + "%"),
                        cb.like(cb.lower(root.get("code")), "%" + cleanQuery + "%")
                )
        )).stream().limit(5).forEach(i -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                .id(i.getId())
                .type("STOCK_ITEM")
                .title(i.getName())
                .subtitle("Stock Item | SKU: " + i.getSku())
                .path("/inventory/stock-items/" + i.getId())
                .build()));

        // 4. Search Purchases
        purchaseRepository.findAll((root, q, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.or(
                        cb.like(cb.lower(root.get("purchaseNumber")), "%" + cleanQuery + "%"),
                        cb.like(cb.lower(root.get("supplier").get("name")), "%" + cleanQuery + "%")
                )
        )).stream().limit(5).forEach(p -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                .id(p.getId())
                .type("PURCHASE")
                .title(p.getPurchaseNumber())
                .subtitle("Purchase Invoice | Supplier: " + p.getSupplier().getName() + " | Total: ₹" + p.getGrandTotal())
                .path("/purchase/" + p.getId())
                .build()));

        // 5. Search Sales
        salesRepository.findAll((root, q, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.or(
                        cb.like(cb.lower(root.get("salesNumber")), "%" + cleanQuery + "%"),
                        cb.like(cb.lower(root.get("customer").get("name")), "%" + cleanQuery + "%")
                )
        )).stream().limit(5).forEach(s -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                .id(s.getId())
                .type("SALES")
                .title(s.getSalesNumber())
                .subtitle("Sales Invoice | Customer: " + s.getCustomer().getName() + " | Total: ₹" + s.getGrandTotal())
                .path("/sales/" + s.getId())
                .build()));

        // 6. Search Vouchers
        voucherRepository.findAll((root, q, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.like(cb.lower(root.get("voucherNumber")), "%" + cleanQuery + "%")
        )).stream().limit(5).forEach(v -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                .id(v.getId())
                .type("VOUCHER")
                .title(v.getVoucherNumber())
                .subtitle(v.getVoucherType() + " Voucher | Date: " + v.getVoucherDate() + " | Status: " + v.getStatus())
                .path("/accounting/vouchers/" + v.getId())
                .build()));

        return com.smarterp.dashboard.dto.SearchResultResponse.builder().hits(hits).build();
    }
}
