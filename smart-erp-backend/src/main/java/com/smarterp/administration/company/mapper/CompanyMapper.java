package com.smarterp.administration.company.mapper;

import com.smarterp.administration.company.dto.CompanyResponse;
import com.smarterp.administration.company.dto.CompanySummaryResponse;
import com.smarterp.administration.company.dto.CreateCompanyRequest;
import com.smarterp.administration.company.dto.UpdateCompanyRequest;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {

    public Company toEntity(CreateCompanyRequest request, User owner) {
        if (request == null) return null;
        return Company.builder()
                .name(request.getName())
                .gstNumber(request.getGstNumber())
                .panNumber(request.getPanNumber())
                .financialYear(request.getFinancialYear())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .pincode(request.getPincode())
                .phone(request.getPhone())
                .email(request.getEmail())
                .currency(request.getCurrency())
                .logo(request.getLogo())
                .owner(owner)
                .build();
    }

    public CompanyResponse toResponse(Company company) {
        if (company == null) return null;
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .gstNumber(company.getGstNumber())
                .panNumber(company.getPanNumber())
                .financialYear(company.getFinancialYear())
                .address(company.getAddress())
                .city(company.getCity())
                .state(company.getState())
                .country(company.getCountry())
                .pincode(company.getPincode())
                .phone(company.getPhone())
                .email(company.getEmail())
                .currency(company.getCurrency())
                .logo(company.getLogo())
                .isActive(company.getIsActive())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .version(company.getVersion())
                .build();
    }

    public CompanySummaryResponse toSummaryResponse(Company company) {
        if (company == null) return null;
        return CompanySummaryResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .gstNumber(company.getGstNumber())
                .financialYear(company.getFinancialYear())
                .state(company.getState())
                .address(company.getAddress())
                .createdAt(company.getCreatedAt())
                .build();
    }

    public void updateEntityFromRequest(UpdateCompanyRequest request, Company company) {
        if (request == null || company == null) return;
        company.setName(request.getName());
        company.setGstNumber(request.getGstNumber());
        company.setPanNumber(request.getPanNumber());
        company.setFinancialYear(request.getFinancialYear());
        company.setAddress(request.getAddress());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPincode(request.getPincode());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        company.setCurrency(request.getCurrency());
        company.setLogo(request.getLogo());
    }
}
