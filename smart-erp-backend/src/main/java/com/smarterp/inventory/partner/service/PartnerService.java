package com.smarterp.inventory.partner.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.partner.dto.PartnerRequest;
import com.smarterp.inventory.partner.dto.PartnerResponse;
import com.smarterp.inventory.partner.dto.PartnerSummaryResponse;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface PartnerService {
    PartnerResponse createPartner(PartnerRequest request, Company company);
    PartnerResponse updatePartner(UUID id, PartnerRequest request, Company company);
    PartnerResponse getPartnerById(UUID id, Company company);
    void deletePartner(UUID id, Company company);
    PartnerResponse updatePartnerStatus(UUID id, PartnerStatus status, Company company);
    Page<PartnerResponse> getPartners(Company company, String search, PartnerType type, PartnerStatus status, Pageable pageable);
    PartnerSummaryResponse getSummary(Company company);
}
