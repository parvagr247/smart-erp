package com.smarterp.inventory.partner.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.inventory.partner.dto.PartnerRequest;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class PartnerValidator {

    private final PartnerRepository repository;

    private static final Pattern GST_PATTERN = Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$");
    private static final Pattern PAN_PATTERN = Pattern.compile("^[A-Z]{5}[0-9]{4}[A-Z]{1}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public void validateCreate(Company company, PartnerRequest request) {
        // 1. Unique code check
        if (repository.existsByCompanyAndCode(company, request.getCode().trim())) {
            throw new BusinessValidationException("Partner code '" + request.getCode().trim() + "' already exists in this company.");
        }
        validateFormats(request);
    }

    public void validateUpdate(Company company, UUID partnerId, PartnerRequest request) {
        // 1. Unique code check excluding itself
        if (repository.existsByCompanyAndCodeAndIdNot(company, request.getCode().trim(), partnerId)) {
            throw new BusinessValidationException("Another partner with code '" + request.getCode().trim() + "' already exists in this company.");
        }
        validateFormats(request);
    }

    private void validateFormats(PartnerRequest request) {
        // GSTIN Check
        if (request.getGstNumber() != null && !request.getGstNumber().trim().isEmpty()) {
            if (!GST_PATTERN.matcher(request.getGstNumber().trim().toUpperCase()).matches()) {
                throw new BusinessValidationException("Invalid GSTIN format (must be 15-digit GSTIN, e.g. 22AAAAA0000A1Z5).");
            }
        }

        // PAN Check
        if (request.getPan() != null && !request.getPan().trim().isEmpty()) {
            if (!PAN_PATTERN.matcher(request.getPan().trim().toUpperCase()).matches()) {
                throw new BusinessValidationException("Invalid PAN format (must be 10-digit PAN, e.g. ABCDE1234F).");
            }
        }

        // Email Check
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
                throw new BusinessValidationException("Invalid email format.");
            }
        }

        // Opening Balance vs Balance Type check
        BigDecimal ob = request.getOpeningBalance();
        if (ob != null && ob.compareTo(BigDecimal.ZERO) > 0) {
            if (request.getBalanceType() == null) {
                throw new BusinessValidationException("Balance type (DEBIT or CREDIT) is required when opening balance is greater than zero.");
            }
        }
    }
}
