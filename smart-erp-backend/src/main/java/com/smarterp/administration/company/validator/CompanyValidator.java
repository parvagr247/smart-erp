package com.smarterp.administration.company.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.auth.entity.User;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class CompanyValidator {

    private final CompanyRepository repository;

    public void validateCreate(String gstNumber) {
        if (repository.existsByGstNumber(gstNumber)) {
            throw new BusinessValidationException("GST Number " + gstNumber + " is already registered.");
        }
    }

    public void validateUpdate(UUID companyId, String gstNumber) {
        repository.findByGstNumber(gstNumber).ifPresent(existingCompany -> {
            if (!existingCompany.getId().equals(companyId)) {
                throw new BusinessValidationException("GST Number " + gstNumber + " is already registered by another company.");
            }
        });
    }

    public void validateOwnership(Company company, User owner) {
        if (!company.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedAccessException("You do not own this company and cannot access its details.");
        }
    }
}
