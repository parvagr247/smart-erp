package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.reports.dto.GstSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class TaxReportService {

    private final LedgerRepository ledgerRepository;

    public GstSummaryResponse getGstSummary(Company company, LocalDate startDate, LocalDate endDate) {
        log.info("Generating GST Summary for company: {}", company.getId());

        // Fetch inputs from Input Tax accounts
        BigDecimal inputCgst = getLedgerBalance(company, "CGST Input Tax Account");
        BigDecimal inputSgst = getLedgerBalance(company, "SGST Input Tax Account");
        BigDecimal inputIgst = getLedgerBalance(company, "IGST Input Tax Account");
        BigDecimal totalInputTax = inputCgst.add(inputSgst).add(inputIgst);

        // Fetch outputs from Output Tax accounts
        BigDecimal outputCgst = getLedgerBalance(company, "CGST Output Tax Account");
        BigDecimal outputSgst = getLedgerBalance(company, "SGST Output Tax Account");
        BigDecimal outputIgst = getLedgerBalance(company, "IGST Output Tax Account");
        BigDecimal totalOutputTax = outputCgst.add(outputSgst).add(outputIgst);

        BigDecimal netCgst = outputCgst.subtract(inputCgst);
        BigDecimal netSgst = outputSgst.subtract(inputSgst);
        BigDecimal netIgst = outputIgst.subtract(inputIgst);
        BigDecimal netTotalPayable = netCgst.add(netSgst).add(netIgst);

        return GstSummaryResponse.builder()
                .inputCgst(inputCgst)
                .inputSgst(inputSgst)
                .inputIgst(inputIgst)
                .totalInputTax(totalInputTax)
                .outputCgst(outputCgst)
                .outputSgst(outputSgst)
                .outputIgst(outputIgst)
                .totalOutputTax(totalOutputTax)
                .netCgstPayable(netCgst)
                .netSgstPayable(netSgst)
                .netIgstPayable(netIgst)
                .netTotalPayable(netTotalPayable)
                .build();
    }

    private BigDecimal getLedgerBalance(Company company, String ledgerName) {
        return ledgerRepository.findByCompanyAndName(company, ledgerName)
                .map(l -> l.getOpeningBalance() != null ? l.getOpeningBalance().abs() : BigDecimal.ZERO)
                .orElse(BigDecimal.ZERO);
    }
}
