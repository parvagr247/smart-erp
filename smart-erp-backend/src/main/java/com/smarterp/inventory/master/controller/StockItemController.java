package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.dto.InventorySummaryResponse;
import com.smarterp.inventory.master.dto.StockItemRequest;
import com.smarterp.inventory.master.dto.StockItemResponse;
import com.smarterp.inventory.master.service.StockItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/items")
@RequiredArgsConstructor
public class StockItemController {

    private final StockItemService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<StockItemResponse>> createItem(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody StockItemRequest request) {
        Company company = getCompany(companyId);
        StockItemResponse response = service.createItem(request, company);
        return new ResponseEntity<>(ApiResponse.<StockItemResponse>builder()
                .success(true)
                .message("Stock item created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StockItemResponse>> updateItem(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id,
            @Valid @RequestBody StockItemRequest request) {
        Company company = getCompany(companyId);
        StockItemResponse response = service.updateItem(id, request, company);
        return ResponseEntity.ok(ApiResponse.<StockItemResponse>builder()
                .success(true)
                .message("Stock item updated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StockItemResponse>> getItemById(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        StockItemResponse response = service.getItemById(id, company);
        return ResponseEntity.ok(ApiResponse.<StockItemResponse>builder()
                .success(true)
                .message("Stock item details retrieved successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        service.deleteItem(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Stock item deleted successfully.")
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StockItemResponse>>> getItems(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID warehouseId,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID groupId,
            @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) UUID manufacturerId,
            @RequestParam(required = false) String stockStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Company company = getCompany(companyId);
        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort[1]), sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<StockItemResponse> response = service.getItems(
                company, search, warehouseId, categoryId, groupId, brandId, manufacturerId, stockStatus, pageable
        );
        return ResponseEntity.ok(ApiResponse.<Page<StockItemResponse>>builder()
                .success(true)
                .message("Stock items retrieved successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<InventorySummaryResponse>> getSummary(
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        InventorySummaryResponse response = service.getSummary(company);
        return ResponseEntity.ok(ApiResponse.<InventorySummaryResponse>builder()
                .success(true)
                .message("Inventory summary retrieved successfully.")
                .data(response)
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found. Please select a company."));
    }
}
