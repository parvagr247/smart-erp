package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.GenericLookupRequest;
import com.smarterp.inventory.master.entity.StockGroup;
import com.smarterp.inventory.master.repository.StockGroupRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/groups")
@RequiredArgsConstructor
public class StockGroupController {

    private final StockGroupRepository repository;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<StockGroup>> createGroup(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody GenericLookupRequest request) {
        Company company = getCompany(companyId);
        if (repository.existsByCompanyAndName(company, request.getName().trim())) {
            return ResponseEntity.badRequest().body(ApiResponse.<StockGroup>builder().success(false).message("Group name already exists.").build());
        }

        StockGroup group = StockGroup.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .company(company)
                .build();

        if (request.getCode() != null && !request.getCode().isEmpty()) {
            try {
                group.setParentGroup(repository.findById(UUID.fromString(request.getCode())).orElse(null));
            } catch (IllegalArgumentException e) {
                // Ignore invalid UUID
            }
        }

        StockGroup saved = repository.save(group);
        return new ResponseEntity<>(ApiResponse.<StockGroup>builder().success(true).message("Group created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StockGroup>>> getGroups(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<StockGroup> list = repository.findAllByCompany(company);
        return ResponseEntity.ok(ApiResponse.<List<StockGroup>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Group deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
