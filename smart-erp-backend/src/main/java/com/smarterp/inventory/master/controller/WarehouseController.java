package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.WarehouseRequest;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.entity.WarehouseSection;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseRepository repository;
    private final CompanyRepository companyRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @PostMapping
    public ResponseEntity<ApiResponse<Warehouse>> createWarehouse(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody WarehouseRequest request) {
        Company company = getCompany(companyId);
        if (repository.existsByCompanyAndCode(company, request.getCode().trim().toUpperCase())) {
            return ResponseEntity.badRequest().body(ApiResponse.<Warehouse>builder().success(false).message("Warehouse code already exists.").build());
        }

        Warehouse wh = Warehouse.builder()
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .address(request.getAddress())
                .company(company)
                .build();

        if (request.getSections() != null) {
            for (String sectionName : request.getSections()) {
                if (sectionName != null && !sectionName.trim().isEmpty()) {
                    WarehouseSection section = WarehouseSection.builder().name(sectionName.trim()).build();
                    wh.addSection(section);
                }
            }
        }

        Warehouse saved = repository.save(wh);
        
        eventPublisher.publishEvent(new com.smarterp.inventory.master.event.WarehouseCreatedEvent(
                this, saved.getId(), company.getId(), saved.getName()));

        return new ResponseEntity<>(ApiResponse.<Warehouse>builder().success(true).message("Warehouse created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Warehouse>>> getWarehouses(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<Warehouse> list = repository.findAllByCompany(company);
        return ResponseEntity.ok(ApiResponse.<List<Warehouse>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWarehouse(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        repository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Warehouse deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
