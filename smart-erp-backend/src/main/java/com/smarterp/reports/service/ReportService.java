package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.reports.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReportService {

    private final FinancialReportService financialReportService;
    private final InventoryReportService inventoryReportService;
    private final TaxReportService taxReportService;
    private final OutstandingReportService outstandingReportService;

    public TrialBalanceResponse getTrialBalance(Company company) {
        return financialReportService.getTrialBalance(company);
    }

    public ProfitLossResponse getProfitLoss(Company company, LocalDate startDate, LocalDate endDate) {
        return financialReportService.getProfitLoss(company, startDate, endDate);
    }

    public BalanceSheetResponse getBalanceSheet(Company company, LocalDate date) {
        return financialReportService.getBalanceSheet(company, date);
    }

    public CashBankBookResponse getCashBankBook(Company company, UUID ledgerId, LocalDate startDate, LocalDate endDate) {
        return financialReportService.getCashBankBook(company, ledgerId, startDate, endDate);
    }

    public OutstandingResponse getOutstanding(Company company, String partnerType) {
        return outstandingReportService.getOutstanding(company, partnerType);
    }

    public InventoryValuationResponse getInventoryValuation(Company company) {
        return inventoryReportService.getInventoryValuation(company);
    }

    public StockRegisterResponse getStockRegister(Company company, LocalDate startDate, LocalDate endDate) {
        return inventoryReportService.getStockRegister(company, startDate, endDate);
    }

    public GstSummaryResponse getGstSummary(Company company, LocalDate startDate, LocalDate endDate) {
        return taxReportService.getGstSummary(company, startDate, endDate);
    }

    public DayBookResponse getDayBook(Company company, LocalDate date) {
        return financialReportService.getDayBook(company, date);
    }

    public CashFlowResponse getCashFlowStatement(Company company, LocalDate startDate, LocalDate endDate) {
        return financialReportService.getCashFlowStatement(company, startDate, endDate);
    }
}
