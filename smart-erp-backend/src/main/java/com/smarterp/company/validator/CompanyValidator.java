package com.smarterp.company.validator;

import com.smarterp.company.entity.Company;
import com.smarterp.company.repository.CompanyRepository;
import com.smarterp.entities.User;
import com.smarterp.exceptions.BusinessValidationException;
import com.smarterp.exceptions.UnauthorizedAccessException;
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
