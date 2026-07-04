package com.smarterp.inventory.partner.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.audit.AuditLogService;
import com.smarterp.inventory.partner.dto.PartnerRequest;
import com.smarterp.inventory.partner.dto.PartnerResponse;
import com.smarterp.inventory.partner.dto.PartnerSummaryResponse;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.partner.service.PartnerService;
import com.smarterp.inventory.partner.specification.PartnerSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PartnerServiceImpl implements PartnerService {

    private final PartnerRepository repository;
    private final AuditLogService auditLogService;

    private static final Pattern GST_PATTERN = Pattern.compile("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$");
    private static final Pattern PAN_PATTERN = Pattern.compile("^[A-Z]{5}[0-9]{4}[A-Z]{1}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    @Override
    public PartnerResponse createPartner(PartnerRequest request, Company company) {
        log.info("Creating business partner {} for company {}", request.getName(), company.getId());
        validateCreate(company, request);

        BusinessPartner partner = request.toEntity(company);
        BusinessPartner savedPartner = repository.save(partner);

        auditLogService.saveLog(company.getId(), "BusinessPartner", savedPartner.getId(), "CREATED", "Business Partner onboarded.");
        return PartnerResponse.fromEntity(savedPartner);
    }

    @Override
    public PartnerResponse updatePartner(UUID id, PartnerRequest request, Company company) {
        log.info("Updating business partner {} in company {}", id, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        validateUpdate(company, id, request);
        request.updateEntity(partner);

        BusinessPartner savedPartner = repository.save(partner);
        auditLogService.saveLog(company.getId(), "BusinessPartner", savedPartner.getId(), "UPDATED", "Business Partner profile updated.");
        return PartnerResponse.fromEntity(savedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerResponse getPartnerById(UUID id, Company company) {
        log.info("Fetching business partner {} in company {}", id, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        return PartnerResponse.fromEntity(partner);
    }

    @Override
    public void deletePartner(UUID id, Company company) {
        log.info("Deleting business partner {} in company {}", id, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        repository.delete(partner);
        auditLogService.saveLog(company.getId(), "BusinessPartner", id, "DELETED", "Business Partner profile deleted.");
    }

    @Override
    public PartnerResponse updatePartnerStatus(UUID id, PartnerStatus status, Company company) {
        log.info("Transitioning business partner {} status to {} in company {}", id, status, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        partner.setStatus(status);
        partner.setIsActive(status == PartnerStatus.ACTIVE);

        BusinessPartner savedPartner = repository.save(partner);

        if (status == PartnerStatus.BLOCKED) {
            auditLogService.saveLog(company.getId(), "BusinessPartner", savedPartner.getId(), "BLOCKED", "Business Partner blocked.");
        } else {
            auditLogService.saveLog(company.getId(), "BusinessPartner", savedPartner.getId(), "UPDATED", "Business Partner status set to " + status + ".");
        }

        return PartnerResponse.fromEntity(savedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PartnerResponse> getPartners(Company company, String search, PartnerType type, PartnerStatus status, Pageable pageable) {
        log.info("Listing business partners in company {} with filter Search={}, Type={}, Status={}", company.getId(), search, type, status);
        Specification<BusinessPartner> spec = PartnerSpecification.searchAndFilter(company, search, type, status);
        return repository.findAll(spec, pageable).map(PartnerResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerSummaryResponse getSummary(Company company) {
        log.info("Compiling dashboard summary for company {}", company.getId());
        long totalCustomers = repository.countByCompanyAndTypeOrBoth(company, PartnerType.CUSTOMER);
        long totalSuppliers = repository.countByCompanyAndTypeOrBoth(company, PartnerType.SUPPLIER);
        long totalPartners = repository.countByCompany(company);

        BigDecimal receivables = repository.sumOutstandingReceivables(company);
        BigDecimal payables = repository.sumOutstandingPayables(company);

        return PartnerSummaryResponse.builder()
                .totalCustomers(totalCustomers)
                .totalSuppliers(totalSuppliers)
                .totalPartners(totalPartners)
                .outstandingReceivables(receivables)
                .outstandingPayables(payables)
                .build();
    }

    /* ==========================================================================
       Validation Rules
       ========================================================================== */
    private void validateCreate(Company company, PartnerRequest request) {
        if (repository.existsByCompanyAndCode(company, request.getCode().trim())) {
            throw new BusinessValidationException("Partner code '" + request.getCode().trim() + "' already exists in this company.");
        }
        validateFormats(request);
    }

    private void validateUpdate(Company company, UUID partnerId, PartnerRequest request) {
        if (repository.existsByCompanyAndCodeAndIdNot(company, request.getCode().trim(), partnerId)) {
            throw new BusinessValidationException("Another partner with code '" + request.getCode().trim() + "' already exists in this company.");
        }
        validateFormats(request);
    }

    private void validateFormats(PartnerRequest request) {
        if (request.getGstNumber() != null && !request.getGstNumber().trim().isEmpty()) {
            if (!GST_PATTERN.matcher(request.getGstNumber().trim().toUpperCase()).matches()) {
                throw new BusinessValidationException("Invalid GSTIN format (must be 15-digit GSTIN, e.g. 22AAAAA0000A1Z5).");
            }
        }

        if (request.getPan() != null && !request.getPan().trim().isEmpty()) {
            if (!PAN_PATTERN.matcher(request.getPan().trim().toUpperCase()).matches()) {
                throw new BusinessValidationException("Invalid PAN format (must be 10-digit PAN, e.g. ABCDE1234F).");
            }
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            if (!EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
                throw new BusinessValidationException("Invalid email format.");
            }
        }

        BigDecimal ob = request.getOpeningBalance();
        if (ob != null && ob.compareTo(BigDecimal.ZERO) > 0) {
            if (request.getBalanceType() == null) {
                throw new BusinessValidationException("Balance type (DEBIT or CREDIT) is required when opening balance is greater than zero.");
            }
        }
    }
}
