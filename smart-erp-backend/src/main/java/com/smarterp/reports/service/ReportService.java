package com.smarterp.reports.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.voucher.entity.Voucher;
import com.smarterp.accounting.voucher.entity.VoucherLine;
import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.entity.InventoryTransaction;
import com.smarterp.inventory.master.entity.InventoryTransactionType;
import com.smarterp.inventory.master.repository.InventoryTransactionRepository;
import com.smarterp.reports.dto.*;
import com.smarterp.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ReportService {

    private final LedgerRepository ledgerRepository;
    private final VoucherRepository voucherRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;

    public TrialBalanceResponse getTrialBalance(Company company) {
        log.info("Generating Trial Balance for company: {}", company.getId());
        List<Ledger> ledgers = ledgerRepository.findByCompany(company);

        List<TrialBalanceResponse.TrialBalanceRow> rows = new ArrayList<>();
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (Ledger l : ledgers) {
            BigDecimal bal = l.getOpeningBalance() != null ? l.getOpeningBalance() : BigDecimal.ZERO;
            BigDecimal debit = BigDecimal.ZERO;
            BigDecimal credit = BigDecimal.ZERO;

            if (l.getBalanceType() == BalanceType.DEBIT) {
                debit = bal;
                totalDebit = totalDebit.add(debit);
            } else {
                credit = bal;
                totalCredit = totalCredit.add(credit);
            }

            rows.add(TrialBalanceResponse.TrialBalanceRow.builder()
                    .ledgerId(l.getId())
                    .ledgerName(l.getName())
                    .groupName(l.getGroup() != null ? l.getGroup().getName() : "General")
                    .debitAmount(debit)
                    .creditAmount(credit)
                    .build());
        }

        return TrialBalanceResponse.builder()
                .rows(rows)
                .totalDebit(totalDebit)
                .totalCredit(totalCredit)
                .build();
    }

    public ProfitLossResponse getProfitLoss(Company company, LocalDate startDate, LocalDate endDate) {
        log.info("Generating Profit & Loss for company: {}", company.getId());
        List<Ledger> ledgers = ledgerRepository.findByCompany(company);

        List<ProfitLossResponse.ProfitLossRow> incomeRows = new ArrayList<>();
        List<ProfitLossResponse.ProfitLossRow> expenseRows = new ArrayList<>();
        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Ledger l : ledgers) {
            BigDecimal bal = l.getOpeningBalance() != null ? l.getOpeningBalance() : BigDecimal.ZERO;
            if (bal.compareTo(BigDecimal.ZERO) == 0) continue;

            GroupNature nature = l.getGroup() != null ? l.getGroup().getNature() : null;
            if (nature == GroupNature.INCOME) {
                incomeRows.add(new ProfitLossResponse.ProfitLossRow(l.getName(), bal));
                totalIncome = totalIncome.add(bal);
            } else if (nature == GroupNature.EXPENSE) {
                expenseRows.add(new ProfitLossResponse.ProfitLossRow(l.getName(), bal));
                totalExpense = totalExpense.add(bal);
            }
        }

        BigDecimal grossProfit = totalIncome; // Sales Revenue
        BigDecimal netProfit = totalIncome.subtract(totalExpense);

        return ProfitLossResponse.builder()
                .incomeRows(incomeRows)
                .expenseRows(expenseRows)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .grossProfit(grossProfit)
                .netProfit(netProfit)
                .build();
    }

    public BalanceSheetResponse getBalanceSheet(Company company, LocalDate date) {
        log.info("Generating Balance Sheet for company: {}", company.getId());
        List<Ledger> ledgers = ledgerRepository.findByCompany(company);

        List<BalanceSheetResponse.BalanceSheetRow> assetRows = new ArrayList<>();
        List<BalanceSheetResponse.BalanceSheetRow> liabilityRows = new ArrayList<>();
        BigDecimal totalAssets = BigDecimal.ZERO;
        BigDecimal totalLiabilities = BigDecimal.ZERO;

        for (Ledger l : ledgers) {
            BigDecimal bal = l.getOpeningBalance() != null ? l.getOpeningBalance() : BigDecimal.ZERO;
            if (bal.compareTo(BigDecimal.ZERO) == 0) continue;

            GroupNature nature = l.getGroup() != null ? l.getGroup().getNature() : null;
            if (nature == GroupNature.ASSET) {
                assetRows.add(new BalanceSheetResponse.BalanceSheetRow(l.getName(), bal));
                totalAssets = totalAssets.add(bal);
            } else if (nature == GroupNature.LIABILITY) {
                liabilityRows.add(new BalanceSheetResponse.BalanceSheetRow(l.getName(), bal));
                totalLiabilities = totalLiabilities.add(bal);
            }
        }

        // Fetch Net Profit as retained earnings addition to liabilities/equity
        ProfitLossResponse pnl = getProfitLoss(company, null, null);
        BigDecimal netProfit = pnl.getNetProfit();
        BigDecimal totalLiabilitiesAndEquity = totalLiabilities.add(netProfit);

        return BalanceSheetResponse.builder()
                .assetRows(assetRows)
                .liabilityRows(liabilityRows)
                .totalAssets(totalAssets)
                .totalLiabilities(totalLiabilities)
                .netProfit(netProfit)
                .totalLiabilitiesAndEquity(totalLiabilitiesAndEquity)
                .build();
    }

    public CashBankBookResponse getCashBankBook(Company company, UUID ledgerId, LocalDate startDate, LocalDate endDate) {
        log.info("Generating Cash/Bank Book for ledger: {}", ledgerId);
        Ledger targetLedger = ledgerRepository.findById(ledgerId)
                .filter(l -> l.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Ledger not found."));

        // Query all approved vouchers and scan their lines
        List<Voucher> vouchers = voucherRepository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("status"), VoucherStatus.APPROVED)
        ));

        List<CashBankBookResponse.BookLine> lines = new ArrayList<>();
        BigDecimal openingBalance = targetLedger.getOpeningBalance() != null ? targetLedger.getOpeningBalance() : BigDecimal.ZERO;
        BigDecimal closingBalance = openingBalance;

        for (Voucher v : vouchers) {
            if (startDate != null && v.getVoucherDate().isBefore(startDate)) continue;
            if (endDate != null && v.getVoucherDate().isAfter(endDate)) continue;

            VoucherLine targetLine = v.getLineItems().stream()
                    .filter(line -> line.getLedger().getId().equals(ledgerId))
                    .findFirst()
                    .orElse(null);

            if (targetLine != null) {
                // Find first opposite entry to display
                String oppositeLedger = v.getLineItems().stream()
                        .filter(line -> !line.getLedger().getId().equals(ledgerId))
                        .findFirst()
                        .map(line -> line.getLedger().getName())
                        .orElse("Suspense");

                BigDecimal debit = BigDecimal.ZERO;
                BigDecimal credit = BigDecimal.ZERO;

                if ("DEBIT".equalsIgnoreCase(targetLine.getEntryType())) {
                    debit = targetLine.getAmount();
                } else {
                    credit = targetLine.getAmount();
                }

                lines.add(CashBankBookResponse.BookLine.builder()
                        .transactionId(v.getId())
                        .transactionType("Voucher")
                        .voucherNumber(v.getVoucherNumber())
                        .date(v.getVoucherDate())
                        .oppositeLedgerName(oppositeLedger)
                        .debitAmount(debit)
                        .creditAmount(credit)
                        .narration(v.getNarration())
                        .build());
            }
        }

        return CashBankBookResponse.builder()
                .ledgerId(ledgerId)
                .ledgerName(targetLedger.getName())
                .openingBalance(openingBalance)
                .closingBalance(closingBalance)
                .lines(lines)
                .build();
    }

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

    public InventoryValuationResponse getInventoryValuation(Company company) {
        log.info("Generating Inventory Valuation for company: {}", company.getId());
        List<StockItem> items = stockItemRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company));

        List<InventoryValuationResponse.ValuationRow> rows = new ArrayList<>();
        BigDecimal totalValue = BigDecimal.ZERO;

        for (StockItem item : items) {
            BigDecimal qty = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
            BigDecimal cost = item.getAverageCost() != null ? item.getAverageCost() : BigDecimal.ZERO;
            BigDecimal val = qty.multiply(cost);

            rows.add(InventoryValuationResponse.ValuationRow.builder()
                    .itemId(item.getId())
                    .name(item.getName())
                    .sku(item.getSku())
                    .currentStock(qty)
                    .averageCost(cost)
                    .valuation(val)
                    .build());

            totalValue = totalValue.add(val);
        }

        return InventoryValuationResponse.builder()
                .rows(rows)
                .totalValue(totalValue)
                .build();
    }

    public StockRegisterResponse getStockRegister(Company company, LocalDate startDate, LocalDate endDate) {
        log.info("Generating Stock Register for company: {}", company.getId());
        List<StockItem> items = stockItemRepository.findAll((root, query, cb) -> cb.equal(root.get("company"), company));

        List<StockRegisterResponse.RegisterRow> rows = new ArrayList<>();

        for (StockItem item : items) {
            // Aggregate Inwards/Outwards from transaction history within dates
            List<InventoryTransaction> txs = inventoryTransactionRepository.findAllByCompanyAndStockItemIdOrderByTransactionDateDescCreatedAtDesc(company, item.getId());

            BigDecimal inward = BigDecimal.ZERO;
            BigDecimal outward = BigDecimal.ZERO;

            for (InventoryTransaction tx : txs) {
                if (startDate != null && tx.getTransactionDate().isBefore(startDate)) continue;
                if (endDate != null && tx.getTransactionDate().isAfter(endDate)) continue;

                BigDecimal qty = tx.getQuantity() != null ? tx.getQuantity() : BigDecimal.ZERO;
                if (qty.compareTo(BigDecimal.ZERO) > 0) {
                    inward = inward.add(qty);
                } else {
                    outward = outward.add(qty.abs());
                }
            }

            BigDecimal closing = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
            BigDecimal opening = closing.subtract(inward).add(outward);

            rows.add(StockRegisterResponse.RegisterRow.builder()
                    .itemId(item.getId())
                    .name(item.getName())
                    .sku(item.getSku())
                    .openingQuantity(opening)
                    .inwardQuantity(inward)
                    .outwardQuantity(outward)
                    .closingQuantity(closing)
                    .build());
        }

        return StockRegisterResponse.builder().rows(rows).build();
    }

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

    public DayBookResponse getDayBook(Company company, LocalDate date) {
        log.info("Generating Day Book for company: {} on date: {}", company.getId(), date);
        LocalDate targetDate = date != null ? date : LocalDate.now();

        List<Voucher> vouchers = voucherRepository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("status"), VoucherStatus.APPROVED),
                cb.equal(root.get("voucherDate"), targetDate)
        ));

        List<DayBookResponse.DayBookRow> rows = new ArrayList<>();
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (Voucher v : vouchers) {
            for (VoucherLine line : v.getLineItems()) {
                BigDecimal debit = BigDecimal.ZERO;
                BigDecimal credit = BigDecimal.ZERO;

                if ("DEBIT".equalsIgnoreCase(line.getEntryType())) {
                    debit = line.getAmount();
                    totalDebit = totalDebit.add(debit);
                } else {
                    credit = line.getAmount();
                    totalCredit = totalCredit.add(credit);
                }

                rows.add(DayBookResponse.DayBookRow.builder()
                        .voucherId(v.getId())
                        .voucherNumber(v.getVoucherNumber())
                        .voucherType(v.getVoucherType().name())
                        .date(v.getVoucherDate())
                        .ledgerName(line.getLedger().getName())
                        .debitAmount(debit)
                        .creditAmount(credit)
                        .narration(v.getNarration())
                        .build());
            }
        }

        return DayBookResponse.builder()
                .rows(rows)
                .totalDebit(totalDebit)
                .totalCredit(totalCredit)
                .build();
    }

    public CashFlowResponse getCashFlowStatement(Company company, LocalDate startDate, LocalDate endDate) {
        log.info("Generating Cash Flow Statement for company: {}", company.getId());

        List<Ledger> cashBankLedgers = ledgerRepository.findByCompany(company).stream()
                .filter(l -> l.getGroup() != null && 
                        ("Bank Accounts".equalsIgnoreCase(l.getGroup().getName()) || 
                         "Cash-in-hand".equalsIgnoreCase(l.getGroup().getName())))
                .collect(Collectors.toList());

        List<UUID> cashLedgerIds = cashBankLedgers.stream().map(Ledger::getId).collect(Collectors.toList());

        BigDecimal openingCash = BigDecimal.ZERO;
        for (Ledger l : cashBankLedgers) {
            openingCash = openingCash.add(l.getOpeningBalance() != null ? l.getOpeningBalance() : BigDecimal.ZERO);
        }

        List<Voucher> vouchers = voucherRepository.findAll((root, query, cb) -> cb.and(
                cb.equal(root.get("company"), company),
                cb.equal(root.get("status"), VoucherStatus.APPROVED)
        ));

        List<CashFlowResponse.CashFlowRow> operating = new ArrayList<>();
        List<CashFlowResponse.CashFlowRow> investing = new ArrayList<>();
        List<CashFlowResponse.CashFlowRow> financing = new ArrayList<>();

        BigDecimal totalOperating = BigDecimal.ZERO;
        BigDecimal totalInvesting = BigDecimal.ZERO;
        BigDecimal totalFinancing = BigDecimal.ZERO;

        for (Voucher v : vouchers) {
            if (startDate != null && v.getVoucherDate().isBefore(startDate)) continue;
            if (endDate != null && v.getVoucherDate().isAfter(endDate)) continue;

            List<VoucherLine> cashLines = v.getLineItems().stream()
                    .filter(line -> cashLedgerIds.contains(line.getLedger().getId()))
                    .collect(Collectors.toList());

            if (cashLines.isEmpty()) continue;

            List<VoucherLine> nonCashLines = v.getLineItems().stream()
                    .filter(line -> !cashLedgerIds.contains(line.getLedger().getId()))
                    .collect(Collectors.toList());

            for (VoucherLine cashLine : cashLines) {
                boolean isReceipt = "DEBIT".equalsIgnoreCase(cashLine.getEntryType());
                BigDecimal amount = cashLine.getAmount();
                if (!isReceipt) {
                    amount = amount.negate();
                }

                if (!nonCashLines.isEmpty()) {
                    VoucherLine opposite = nonCashLines.get(0);
                    GroupNature nature = opposite.getLedger().getGroup() != null ? opposite.getLedger().getGroup().getNature() : GroupNature.ASSET;
                    String oppGroupName = opposite.getLedger().getGroup() != null ? opposite.getLedger().getGroup().getName() : "";
                    String name = opposite.getLedger().getName();

                    if (nature == GroupNature.INCOME || nature == GroupNature.EXPENSE || "Current Assets".equalsIgnoreCase(oppGroupName) || "Current Liabilities".equalsIgnoreCase(oppGroupName)) {
                        operating.add(new CashFlowResponse.CashFlowRow("Operating: " + name, amount));
                        totalOperating = totalOperating.add(amount);
                    } else if (nature == GroupNature.ASSET) {
                        investing.add(new CashFlowResponse.CashFlowRow("Investing: " + name, amount));
                        totalInvesting = totalInvesting.add(amount);
                    } else {
                        financing.add(new CashFlowResponse.CashFlowRow("Financing: " + name, amount));
                        totalFinancing = totalFinancing.add(amount);
                    }
                }
            }
        }

        BigDecimal netIncrease = totalOperating.add(totalInvesting).add(totalFinancing);
        BigDecimal closingCash = openingCash.add(netIncrease);

        return CashFlowResponse.builder()
                .operatingRows(operating)
                .investingRows(investing)
                .financingRows(financing)
                .totalOperating(totalOperating)
                .totalInvesting(totalInvesting)
                .totalFinancing(totalFinancing)
                .netIncrease(netIncrease)
                .openingCash(openingCash)
                .closingCash(closingCash)
                .build();
    }
}
