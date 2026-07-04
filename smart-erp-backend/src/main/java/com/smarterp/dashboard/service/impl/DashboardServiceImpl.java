package com.smarterp.dashboard.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.master.repository.BrandRepository;
import com.smarterp.inventory.master.repository.StockCategoryRepository;
import com.smarterp.auth.repository.UserRepo;
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
    private final BrandRepository brandRepository;
    private final StockCategoryRepository stockCategoryRepository;
    private final UserRepo userRepo;

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

    private boolean hasAuthority(String authorityName) {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(authorityName));
    }

    @Override
    public com.smarterp.dashboard.dto.SearchResultResponse search(Company company, String query) {
        if (query == null || query.trim().isEmpty()) {
            return com.smarterp.dashboard.dto.SearchResultResponse.builder().hits(new java.util.ArrayList<>()).build();
        }
        String cleanQuery = query.trim().toLowerCase();
        List<com.smarterp.dashboard.dto.SearchResultResponse.SearchHit> hits = new java.util.ArrayList<>();

        // 1. Search Ledgers
        if (hasAuthority("Ledger.View") || hasAuthority("Voucher.View")) {
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
        }

        // 2. Search Business Partners (Customers / Suppliers)
        if (hasAuthority("Inventory.View") || hasAuthority("Sales.View") || hasAuthority("Purchase.View")) {
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
        }

        // 3. Search Stock Items
        if (hasAuthority("Inventory.View")) {
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
        }

        // 4. Search Warehouses
        if (hasAuthority("Inventory.View")) {
            warehouseRepository.findAllByCompany(company).stream()
                    .filter(w -> w.getName().toLowerCase().contains(cleanQuery))
                    .limit(3)
                    .forEach(w -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                            .id(w.getId())
                            .type("WAREHOUSE")
                            .title(w.getName())
                            .subtitle("Warehouse | Code: " + w.getCode() + " | Address: " + w.getAddress())
                            .path("/inventory/warehouses")
                            .build()));
        }

        // 5. Search Brands
        if (hasAuthority("Inventory.View")) {
            brandRepository.findAllByCompany(company).stream()
                    .filter(b -> b.getName().toLowerCase().contains(cleanQuery))
                    .limit(3)
                    .forEach(b -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                            .id(b.getId())
                            .type("BRAND")
                            .title(b.getName())
                            .subtitle("Brand Name")
                            .path("/inventory/brands")
                            .build()));
        }

        // 6. Search Categories
        if (hasAuthority("Inventory.View")) {
            stockCategoryRepository.findAllByCompany(company).stream()
                    .filter(c -> c.getName().toLowerCase().contains(cleanQuery))
                    .limit(3)
                    .forEach(c -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                            .id(c.getId())
                            .type("CATEGORY")
                            .title(c.getName())
                            .subtitle("Stock Category")
                            .path("/inventory/categories")
                            .build()));
        }

        // 7. Search Purchases (Purchase Orders)
        if (hasAuthority("Purchase.View")) {
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
        }

        // 8. Search Sales (Invoices)
        if (hasAuthority("Sales.View")) {
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
        }

        // 9. Search Vouchers
        if (hasAuthority("Voucher.View")) {
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
        }

        // 10. Search Users (Admin Only)
        if (hasAuthority("User.Manage") || hasAuthority("Role.Manage")) {
            userRepo.findAll().stream()
                    .filter(u -> u.getEmail().toLowerCase().contains(cleanQuery) || u.getFullName().toLowerCase().contains(cleanQuery))
                    .limit(3)
                    .forEach(u -> hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                            .id(u.getId())
                            .type("USER")
                            .title(u.getFullName())
                            .subtitle("User Account | Role: " + u.getRole() + " | Email: " + u.getEmail())
                            .path("/settings")
                            .build()));
        }

        // 11. Static Pages & Configuration Shortcuts (Dashboard, Settings, Reports, Commands)
        if ("dashboard".contains(cleanQuery)) {
            hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                    .type("SHORTCUT")
                    .title("Go to Dashboard")
                    .subtitle("Navigate to Personalized Widget Workspace")
                    .path("/dashboard")
                    .build());
        }

        if (hasAuthority("Company.View") && ("settings".contains(cleanQuery) || "preferences".contains(cleanQuery) || "financial year".contains(cleanQuery) || "gst".contains(cleanQuery))) {
            hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                    .type("SHORTCUT")
                    .title("System Settings & Config")
                    .subtitle("Configure company, theme, key settings & active FY")
                    .path("/settings")
                    .build());
        }

        // Search reports if cleanQuery contains "report" or report names
        boolean searchReports = "reports".contains(cleanQuery) || "trial balance".contains(cleanQuery) || "profit & loss".contains(cleanQuery) || "balance sheet".contains(cleanQuery) || "gst summary".contains(cleanQuery) || "day book".contains(cleanQuery) || "cash flow".contains(cleanQuery);
        if (searchReports) {
            if (hasAuthority("REPORT_TRIAL_BALANCE_VIEW")) {
                hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Trial Balance Report")
                        .subtitle("View ledger account trial balances")
                        .path("/reports?type=trial-balance")
                        .build());
            }
            if (hasAuthority("REPORT_PROFIT_LOSS_VIEW")) {
                hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Profit & Loss Statement")
                        .subtitle("Inspect revenues and expenditure net margins")
                        .path("/reports?type=profit-loss")
                        .build());
            }
            if (hasAuthority("REPORT_BALANCE_SHEET_VIEW")) {
                hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Balance Sheet")
                        .subtitle("Inspect equity assets and liability balances")
                        .path("/reports?type=balance-sheet")
                        .build());
            }
            if (hasAuthority("REPORT_DAY_BOOK_VIEW")) {
                hits.add(com.smarterp.dashboard.dto.SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Day Book")
                        .subtitle("Audit chronological journal logs")
                        .path("/reports?type=day-book")
                        .build());
            }
        }

        return com.smarterp.dashboard.dto.SearchResultResponse.builder().hits(hits).build();
    }
}
