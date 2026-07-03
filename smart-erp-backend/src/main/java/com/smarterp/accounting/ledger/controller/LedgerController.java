package com.smarterp.accounting.ledger.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.ledger.dto.LedgerRequest;
import com.smarterp.accounting.ledger.dto.LedgerResponse;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.service.LedgerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounting/ledgers")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<LedgerResponse>> createLedger(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody LedgerRequest request) {
        Company company = getCompany(companyId);
        LedgerResponse response = service.createLedger(request, company);
        return new ResponseEntity<>(ApiResponse.<LedgerResponse>builder()
                .success(true)
                .message("Ledger created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<LedgerResponse>> updateLedger(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id,
            @Valid @RequestBody LedgerRequest request) {
        Company company = getCompany(companyId);
        LedgerResponse response = service.updateLedger(id, request, company);
        return ResponseEntity.ok(ApiResponse.<LedgerResponse>builder()
                .success(true)
                .message("Ledger updated successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLedger(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        service.deleteLedger(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Ledger deleted successfully.")
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LedgerResponse>> getLedger(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        LedgerResponse response = service.getLedger(id, company);
        return ResponseEntity.ok(ApiResponse.<LedgerResponse>builder()
                .success(true)
                .message("Ledger details retrieved.")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LedgerResponse>>> getLedgers(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID groupId,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) BalanceType balanceType,
            @RequestParam(required = false) Boolean gstApplicable,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Company company = getCompany(companyId);

        // Parse sorting parameters
        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort[1]), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<LedgerResponse> response = service.searchAndFilterLedgers(
            company, search, groupId, isActive, balanceType, gstApplicable, pageable
        );

        return ResponseEntity.ok(ApiResponse.<Page<LedgerResponse>>builder()
                .success(true)
                .message("Ledgers retrieved successfully.")
                .data(response)
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found. Please select a company."));
    }
}
