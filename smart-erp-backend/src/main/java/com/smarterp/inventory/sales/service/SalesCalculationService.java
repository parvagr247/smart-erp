package com.smarterp.inventory.sales.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.purchase.domain.TaxCalculator;
import com.smarterp.inventory.sales.dto.SalesLineRequest;
import com.smarterp.inventory.sales.entity.Sales;
import com.smarterp.inventory.sales.entity.SalesLine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesCalculationService {

    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final TaxCalculator taxCalculator;

    public void calculateTaxesAndTotals(
            Sales sales, List<SalesLineRequest> requests, BigDecimal invoiceDiscount, Boolean isTaxInclusive, Company company) {

        BigDecimal totalGross = BigDecimal.ZERO;
        BigDecimal totalLineDiscounts = BigDecimal.ZERO;
        BigDecimal totalTaxAmount = BigDecimal.ZERO;
        BigDecimal totalCgst = BigDecimal.ZERO;
        BigDecimal totalSgst = BigDecimal.ZERO;
        BigDecimal totalIgst = BigDecimal.ZERO;
        BigDecimal totalCess = BigDecimal.ZERO;

        boolean isIntraState = determineIntraState(sales.getCustomer(), company);
        boolean inclusive = isTaxInclusive != null && isTaxInclusive;

        for (SalesLineRequest req : requests) {
            StockItem item = stockItemRepository.findById(req.getStockItemId())
                    .filter(i -> i.getCompany().getId().equals(company.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

            Warehouse lineWh = sales.getWarehouse();
            if (req.getWarehouseId() != null) {
                lineWh = warehouseRepository.findById(req.getWarehouseId())
                        .orElse(sales.getWarehouse());
            }

            BigDecimal qty = req.getQuantity();
            BigDecimal rate = req.getRate();
            BigDecimal lineDiscount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;

            TaxCalculator.TaxCalculationResult taxResult = taxCalculator.calculateTax(
                    item, qty, rate, lineDiscount, inclusive, isIntraState
            );

            BigDecimal lineTotal = taxResult.taxableAmount.add(taxResult.taxAmount).add(taxResult.cess);

            SalesLine line = SalesLine.builder()
                    .sales(sales)
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

            sales.getLineItems().add(line);

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

        sales.setGrossAmount(totalGross);
        sales.setDiscountAmount(totalLineDiscounts.add(invDisc));
        sales.setTaxAmount(totalTaxAmount);
        sales.setCgst(totalCgst);
        sales.setSgst(totalSgst);
        sales.setIgst(totalIgst);
        sales.setCess(totalCess);
        sales.setRoundOff(roundOff);
        sales.setGrandTotal(rounded);
    }

    public boolean determineIntraState(BusinessPartner customer, Company company) {
        String compState = company.getState() != null ? company.getState().trim().toLowerCase() : "";
        String custState = "";
        if (customer.getAddresses() != null && !customer.getAddresses().isEmpty()) {
            custState = customer.getAddresses().stream()
                    .filter(a -> "BILLING".equalsIgnoreCase(a.getAddressType()))
                    .findFirst()
                    .orElse(customer.getAddresses().get(0))
                    .getState();
        }
        if (custState == null) custState = "";
        custState = custState.trim().toLowerCase();

        return compState.isEmpty() || custState.isEmpty() || compState.equalsIgnoreCase(custState);
    }
}
