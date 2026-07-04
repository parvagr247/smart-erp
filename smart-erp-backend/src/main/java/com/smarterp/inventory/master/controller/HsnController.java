package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.HsnRequest;
import com.smarterp.inventory.master.entity.Hsn;
import com.smarterp.inventory.master.service.InventoryLookupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/hsn")
@RequiredArgsConstructor
public class HsnController {

    private final InventoryLookupService lookupService;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Hsn>> createHsn(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody HsnRequest request) {
        Company company = getCompany(companyId);
        Hsn saved = lookupService.createHsn(request, company);
        return new ResponseEntity<>(ApiResponse.<Hsn>builder().success(true).message("HSN created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Hsn>>> getHsns(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<Hsn> list = lookupService.getHsns(company);
        return ResponseEntity.ok(ApiResponse.<List<Hsn>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHsn(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        lookupService.deleteHsn(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("HSN deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
