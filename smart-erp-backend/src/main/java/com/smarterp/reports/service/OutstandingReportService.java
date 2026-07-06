package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.reports.dto.OutstandingResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class OutstandingReportService {

    private final PartnerRepository partnerRepository;
    private final LedgerRepository ledgerRepository;

    public OutstandingResponse getOutstanding(Company company, String partnerType) {
        log.info("Generating Outstanding Report for partner type: {}", partnerType);
        List<BusinessPartner> partners = partnerRepository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("type"), partnerType.toUpperCase())
        ));

        List<OutstandingResponse.OutstandingRow> rows = new ArrayList<>();
        BigDecimal totalOutstanding = BigDecimal.ZERO;

        for (BusinessPartner partner : partners) {
            // Find partner ledger
            String ledgerName = partner.getName() + " Ledger";
            Ledger l = ledgerRepository.findByCompanyAndName(company, ledgerName).orElse(null);
            BigDecimal bal = l != null && l.getOpeningBalance() != null ? l.getOpeningBalance() : BigDecimal.ZERO;

            if (bal.compareTo(BigDecimal.ZERO) > 0) {
                rows.add(OutstandingResponse.OutstandingRow.builder()
                        .partnerId(partner.getId())
                        .partnerName(partner.getName())
                        .partnerType(partnerType)
                        .outstandingAmount(bal)
                        .phone(partner.getPhone())
                        .email(partner.getEmail())
                        .build());
                totalOutstanding = totalOutstanding.add(bal);
            }
        }

        return OutstandingResponse.builder()
                .rows(rows)
                .totalOutstanding(totalOutstanding)
                .build();
    }
}
