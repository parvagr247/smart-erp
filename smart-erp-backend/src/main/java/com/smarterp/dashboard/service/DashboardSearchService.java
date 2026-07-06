package com.smarterp.dashboard.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.dashboard.dto.SearchResultResponse;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.master.repository.BrandRepository;
import com.smarterp.inventory.master.repository.StockCategoryRepository;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import com.smarterp.auth.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DashboardSearchService {

    private final LedgerRepository ledgerRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final BrandRepository brandRepository;
    private final StockCategoryRepository stockCategoryRepository;
    private final PurchaseRepository purchaseRepository;
    private final SalesRepository salesRepository;
    private final VoucherRepository voucherRepository;
    private final UserRepo userRepo;

    public SearchResultResponse search(Company company, String query) {
        if (query == null || query.trim().isEmpty()) {
            return SearchResultResponse.builder().hits(new ArrayList<>()).build();
        }
        String cleanQuery = query.trim().toLowerCase();
        List<SearchResultResponse.SearchHit> hits = new ArrayList<>();

        // 1. Search Ledgers
        if (hasAuthority("Ledger.View") || hasAuthority("Voucher.View")) {
            ledgerRepository.findByCompany(company).stream()
                    .filter(l -> l.getName().toLowerCase().contains(cleanQuery))
                    .limit(5)
                    .forEach(l -> hits.add(SearchResultResponse.SearchHit.builder()
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
            )).stream().limit(5).forEach(p -> hits.add(SearchResultResponse.SearchHit.builder()
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
            )).stream().limit(5).forEach(i -> hits.add(SearchResultResponse.SearchHit.builder()
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
                    .forEach(w -> hits.add(SearchResultResponse.SearchHit.builder()
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
                    .forEach(b -> hits.add(SearchResultResponse.SearchHit.builder()
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
                    .forEach(c -> hits.add(SearchResultResponse.SearchHit.builder()
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
            )).stream().limit(5).forEach(p -> hits.add(SearchResultResponse.SearchHit.builder()
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
            )).stream().limit(5).forEach(s -> hits.add(SearchResultResponse.SearchHit.builder()
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
            )).stream().limit(5).forEach(v -> hits.add(SearchResultResponse.SearchHit.builder()
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
                    .forEach(u -> hits.add(SearchResultResponse.SearchHit.builder()
                            .id(u.getId())
                            .type("USER")
                            .title(u.getFullName())
                            .subtitle("User Account | Role: " + u.getRole() + " | Email: " + u.getEmail())
                            .path("/settings")
                            .build()));
        }

        // 11. Static Pages & Configuration Shortcuts (Dashboard, Settings, Reports, Commands)
        if ("dashboard".contains(cleanQuery)) {
            hits.add(SearchResultResponse.SearchHit.builder()
                    .type("SHORTCUT")
                    .title("Go to Dashboard")
                    .subtitle("Navigate to Personalized Widget Workspace")
                    .path("/dashboard")
                    .build());
        }

        if (hasAuthority("Company.View") && ("settings".contains(cleanQuery) || "preferences".contains(cleanQuery) || "financial year".contains(cleanQuery) || "gst".contains(cleanQuery))) {
            hits.add(SearchResultResponse.SearchHit.builder()
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
                hits.add(SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Trial Balance Report")
                        .subtitle("View ledger account trial balances")
                        .path("/reports?type=trial-balance")
                        .build());
            }
            if (hasAuthority("REPORT_PROFIT_LOSS_VIEW")) {
                hits.add(SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Profit & Loss Statement")
                        .subtitle("Inspect revenues and expenditure net margins")
                        .path("/reports?type=profit-loss")
                        .build());
            }
            if (hasAuthority("REPORT_BALANCE_SHEET_VIEW")) {
                hits.add(SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Balance Sheet")
                        .subtitle("Inspect equity assets and liability balances")
                        .path("/reports?type=balance-sheet")
                        .build());
            }
            if (hasAuthority("REPORT_DAY_BOOK_VIEW")) {
                hits.add(SearchResultResponse.SearchHit.builder()
                        .type("REPORT")
                        .title("Day Book")
                        .subtitle("Audit chronological journal logs")
                        .path("/reports?type=day-book")
                        .build());
            }
        }

        return SearchResultResponse.builder().hits(hits).build();
    }

    private boolean hasAuthority(String authorityName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(authorityName));
    }
}
