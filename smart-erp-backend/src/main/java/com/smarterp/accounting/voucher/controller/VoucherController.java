package com.smarterp.accounting.voucher.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.security.AuthenticatedUser;
import com.smarterp.accounting.voucher.dto.VoucherRequest;
import com.smarterp.accounting.voucher.dto.VoucherResponse;
import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.entity.VoucherType;
import com.smarterp.accounting.voucher.service.VoucherService;
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
@RequestMapping("/api/v1/accounting/vouchers")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAnyAuthority('Accounting.CreateVoucher', 'Accounting.ViewReports')")
public class VoucherController {

    private final VoucherService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody VoucherRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        VoucherResponse response = service.createVoucher(request, company, authenticatedUser.getUsername());
        return new ResponseEntity<>(ApiResponse.<VoucherResponse>builder()
                .success(true)
                .message("Accounting voucher created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody VoucherRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        VoucherResponse response = service.updateVoucher(id, request, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<VoucherResponse>builder()
                .success(true)
                .message("Accounting voucher updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        VoucherResponse response = service.getVoucherById(id, company);
        return ResponseEntity.ok(ApiResponse.<VoucherResponse>builder().success(true).data(response).build());
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Accounting.ApproveVoucher')")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucherStatus(
            @PathVariable UUID id,
            @RequestParam VoucherStatus status,
            @RequestHeader("X-Company-ID") UUID companyId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        VoucherResponse response = service.updateVoucherStatus(id, status, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<VoucherResponse>builder()
                .success(true)
                .message("Voucher status updated to " + status + ".")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VoucherResponse>>> searchAndFilterVouchers(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) VoucherType type,
            @RequestParam(required = false) VoucherStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "voucherDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Company company = getCompany(companyId);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VoucherResponse> result = service.searchAndFilterVouchers(company, search, type, status, startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.<Page<VoucherResponse>>builder().success(true).data(result).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        service.deleteVoucher(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Accounting voucher deleted successfully.")
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
