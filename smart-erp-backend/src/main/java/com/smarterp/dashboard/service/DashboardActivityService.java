package com.smarterp.dashboard.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.dashboard.dto.RecentActivityResponse;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class DashboardActivityService {

    private final LedgerRepository ledgerRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final PurchaseRepository purchaseRepository;

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
}
