package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.GenericLookupRequest;
import com.smarterp.inventory.master.entity.Brand;
import com.smarterp.inventory.master.service.InventoryLookupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/brands")
@RequiredArgsConstructor
public class BrandController {

    private final InventoryLookupService lookupService;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Brand>> createBrand(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody GenericLookupRequest request) {
        Company company = getCompany(companyId);
        Brand saved = lookupService.createBrand(request, company);
        return new ResponseEntity<>(ApiResponse.<Brand>builder().success(true).message("Brand created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Brand>>> getBrands(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<Brand> list = lookupService.getBrands(company);
        return ResponseEntity.ok(ApiResponse.<List<Brand>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        lookupService.deleteBrand(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Brand deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
