package com.smarterp.inventory.sales.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.security.AuthenticatedUser;
import com.smarterp.inventory.sales.dto.SalesRequest;
import com.smarterp.inventory.sales.dto.SalesResponse;
import com.smarterp.inventory.sales.entity.SalesStatus;
import com.smarterp.inventory.sales.service.SalesService;
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
@RequestMapping("/api/v1/inventory/sales")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.View')")
public class SalesController {

    private final SalesService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Sales.Create')")
    public ResponseEntity<ApiResponse<SalesResponse>> createSales(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody SalesRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        SalesResponse response = service.createSales(request, company, authenticatedUser.getUsername());
        return new ResponseEntity<>(ApiResponse.<SalesResponse>builder()
                .success(true)
                .message("Sales tax invoice created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Sales.Create')")
    public ResponseEntity<ApiResponse<SalesResponse>> updateSales(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody SalesRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        SalesResponse response = service.updateSales(id, request, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<SalesResponse>builder()
                .success(true)
                .message("Sales tax invoice updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SalesResponse>> getSalesById(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        SalesResponse response = service.getSalesById(id, company);
        return ResponseEntity.ok(ApiResponse.<SalesResponse>builder().success(true).data(response).build());
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyAuthority('Sales.Approve', 'Sales.Cancel')")
    public ResponseEntity<ApiResponse<SalesResponse>> updateSalesStatus(
            @PathVariable UUID id,
            @RequestParam SalesStatus status,
            @RequestHeader("X-Company-ID") UUID companyId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        SalesResponse response = service.updateSalesStatus(id, status, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<SalesResponse>builder()
                .success(true)
                .message("Sales invoice status updated to " + status + ".")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SalesResponse>>> searchAndFilterSales(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) SalesStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "salesDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Company company = getCompany(companyId);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SalesResponse> result = service.searchAndFilterSales(company, search, status, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.<Page<SalesResponse>>builder().success(true).data(result).build());
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Sales.Cancel')")
    public ResponseEntity<ApiResponse<Void>> deleteSales(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        service.deleteSales(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Sales tax invoice deleted successfully.")
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
