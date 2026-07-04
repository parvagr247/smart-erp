package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.UnitRequest;
import com.smarterp.inventory.master.entity.Unit;
import com.smarterp.inventory.master.repository.UnitRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/units")
@RequiredArgsConstructor
public class UnitController {

    private final UnitRepository repository;
    private final CompanyRepository companyRepository;

    @PostMapping
    @CacheEvict(value = "units", key = "#companyId")
    public ResponseEntity<ApiResponse<Unit>> createUnit(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody UnitRequest request) {
        Company company = getCompany(companyId);
        if (repository.existsByCompanyAndCode(company, request.getCode().trim().toUpperCase())) {
            return ResponseEntity.badRequest().body(ApiResponse.<Unit>builder().success(false).message("Unit code already exists.").build());
        }
        Unit unit = Unit.builder()
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .abbreviation(request.getAbbreviation())
                .decimalPrecision(request.getDecimalPrecision())
                .company(company)
                .build();
        Unit saved = repository.save(unit);
        return new ResponseEntity<>(ApiResponse.<Unit>builder().success(true).message("Unit created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    @Cacheable(value = "units", key = "#companyId")
    public ResponseEntity<ApiResponse<List<Unit>>> getUnits(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<Unit> list = repository.findAllByCompany(company);
        return ResponseEntity.ok(ApiResponse.<List<Unit>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "units", key = "#companyId")
    public ResponseEntity<ApiResponse<Void>> deleteUnit(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Unit deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
