package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.WarehouseRequest;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.service.InventoryLookupService;
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

    private final InventoryLookupService lookupService;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Warehouse>> createWarehouse(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody WarehouseRequest request) {
        Company company = getCompany(companyId);
        Warehouse saved = lookupService.createWarehouse(request, company);
        return new ResponseEntity<>(ApiResponse.<Warehouse>builder().success(true).message("Warehouse created.").data(saved).build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Warehouse>>> getWarehouses(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<Warehouse> list = lookupService.getWarehouses(company);
        return ResponseEntity.ok(ApiResponse.<List<Warehouse>>builder().success(true).data(list).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWarehouse(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        lookupService.deleteWarehouse(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Warehouse deleted.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
