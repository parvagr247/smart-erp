package com.smarterp.administration.company.controller;

import com.smarterp.administration.company.dto.*;
import com.smarterp.administration.company.service.CompanyService;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.security.AuthenticatedUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.Create')")
    public ResponseEntity<ApiResponse<CompanyResponse>> createCompany(
            @Valid @RequestBody CreateCompanyRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        CompanyResponse response = companyService.createCompany(request, authenticatedUser.getUser());
        return new ResponseEntity<>(ApiResponse.success("Company created successfully", response), HttpStatus.CREATED);
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.View')")
    public ResponseEntity<ApiResponse<Page<CompanySummaryResponse>>> getCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<CompanySummaryResponse> response = companyService.getCompanies(authenticatedUser.getUser(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Companies list retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.View')")
    public ResponseEntity<ApiResponse<CompanyResponse>> getCompany(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        CompanyResponse response = companyService.getCompany(id, authenticatedUser.getUser());
        return ResponseEntity.ok(ApiResponse.success("Company details retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.Update')")
    public ResponseEntity<ApiResponse<CompanyResponse>> updateCompany(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCompanyRequest request,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        CompanyResponse response = companyService.updateCompany(id, request, authenticatedUser.getUser());
        return ResponseEntity.ok(ApiResponse.success("Company updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.Delete')")
    public ResponseEntity<ApiResponse<Void>> deleteCompany(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        companyService.deleteCompany(id, authenticatedUser.getUser());
        return ResponseEntity.ok(ApiResponse.success("Company deleted successfully", null));
    }

    @PostMapping("/{id}/switch")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.View')")
    public ResponseEntity<ApiResponse<CompanyResponse>> switchCompany(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        CompanyResponse response = companyService.switchCompany(id, authenticatedUser.getUser());
        return ResponseEntity.ok(ApiResponse.success("Active company switched successfully", response));
    }

    @GetMapping("/{id}/permitted-users")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.Update')")
    public ResponseEntity<ApiResponse<java.util.List<com.smarterp.administration.company.dto.CompanyUserAccessResponse>>> getPermittedUsers(
            @PathVariable UUID id,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        java.util.List<com.smarterp.administration.company.dto.CompanyUserAccessResponse> list = companyService.getPermittedUsers(id, authenticatedUser.getUser());
        return ResponseEntity.ok(ApiResponse.success("Permitted users list retrieved successfully", list));
    }

    @PostMapping("/{id}/users/{userId}/access")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Company.Update')")
    public ResponseEntity<ApiResponse<Void>> updateAccess(
            @PathVariable UUID id,
            @PathVariable UUID userId,
            @RequestParam boolean grant,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        companyService.updateAccess(id, userId, grant, authenticatedUser.getUser());
        return ResponseEntity.ok(ApiResponse.success("Access updated successfully", null));
    }
}
