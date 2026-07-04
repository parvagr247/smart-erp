package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.TaxCategoryRequest;
import com.smarterp.inventory.master.entity.TaxCategory;
import com.smarterp.inventory.master.repository.TaxCategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/tax-categories")
@RequiredArgsConstructor
public class TaxCategoryController {

    private final TaxCategoryRepository repository;
    private final CompanyRepository companyRepository;

    @PostMapping
    @CacheEvict(value = "taxes", key = "#companyId")
    public ResponseEntity<ApiResponse<TaxCategory>> createTaxCategory(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody TaxCategoryRequest request) {
        Company company = getCompany(companyId);
        if (repository.existsByCompanyAndTaxCode(company, request.getTaxCode().trim().toUpperCase())) {
            return ResponseEntity.badRequest().body(ApiResponse.<TaxCategory>builder().success(false).message("Tax Code already exists.").build());
        }
        
        BigDecimal gst = request.getGstRate();
        BigDecimal half = gst.divide(BigDecimal.valueOf(2), 2, BigDecimal.ROUND_HALF_UP);

        TaxCategory tc = TaxCategory.builder()
                .taxCode(request.getTaxCode().trim().toUpperCase())
                .name(request.getName().trim())
                .gstRate(gst)
                .cgstRate(request.getCgstRate() != null ? request.getCgstRate() : half)
                .sgstRate(request.getSgstRate() != null ? request.getSgstRate() : half)
                .igstRate(request.getIgstRate() != null ? request.getIgstRate() : gst)
                .cessRate(request.getCessRate() != null ? request.getCessRate() : BigDecimal.ZERO)
                .effectiveDate(request.getEffectiveDate())
                .company(company)
                .build();
        TaxCategory saved = repository.save(tc);
        return new ResponseEntity<>(ApiResponse.<TaxCategory>builder().success(true).message("Tax Category created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    @Cacheable(value = "taxes", key = "#companyId")
    public ResponseEntity<ApiResponse<List<TaxCategory>>> getTaxCategories(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<TaxCategory> list = repository.findAllByCompany(company);
        return ResponseEntity.ok(ApiResponse.<List<TaxCategory>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "taxes", key = "#companyId")
    public ResponseEntity<ApiResponse<Void>> deleteTaxCategory(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Tax Category deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
