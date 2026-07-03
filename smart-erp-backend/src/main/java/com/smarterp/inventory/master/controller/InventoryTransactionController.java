package com.smarterp.inventory.master.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.security.AuthenticatedUser;
import com.smarterp.inventory.master.dto.InventoryTransactionRequest;
import com.smarterp.inventory.master.dto.InventoryTransactionResponse;
import com.smarterp.inventory.master.service.InventoryTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory/transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryTransactionResponse>> recordTransaction(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody InventoryTransactionRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        InventoryTransactionResponse response = service.recordTransaction(request, company, authenticatedUser.getUsername());
        return new ResponseEntity<>(ApiResponse.<InventoryTransactionResponse>builder()
                .success(true)
                .message("Inventory stock transaction logged successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponse>>> getTransactions(
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<InventoryTransactionResponse> data = service.getTransactions(company);
        return ResponseEntity.ok(ApiResponse.<List<InventoryTransactionResponse>>builder()
                .success(true)
                .data(data)
                .build());
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<List<InventoryTransactionResponse>>> getTransactionsByItem(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID itemId) {
        Company company = getCompany(companyId);
        List<InventoryTransactionResponse> data = service.getTransactionsByItem(company, itemId);
        return ResponseEntity.ok(ApiResponse.<List<InventoryTransactionResponse>>builder()
                .success(true)
                .data(data)
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
