package com.smarterp.dashboard.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.dashboard.dto.DashboardSummaryResponse;
import com.smarterp.dashboard.dto.RecentActivityResponse;
import com.smarterp.dashboard.dto.SearchResultResponse;

public interface DashboardService {
    DashboardSummaryResponse getSummary(Company company);
    RecentActivityResponse getRecentActivity(Company company);
    SearchResultResponse search(Company company, String query);
    void evictCache(java.util.UUID companyId);
}
