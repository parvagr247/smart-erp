package com.smarterp.inventory.purchase.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.purchase.domain.TaxCalculator;
import com.smarterp.inventory.purchase.dto.PurchaseLineRequest;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.entity.PurchaseLine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseCalculationService {

    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final TaxCalculator taxCalculator;

    public void calculateTaxesAndTotals(
            Purchase purchase,
            List<PurchaseLineRequest> requests,
            BigDecimal invoiceDiscount,
            Boolean isTaxInclusive,
            Company company) {

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalLineDiscounts = BigDecimal.ZERO;
        BigDecimal totalTaxAmount = BigDecimal.ZERO;
        BigDecimal totalCgst = BigDecimal.ZERO;
        BigDecimal totalSgst = BigDecimal.ZERO;
        BigDecimal totalIgst = BigDecimal.ZERO;
        BigDecimal totalCess = BigDecimal.ZERO;

        boolean isIntraState = determineIntraState(purchase.getSupplier(), company);
        boolean inclusive = isTaxInclusive != null && isTaxInclusive;

        for (PurchaseLineRequest req : requests) {
            StockItem item = stockItemRepository.findById(req.getStockItemId())
                    .filter(i -> i.getCompany().getId().equals(company.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

            Warehouse lineWh = purchase.getWarehouse();
            if (req.getWarehouseId() != null) {
                lineWh = warehouseRepository.findById(req.getWarehouseId())
                        .orElse(purchase.getWarehouse());
            }

            BigDecimal qty = req.getQuantity();
            BigDecimal rate = req.getRate();
            BigDecimal lineDiscount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;

            TaxCalculator.TaxCalculationResult taxResult = taxCalculator.calculateTax(
                    item, qty, rate, lineDiscount, inclusive, isIntraState
            );

            BigDecimal lineTotal = taxResult.taxableAmount.add(taxResult.taxAmount).add(taxResult.cess);

            PurchaseLine line = PurchaseLine.builder()
                    .purchase(purchase)
                    .stockItem(item)
                    .quantity(qty)
                    .rate(rate)
                    .discount(lineDiscount)
                    .taxPercentage(item.getTaxCategory() != null ? item.getTaxCategory().getGstRate() : BigDecimal.ZERO)
                    .taxAmount(taxResult.taxAmount)
                    .totalAmount(lineTotal)
                    .warehouse(lineWh)
                    .batchNumber(req.getBatchNumber())
                    .build();

            purchase.getLineItems().add(line);

            totalGross = totalGross.add(qty.multiply(rate));
            totalLineDiscounts = totalLineDiscounts.add(lineDiscount);
            totalTaxAmount = totalTaxAmount.add(taxResult.taxAmount);
            totalCgst = totalCgst.add(taxResult.cgst);
            totalSgst = totalSgst.add(taxResult.sgst);
            totalIgst = totalIgst.add(taxResult.igst);
            totalCess = totalCess.add(taxResult.cess);
        }

        BigDecimal netTotal = totalGross.subtract(totalLineDiscounts).add(totalTaxAmount).add(totalCess);
        BigDecimal invDisc = invoiceDiscount != null ? invoiceDiscount : BigDecimal.ZERO;
        netTotal = netTotal.subtract(invDisc);

        BigDecimal rounded = netTotal.setScale(0, RoundingMode.HALF_UP);
        BigDecimal roundOff = rounded.subtract(netTotal);

        purchase.setGrossAmount(totalGross);
        purchase.setDiscountAmount(totalLineDiscounts.add(invDisc));
        purchase.setTaxAmount(totalTaxAmount);
        purchase.setCgst(totalCgst);
        purchase.setSgst(totalSgst);
        purchase.setIgst(totalIgst);
        purchase.setCess(totalCess);
        purchase.setRoundOff(roundOff);
        purchase.setGrandTotal(rounded);
    }

    public boolean determineIntraState(BusinessPartner partner, Company company) {
        String compState = company.getState() != null ? company.getState().trim().toLowerCase() : "";
        String partnerState = "";
        if (partner.getAddresses() != null && !partner.getAddresses().isEmpty()) {
            partnerState = partner.getAddresses().stream()
                    .filter(a -> "BILLING".equalsIgnoreCase(a.getAddressType()))
                    .findFirst()
                    .orElse(partner.getAddresses().get(0))
                    .getState();
        }
        if (partnerState == null) partnerState = "";
        partnerState = partnerState.trim().toLowerCase();

        return compState.isEmpty() || partnerState.isEmpty() || compState.equalsIgnoreCase(partnerState);
    }
}
