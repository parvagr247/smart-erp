package com.smarterp.common.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.UnitRepository;
import com.smarterp.inventory.master.entity.Unit;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/import")
@RequiredArgsConstructor
@Slf4j
public class CsvImportController {

    private final CompanyRepository companyRepository;
    private final LedgerRepository ledgerRepository;
    private final StockItemRepository stockItemRepository;
    private final UnitRepository unitRepository;

    @PostMapping("/ledgers")
    @Transactional
    public ResponseEntity<ApiResponse<String>> importLedgers(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam("file") MultipartFile file) {
        Company company = getCompany(companyId);
        int successCount = 0;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isHeader = true;
            while ((line = reader.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }
                String[] cols = line.split(",");
                if (cols.length < 2) continue;
                String ledgerName = cols[0].replaceAll("\"", "").trim();
                String groupName = cols[1].replaceAll("\"", "").trim();
                BigDecimal openingBal = cols.length > 2 ? new BigDecimal(cols[2].trim()) : BigDecimal.ZERO;

                if (ledgerRepository.findByCompanyAndName(company, ledgerName).isPresent()) {
                    log.warn("Skipping duplicate ledger import: {}", ledgerName);
                    continue;
                }

                Ledger ledger = Ledger.builder()
                        .name(ledgerName)
                        .company(company)
                        .openingBalance(openingBal)
                        .balanceType(BalanceType.DEBIT)
                        .isActive(true)
                        .build();

                ledgerRepository.save(ledger);
                successCount++;
            }
            return ResponseEntity.ok(ApiResponse.success("Successfully imported " + successCount + " ledgers", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to import: " + e.getMessage()));
        }
    }

    @PostMapping("/stock-items")
    @Transactional
    public ResponseEntity<ApiResponse<String>> importStockItems(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam("file") MultipartFile file) {
        Company company = getCompany(companyId);
        int successCount = 0;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isHeader = true;
            while ((line = reader.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }
                String[] cols = line.split(",");
                if (cols.length < 2) continue;
                String itemName = cols[0].replaceAll("\"", "").trim();
                String sku = cols[1].replaceAll("\"", "").trim();
                BigDecimal qty = cols.length > 2 ? new BigDecimal(cols[2].trim()) : BigDecimal.ZERO;
                BigDecimal cost = cols.length > 3 ? new BigDecimal(cols[3].trim()) : BigDecimal.ZERO;

                // Find or create default unit
                Unit defaultUnit = unitRepository.findAll().stream()
                        .filter(u -> u.getCompany().getId().equals(companyId))
                        .findFirst()
                        .orElseGet(() -> {
                            Unit u = Unit.builder()
                                    .code("NOS")
                                    .name("Numbers")
                                    .company(company)
                                    .build();
                            return unitRepository.save(u);
                        });

                StockItem item = StockItem.builder()
                        .code(sku)
                        .name(itemName)
                        .sku(sku)
                        .company(company)
                        .currentQuantity(qty)
                        .averageCost(cost)
                        .primaryUnit(defaultUnit)
                        .build();

                stockItemRepository.save(item);
                successCount++;
            }
            return ResponseEntity.ok(ApiResponse.success("Successfully imported " + successCount + " stock items", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to import: " + e.getMessage()));
        }
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
