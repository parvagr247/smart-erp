package com.smarterp.administration.company.service;

import com.smarterp.administration.company.dto.CompanyResponse;
import com.smarterp.administration.company.dto.CompanySummaryResponse;
import com.smarterp.administration.company.dto.CreateCompanyRequest;
import com.smarterp.administration.company.dto.UpdateCompanyRequest;
import com.smarterp.auth.entity.User;
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
