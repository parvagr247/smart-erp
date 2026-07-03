package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.GenericLookupRequest;
import com.smarterp.inventory.master.entity.StockCategory;
import com.smarterp.inventory.master.repository.StockCategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/categories")
@RequiredArgsConstructor
public class StockCategoryController {

    private final StockCategoryRepository repository;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<StockCategory>> createCategory(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody GenericLookupRequest request) {
        Company company = getCompany(companyId);
        if (repository.existsByCompanyAndName(company, request.getName().trim())) {
            return ResponseEntity.badRequest().body(ApiResponse.<StockCategory>builder().success(false).message("Category already exists.").build());
        }
        StockCategory cat = StockCategory.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .company(company)
                .build();
        StockCategory saved = repository.save(cat);
        return new ResponseEntity<>(ApiResponse.<StockCategory>builder().success(true).message("Category created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockCategory>>> getCategories(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<StockCategory> list = repository.findAllByCompany(company);
        return ResponseEntity.ok(ApiResponse.<List<StockCategory>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Category deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
