package com.smarterp.company.service;

import com.smarterp.company.dto.CompanyResponse;
import com.smarterp.company.dto.CompanySummaryResponse;
import com.smarterp.company.dto.CreateCompanyRequest;
import com.smarterp.company.dto.UpdateCompanyRequest;
import com.smarterp.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CompanyService {

    CompanyResponse createCompany(CreateCompanyRequest request, User owner);

    CompanyResponse updateCompany(UUID id, UpdateCompanyRequest request, User owner);

    void deleteCompany(UUID id, User owner);

    CompanyResponse getCompany(UUID id, User owner);

    Page<CompanySummaryResponse> getCompanies(User owner, Pageable pageable);

    CompanyResponse switchCompany(UUID id, User owner);
}
