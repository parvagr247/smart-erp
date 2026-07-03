package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.reports.dto.KpiResponse;

public interface KpiService {
    KpiResponse calculateKpis(Company company);
}
