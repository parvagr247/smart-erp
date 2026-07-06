package com.smarterp.dashboard.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.dashboard.dto.DashboardSummaryResponse;
import com.smarterp.dashboard.dto.RecentActivityResponse;
import com.smarterp.dashboard.dto.SearchResultResponse;
import com.smarterp.dashboard.service.DashboardService;
import com.smarterp.dashboard.service.DashboardSummaryService;
import com.smarterp.dashboard.service.DashboardActivityService;
import com.smarterp.dashboard.service.DashboardSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final DashboardSummaryService dashboardSummaryService;
    private final DashboardActivityService dashboardActivityService;
    private final DashboardSearchService dashboardSearchService;

    @Override
    public DashboardSummaryResponse getSummary(Company company) {
        return dashboardSummaryService.getSummary(company);
    }

    @Override
    public RecentActivityResponse getRecentActivity(Company company) {
        return dashboardActivityService.getRecentActivity(company);
    }

    @Override
    public SearchResultResponse search(Company company, String query) {
        return dashboardSearchService.search(company, query);
    }
}
