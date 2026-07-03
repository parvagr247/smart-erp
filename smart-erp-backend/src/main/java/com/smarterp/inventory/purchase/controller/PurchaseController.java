package com.smarterp.inventory.purchase.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.security.AuthenticatedUser;
import com.smarterp.inventory.purchase.dto.PurchaseRequest;
import com.smarterp.inventory.purchase.dto.PurchaseResponse;
import com.smarterp.inventory.purchase.entity.PurchaseStatus;
import com.smarterp.inventory.purchase.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseResponse>> createPurchase(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody PurchaseRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        PurchaseResponse response = service.createPurchase(request, company, authenticatedUser.getUsername());
        return new ResponseEntity<>(ApiResponse.<PurchaseResponse>builder()
                .success(true)
                .message("Purchase voucher created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseResponse>> updatePurchase(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody PurchaseRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        PurchaseResponse response = service.updatePurchase(id, request, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<PurchaseResponse>builder()
                .success(true)
                .message("Purchase voucher updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseResponse>> getPurchaseById(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        PurchaseResponse response = service.getPurchaseById(id, company);
        return ResponseEntity.ok(ApiResponse.<PurchaseResponse>builder()
                .success(true)
                .message("Purchase details retrieved.")
                .data(response)
                .build());
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PurchaseResponse>> updatePurchaseStatus(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam PurchaseStatus status,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        PurchaseResponse response = service.updatePurchaseStatus(id, status, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<PurchaseResponse>builder()
                .success(true)
                .message("Purchase status updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PurchaseResponse>>> searchPurchases(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PurchaseStatus status,
            @RequestParam(required = false) UUID supplierId,
            @RequestParam(required = false) UUID warehouseId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        Company company = getCompany(companyId);
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PurchaseResponse> response = service.searchPurchases(pageable, company, search, status, supplierId, warehouseId, fromDate, toDate);
        return ResponseEntity.ok(ApiResponse.<Page<PurchaseResponse>>builder()
                .success(true)
                .message("Purchases list retrieved successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePurchase(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        service.deletePurchase(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Purchase voucher deleted successfully.")
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found. Please select a company."));
    }
}
