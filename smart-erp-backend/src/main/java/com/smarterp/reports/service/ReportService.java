package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.reports.dto.*;
import java.time.LocalDate;
import java.util.UUID;

public interface ReportService {
    TrialBalanceResponse getTrialBalance(Company company);
    ProfitLossResponse getProfitLoss(Company company, LocalDate startDate, LocalDate endDate);
    BalanceSheetResponse getBalanceSheet(Company company, LocalDate date);
    CashBankBookResponse getCashBankBook(Company company, UUID ledgerId, LocalDate startDate, LocalDate endDate);
    OutstandingResponse getOutstanding(Company company, String partnerType);
    InventoryValuationResponse getInventoryValuation(Company company);
    StockRegisterResponse getStockRegister(Company company, LocalDate startDate, LocalDate endDate);
    GstSummaryResponse getGstSummary(Company company, LocalDate startDate, LocalDate endDate);
}
