package com.smarterp.administration.company.service.impl;

import com.smarterp.administration.company.dto.*;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.administration.company.service.CompanyService;
import com.smarterp.auth.entity.User;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository repository;
    private final com.smarterp.auth.repository.UserRepo userRepo;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public CompanyResponse createCompany(CreateCompanyRequest request, User owner) {
        validateCreate(request.getGstNumber());
        
        Company company = request.toEntity(owner);
        Company savedCompany = repository.save(company);
        
        eventPublisher.publishEvent(new com.smarterp.administration.company.event.CompanyCreatedEvent(this, savedCompany.getId()));
        
        return CompanyResponse.fromEntity(savedCompany);
    }

    @Override
    @CacheEvict(value = "companies", key = "#id")
    public CompanyResponse updateCompany(UUID id, UpdateCompanyRequest request, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validateOwnership(company, owner);
        validateUpdate(id, request.getGstNumber());

        // Optimistic Locking validation
        if (!company.getVersion().equals(request.getVersion())) {
            throw new BusinessValidationException("This company record was modified by another transaction. Please reload and try again.");
        }

        request.updateEntity(company);
        Company updatedCompany = repository.save(company);
        
        return CompanyResponse.fromEntity(updatedCompany);
    }

    @Override
    @CacheEvict(value = "companies", key = "#id")
    public void deleteCompany(UUID id, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validateOwnership(company, owner);
        
        repository.delete(company);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "companies", key = "#id")
    public CompanyResponse getCompany(UUID id, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validateOwnership(company, owner);
        
        return CompanyResponse.fromEntity(company);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanySummaryResponse> getCompanies(User owner, Pageable pageable) {
        Page<Company> companiesPage;
        if (owner.getRole() == com.smarterp.auth.entity.enums.Role.ADMIN) {
            companiesPage = repository.findAll(pageable);
        } else {
            companiesPage = repository.findByOwnerOrPermittedUser(owner.getId(), pageable);
        }
        return companiesPage.map(CompanySummaryResponse::fromEntity);
    }

    @Override
    public CompanyResponse switchCompany(UUID id, User owner) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + id));
        
        validateOwnership(company, owner);
        
        // Switched company successfully
        log.info("User {} switched context to company {}", owner.getId(), company.getId());
        
        return CompanyResponse.fromEntity(company);
    }

    /* ==========================================================================
       Validation Rules
       ========================================================================== */
    private void validateCreate(String gstNumber) {
        if (repository.existsByGstNumber(gstNumber.trim())) {
            throw new BusinessValidationException("GST number already registered under another company.");
        }
    }

    private void validateUpdate(UUID id, String gstNumber) {
        if (repository.existsByGstNumberAndIdNot(gstNumber.trim(), id)) {
            throw new BusinessValidationException("GST number already registered under another company.");
        }
    }

    private void validateOwnership(Company company, User owner) {
        if (owner.getRole() == com.smarterp.auth.entity.enums.Role.ADMIN) {
            return;
        }
        if (company.getOwner().getId().equals(owner.getId())) {
            return;
        }
        boolean isPermitted = company.getPermittedUsers().stream()
                .anyMatch(u -> u.getId().equals(owner.getId()));
        if (!isPermitted) {
            throw new com.smarterp.common.exception.UnauthorizedAccessException("You do not have access to this company resource.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.smarterp.administration.company.dto.CompanyUserAccessResponse> getPermittedUsers(UUID companyId, User admin) {
        if (admin.getRole() != com.smarterp.auth.entity.enums.Role.ADMIN) {
            throw new com.smarterp.common.exception.UnauthorizedAccessException("Only administrators can manage company access.");
        }
        Company company = repository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + companyId));

        java.util.List<User> allUsers = userRepo.findAll();
        return allUsers.stream()
                .filter(u -> u.getRole() != com.smarterp.auth.entity.enums.Role.ADMIN)
                .map(u -> {
                    boolean hasAccess = company.getPermittedUsers().stream()
                            .anyMatch(permitted -> permitted.getId().equals(u.getId()))
                            || company.getOwner().getId().equals(u.getId());
                    return com.smarterp.administration.company.dto.CompanyUserAccessResponse.builder()
                            .userId(u.getId())
                            .fullName(u.getFullName())
                            .email(u.getEmail())
                            .role(u.getRole())
                            .hasAccess(hasAccess)
                            .build();
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public void updateAccess(UUID companyId, UUID userId, boolean grant, User admin) {
        if (admin.getRole() != com.smarterp.auth.entity.enums.Role.ADMIN) {
            throw new com.smarterp.common.exception.UnauthorizedAccessException("Only administrators can manage company access.");
        }
        Company company = repository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + companyId));

        User targetUser = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (company.getOwner().getId().equals(userId)) {
            throw new BusinessValidationException("Cannot modify access for the company owner.");
        }

        if (grant) {
            if (!company.getPermittedUsers().stream().anyMatch(u -> u.getId().equals(userId))) {
                company.getPermittedUsers().add(targetUser);
            }
        } else {
            company.getPermittedUsers().removeIf(u -> u.getId().equals(userId));
        }

        repository.save(company);
    }
}
