package com.smarterp.dashboard.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.dashboard.dto.DashboardSummaryResponse;
import com.smarterp.dashboard.dto.RecentActivityResponse;
import com.smarterp.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;
    private final CompanyRepository companyRepository;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        DashboardSummaryResponse response = service.getSummary(company);
        return ResponseEntity.ok(ApiResponse.<DashboardSummaryResponse>builder()
                .success(true)
                .message("Dashboard summary aggregated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<ApiResponse<RecentActivityResponse>> getRecentActivity(
            @RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        RecentActivityResponse response = service.getRecentActivity(company);
        return ResponseEntity.ok(ApiResponse.<RecentActivityResponse>builder()
                .success(true)
                .message("Recent activity aggregated successfully.")
                .data(response)
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<com.smarterp.dashboard.dto.SearchResultResponse>> search(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam String query) {
        Company company = getCompany(companyId);
        com.smarterp.dashboard.dto.SearchResultResponse response = service.search(company, query);
        return ResponseEntity.ok(ApiResponse.<com.smarterp.dashboard.dto.SearchResultResponse>builder()
                .success(true)
                .message("Search results retrieved.")
                .data(response)
                .build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found. Please select a company."));
    }
}
