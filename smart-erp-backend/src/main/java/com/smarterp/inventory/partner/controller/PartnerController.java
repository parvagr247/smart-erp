package com.smarterp.inventory.partner.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.dto.PartnerRequest;
import com.smarterp.inventory.partner.dto.PartnerResponse;
import com.smarterp.inventory.partner.dto.PartnerSummaryResponse;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import com.smarterp.inventory.partner.service.PartnerService;
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
@RequestMapping("/api/v1/inventory/partners")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<PartnerResponse>> createPartner(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody PartnerRequest request) {
        Company company = getCompany(companyId);
        PartnerResponse response = service.createPartner(request, company);
        return new ResponseEntity<>(ApiResponse.<PartnerResponse>builder()
                .success(true)
                .message("Business partner created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PartnerResponse>> updatePartner(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id,
            @Valid @RequestBody PartnerRequest request) {
        Company company = getCompany(companyId);
        PartnerResponse response = service.updatePartner(id, request, company);
        return ResponseEntity.ok(ApiResponse.<PartnerResponse>builder()
                .success(true)
                .message("Business partner updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PartnerResponse>> getPartnerById(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        PartnerResponse response = service.getPartnerById(id, company);
        return ResponseEntity.ok(ApiResponse.<PartnerResponse>builder()
                .success(true)
                .message("Business partner details retrieved successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePartner(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        service.deletePartner(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Business partner deleted successfully.")
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<PartnerResponse>> updatePartnerStatus(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id,
            @RequestParam PartnerStatus status) {
        Company company = getCompany(companyId);
        PartnerResponse response = service.updatePartnerStatus(id, status, company);
        return ResponseEntity.ok(ApiResponse.<PartnerResponse>builder()
                .success(true)
                .message("Business partner status updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PartnerResponse>>> getPartners(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PartnerType type,
            @RequestParam(required = false) PartnerStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Company company = getCompany(companyId);
        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort[1]), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<PartnerResponse> response = service.getPartners(company, search, type, status, pageable);
        return ResponseEntity.ok(ApiResponse.<Page<PartnerResponse>>builder()
                .success(true)
                .message("Business partners retrieved successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<PartnerSummaryResponse>> getSummary(
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        PartnerSummaryResponse response = service.getSummary(company);
        return ResponseEntity.ok(ApiResponse.<PartnerSummaryResponse>builder()
                .success(true)
                .message("Summary data retrieved successfully.")
                .data(response)
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found. Please select a company."));
    }
}
