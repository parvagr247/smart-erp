package com.smarterp.dashboard.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CompanyRepository companyRepository;
    private final LedgerRepository ledgerRepository;
    private final StockItemRepository stockItemRepository;
    private final PartnerRepository partnerRepository;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<SearchResponse>> globalSearch(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam String query) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));

        List<SearchHit> hits = new ArrayList<>();
        String lowerQuery = query.toLowerCase();

        // 1. Search Stock Items
        List<StockItem> items = stockItemRepository.findAll((root, q, cb) -> cb.equal(root.get("company"), company));
        for (StockItem item : items) {
            if (item.getName().toLowerCase().contains(lowerQuery) || item.getSku().toLowerCase().contains(lowerQuery)) {
                hits.add(SearchHit.builder()
                        .id(item.getId().toString())
                        .title("Stock Item: " + item.getName())
                        .subtitle("SKU: " + item.getSku() + " | Stock: " + item.getCurrentQuantity())
                        .path("/inventory/stock-items")
                        .build());
            }
        }

        // 2. Search Ledgers
        List<Ledger> ledgers = ledgerRepository.findByCompany(company);
        for (Ledger ledger : ledgers) {
            if (ledger.getName().toLowerCase().contains(lowerQuery)) {
                hits.add(SearchHit.builder()
                        .id(ledger.getId().toString())
                        .title("Ledger: " + ledger.getName())
                        .subtitle("Group: " + (ledger.getGroup() != null ? ledger.getGroup().getName() : "General"))
                        .path("/accounting/ledgers")
                        .build());
            }
        }

        // 3. Search Partners
        List<BusinessPartner> partners = partnerRepository.findAll((root, q, cb) -> cb.equal(root.get("company"), company));
        for (BusinessPartner partner : partners) {
            if (partner.getName().toLowerCase().contains(lowerQuery)) {
                hits.add(SearchHit.builder()
                        .id(partner.getId().toString())
                        .title("Partner: " + partner.getName())
                        .subtitle("Type: " + partner.getType() + " | Phone: " + partner.getPhone())
                        .path("/inventory/partners")
                        .build());
            }
        }

        return ResponseEntity.ok(ApiResponse.<SearchResponse>builder()
                .success(true)
                .data(new SearchResponse(hits))
                .build());
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SearchResponse {
        private List<SearchHit> hits;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SearchHit {
        private String id;
        private String title;
        private String subtitle;
        private String path;
    }
}
