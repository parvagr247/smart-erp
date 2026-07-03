package com.smarterp.accounting.group.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.group.dto.AccountGroupRequest;
import com.smarterp.accounting.group.dto.AccountGroupResponse;
import com.smarterp.accounting.group.service.AccountGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounting/groups")
@RequiredArgsConstructor
public class AccountGroupController {

    private final AccountGroupService service;
    private final CompanyRepository companyRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountGroupResponse>> createGroup(
            @RequestHeader("X-Company-ID") UUID companyId,
            @Valid @RequestBody AccountGroupRequest request) {
        Company company = getCompany(companyId);
        AccountGroupResponse response = service.createGroup(request, company);
        return new ResponseEntity<>(ApiResponse.<AccountGroupResponse>builder()
                .success(true)
                .message("Account group created successfully.")
                .data(response)
                .build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountGroupResponse>> updateGroup(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id,
            @Valid @RequestBody AccountGroupRequest request) {
        Company company = getCompany(companyId);
        AccountGroupResponse response = service.updateGroup(id, request, company);
        return ResponseEntity.ok(ApiResponse.<AccountGroupResponse>builder()
                .success(true)
                .message("Account group updated successfully.")
                .data(response)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGroup(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        service.deleteGroup(id, company);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Account group deleted successfully.")
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountGroupResponse>>> getGroups(
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        List<AccountGroupResponse> response = service.getGroups(company);
        return ResponseEntity.ok(ApiResponse.<List<AccountGroupResponse>>builder()
                .success(true)
                .message("Account groups retrieved successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountGroupResponse>> getGroup(
            @RequestHeader("X-Company-ID") UUID companyId,
            @PathVariable UUID id) {
        Company company = getCompany(companyId);
        AccountGroupResponse response = service.getGroup(id, company);
        return ResponseEntity.ok(ApiResponse.<AccountGroupResponse>builder()
                .success(true)
                .message("Account group details retrieved.")
                .data(response)
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found. Please select a company."));
    }
}
