package com.smarterp.inventory.partner.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.dto.PartnerRequest;
import com.smarterp.inventory.partner.dto.PartnerResponse;
import com.smarterp.inventory.partner.dto.PartnerSummaryResponse;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import com.smarterp.inventory.partner.event.PartnerBlockedEvent;
import com.smarterp.inventory.partner.event.PartnerCreatedEvent;
import com.smarterp.inventory.partner.event.PartnerUpdatedEvent;
import com.smarterp.inventory.partner.mapper.PartnerMapper;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.partner.service.PartnerService;
import com.smarterp.inventory.partner.specification.PartnerSpecification;
import com.smarterp.inventory.partner.validator.PartnerValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PartnerServiceImpl implements PartnerService {

    private final PartnerRepository repository;
    private final PartnerValidator validator;
    private final PartnerMapper mapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public PartnerResponse createPartner(PartnerRequest request, Company company) {
        log.info("Creating business partner {} for company {}", request.getName(), company.getId());
        validator.validateCreate(company, request);

        BusinessPartner partner = mapper.toEntity(request, company);
        BusinessPartner savedPartner = repository.save(partner);

        eventPublisher.publishEvent(new PartnerCreatedEvent(this, savedPartner.getId(), company.getId()));
        return mapper.toResponse(savedPartner);
    }

    @Override
    public PartnerResponse updatePartner(UUID id, PartnerRequest request, Company company) {
        log.info("Updating business partner {} in company {}", id, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        validator.validateUpdate(company, id, request);
        mapper.updateEntity(partner, request);

        BusinessPartner savedPartner = repository.save(partner);
        eventPublisher.publishEvent(new PartnerUpdatedEvent(this, savedPartner.getId(), company.getId()));
        return mapper.toResponse(savedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerResponse getPartnerById(UUID id, Company company) {
        log.info("Fetching business partner {} in company {}", id, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        return mapper.toResponse(partner);
    }

    @Override
    public void deletePartner(UUID id, Company company) {
        log.info("Deleting business partner {} in company {}", id, company.getId());
        BusinessPartner partner = repository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Business partner not found."));

        repository.delete(partner);
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
            eventPublisher.publishEvent(new PartnerBlockedEvent(this, savedPartner.getId(), company.getId()));
        } else {
            eventPublisher.publishEvent(new PartnerUpdatedEvent(this, savedPartner.getId(), company.getId()));
        }

        return mapper.toResponse(savedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PartnerResponse> getPartners(Company company, String search, PartnerType type, PartnerStatus status, Pageable pageable) {
        log.info("Listing business partners in company {} with filter Search={}, Type={}, Status={}", company.getId(), search, type, status);
        Specification<BusinessPartner> spec = PartnerSpecification.searchAndFilter(company, search, type, status);
        return repository.findAll(spec, pageable).map(mapper::toResponse);
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
}
