package com.smarterp.administration.company.service.impl;

import com.smarterp.administration.company.dto.*;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.event.CompanySwitchedEvent;
import com.smarterp.administration.company.mapper.CompanyMapper;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.administration.company.service.CompanyService;
import com.smarterp.administration.company.validator.CompanyValidator;
import com.smarterp.auth.entity.User;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository repository;
    private final CompanyMapper mapper;
    private final CompanyValidator validator;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public CompanyResponse createCompany(CreateCompanyRequest request, User owner) {
        validator.validateCreate(request.getGstNumber());
        
        Company company = mapper.toEntity(request, owner);
        Company savedCompany = repository.save(company);
        
        eventPublisher.publishEvent(new com.smarterp.company.event.CompanyCreatedEvent(this, savedCompany.getId()));
        
        return mapper.toResponse(savedCompany);
    }

    @Override
    public CompanyResponse updateCompany(UUID id, UpdateCompanyRequest request, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validator.validateOwnership(company, owner);
        validator.validateUpdate(id, request.getGstNumber());

        // Optimistic Locking validation
        if (!company.getVersion().equals(request.getVersion())) {
            throw new BusinessValidationException("This company record was modified by another transaction. Please reload and try again.");
        }

        mapper.updateEntityFromRequest(request, company);
        Company updatedCompany = repository.save(company);
        
        return mapper.toResponse(updatedCompany);
    }

    @Override
    public void deleteCompany(UUID id, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validator.validateOwnership(company, owner);
        
        repository.delete(company);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompany(UUID id, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validator.validateOwnership(company, owner);
        
        return mapper.toResponse(company);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanySummaryResponse> getCompanies(User owner, Pageable pageable) {
        Page<Company> companiesPage = repository.findByOwner(owner, pageable);
        return companiesPage.map(mapper::toSummaryResponse);
    }

    @Override
    public CompanyResponse switchCompany(UUID id, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validator.validateOwnership(company, owner);
        
        // Publish switch event
        eventPublisher.publishEvent(new CompanySwitchedEvent(this, company.getId(), owner.getId()));
        
        return mapper.toResponse(company);
    }
}
