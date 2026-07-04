package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.TaxCategoryRequest;
import com.smarterp.inventory.master.entity.TaxCategory;
import com.smarterp.inventory.master.service.InventoryLookupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/tax-categories")
@RequiredArgsConstructor
public class TaxCategoryController {

    private final InventoryLookupService lookupService;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<TaxCategory>> createTaxCategory(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody TaxCategoryRequest request) {
        Company company = getCompany(companyId);
        TaxCategory saved = lookupService.createTaxCategory(request, company);
        return new ResponseEntity<>(ApiResponse.<TaxCategory>builder().success(true).message("Tax Category created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaxCategory>>> getTaxCategories(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<TaxCategory> list = lookupService.getTaxCategories(company);
        return ResponseEntity.ok(ApiResponse.<List<TaxCategory>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTaxCategory(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        lookupService.deleteTaxCategory(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Tax Category deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
