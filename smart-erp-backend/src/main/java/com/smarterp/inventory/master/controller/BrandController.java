package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.GenericLookupRequest;
import com.smarterp.inventory.master.entity.Brand;
import com.smarterp.inventory.master.repository.BrandRepository;
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

    private final BrandRepository repository;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Brand>> createBrand(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody GenericLookupRequest request) {
        Company company = getCompany(companyId);
        if (repository.existsByCompanyAndName(company, request.getName().trim())) {
            return ResponseEntity.badRequest().body(ApiResponse.<Brand>builder().success(false).message("Brand name already exists.").build());
        }
        Brand brand = Brand.builder().name(request.getName().trim()).company(company).build();
        Brand saved = repository.save(brand);
        return new ResponseEntity<>(ApiResponse.<Brand>builder().success(true).message("Brand created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Brand>>> getBrands(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<Brand> list = repository.findAllByCompany(company);
        return ResponseEntity.ok(ApiResponse.<List<Brand>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Brand deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
