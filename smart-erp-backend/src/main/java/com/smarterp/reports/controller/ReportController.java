package com.smarterp.reports.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.reports.dto.*;
import com.smarterp.reports.service.KpiService;
import com.smarterp.reports.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasAuthority('Accounting.ViewReports')")
public class ReportController {

    private final ReportService service;
    private final KpiService kpiService;
    private final CompanyRepository companyRepository;

    @GetMapping("/kpis")
    public ResponseEntity<ApiResponse<KpiResponse>> getKpis(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        KpiResponse response = kpiService.calculateKpis(company);
        return ResponseEntity.ok(ApiResponse.<KpiResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/trial-balance")
    public ResponseEntity<ApiResponse<TrialBalanceResponse>> getTrialBalance(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        TrialBalanceResponse response = service.getTrialBalance(company);
        return ResponseEntity.ok(ApiResponse.<TrialBalanceResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/profit-loss")
    public ResponseEntity<ApiResponse<ProfitLossResponse>> getProfitLoss(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Company company = getCompany(companyId);
        ProfitLossResponse response = service.getProfitLoss(company, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.<ProfitLossResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/balance-sheet")
    public ResponseEntity<ApiResponse<BalanceSheetResponse>> getBalanceSheet(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Company company = getCompany(companyId);
        BalanceSheetResponse response = service.getBalanceSheet(company, date);
        return ResponseEntity.ok(ApiResponse.<BalanceSheetResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/cash-bank-book")
    public ResponseEntity<ApiResponse<CashBankBookResponse>> getCashBankBook(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam UUID ledgerId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Company company = getCompany(companyId);
        CashBankBookResponse response = service.getCashBankBook(company, ledgerId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.<CashBankBookResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/outstanding")
    public ResponseEntity<ApiResponse<OutstandingResponse>> getOutstanding(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam String partnerType) {
        Company company = getCompany(companyId);
        OutstandingResponse response = service.getOutstanding(company, partnerType);
        return ResponseEntity.ok(ApiResponse.<OutstandingResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/inventory-valuation")
    public ResponseEntity<ApiResponse<InventoryValuationResponse>> getInventoryValuation(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        InventoryValuationResponse response = service.getInventoryValuation(company);
        return ResponseEntity.ok(ApiResponse.<InventoryValuationResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/stock-register")
    public ResponseEntity<ApiResponse<StockRegisterResponse>> getStockRegister(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Company company = getCompany(companyId);
        StockRegisterResponse response = service.getStockRegister(company, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.<StockRegisterResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/gst-summary")
    public ResponseEntity<ApiResponse<GstSummaryResponse>> getGstSummary(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Company company = getCompany(companyId);
        GstSummaryResponse response = service.getGstSummary(company, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.<GstSummaryResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/day-book")
    public ResponseEntity<ApiResponse<DayBookResponse>> getDayBook(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Company company = getCompany(companyId);
        DayBookResponse response = service.getDayBook(company, date);
        return ResponseEntity.ok(ApiResponse.<DayBookResponse>builder().success(true).data(response).build());
    }

    @GetMapping("/cash-flow")
    public ResponseEntity<ApiResponse<CashFlowResponse>> getCashFlow(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Company company = getCompany(companyId);
        CashFlowResponse response = service.getCashFlowStatement(company, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.<CashFlowResponse>builder().success(true).data(response).build());
    }

    // --- CSV exports ---
    @GetMapping("/trial-balance/csv")
    public ResponseEntity<String> exportTrialBalanceCsv(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        TrialBalanceResponse data = service.getTrialBalance(company);
        StringBuilder csv = new StringBuilder("Ledger Name,Group Name,Debit Amount,Credit Amount\n");
        for (var row : data.getRows()) {
            csv.append(String.format("\"%s\",\"%s\",%s,%s\n", 
                    row.getLedgerName(), row.getGroupName(), row.getDebitAmount(), row.getCreditAmount()));
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=trial_balance.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }

    @GetMapping("/profit-loss/csv")
    public ResponseEntity<String> exportProfitLossCsv(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        ProfitLossResponse data = service.getProfitLoss(company, null, null);
        StringBuilder csv = new StringBuilder("Account Name,Type,Amount\n");
        for (var row : data.getIncomeRows()) {
            csv.append(String.format("\"%s\",\"Income\",%s\n", row.getName(), row.getAmount()));
        }
        for (var row : data.getExpenseRows()) {
            csv.append(String.format("\"%s\",\"Expense\",%s\n", row.getName(), row.getAmount()));
        }
        csv.append(String.format("\"Gross Profit\",\"GP Summary\",%s\n", data.getGrossProfit()));
        csv.append(String.format("\"Net Profit\",\"NP Summary\",%s\n", data.getNetProfit()));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=profit_loss.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }

    @GetMapping("/balance-sheet/csv")
    public ResponseEntity<String> exportBalanceSheetCsv(@RequestHeader("X-Company-ID") UUID companyId) {
        Company company = getCompany(companyId);
        BalanceSheetResponse data = service.getBalanceSheet(company, null);
        StringBuilder csv = new StringBuilder("Account Name,Category,Amount\n");
        for (var row : data.getAssetRows()) {
            csv.append(String.format("\"%s\",\"Asset\",%s\n", row.getName(), row.getAmount()));
        }
        for (var row : data.getLiabilityRows()) {
            csv.append(String.format("\"%s\",\"Liability\",%s\n", row.getName(), row.getAmount()));
        }
        csv.append(String.format("\"Net Profit (Retained Earnings)\",\"Equity\",%s\n", data.getNetProfit()));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=balance_sheet.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }

    @GetMapping("/day-book/csv")
    public ResponseEntity<String> exportDayBookCsv(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Company company = getCompany(companyId);
        DayBookResponse data = service.getDayBook(company, date);
        StringBuilder csv = new StringBuilder("Voucher No,Voucher Type,Date,Ledger Name,Debit,Credit,Narration\n");
        for (var row : data.getRows()) {
            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",%s,%s,\"%s\"\n", 
                    row.getVoucherNumber(), row.getVoucherType(), row.getDate(), row.getLedgerName(), 
                    row.getDebitAmount(), row.getCreditAmount(), row.getNarration() != null ? row.getNarration() : ""));
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=day_book.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }

    @GetMapping("/cash-flow/csv")
    public ResponseEntity<String> exportCashFlowCsv(
            @RequestHeader("X-Company-ID") UUID companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Company company = getCompany(companyId);
        CashFlowResponse data = service.getCashFlowStatement(company, startDate, endDate);
        StringBuilder csv = new StringBuilder("Activity Name,Amount\n");
        for (var row : data.getOperatingRows()) {
            csv.append(String.format("\"%s\",%s\n", row.getName(), row.getAmount()));
        }
        for (var row : data.getInvestingRows()) {
            csv.append(String.format("\"%s\",%s\n", row.getName(), row.getAmount()));
        }
        for (var row : data.getFinancingRows()) {
            csv.append(String.format("\"%s\",%s\n", row.getName(), row.getAmount()));
        }
        csv.append(String.format("\"Net Cash Flow Change\",\"%s\"\n", data.getNetIncrease()));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=cash_flow.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.toString());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
