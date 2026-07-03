package com.smarterp.inventory.sales.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.sales.dto.SalesLineRequest;
import com.smarterp.inventory.sales.dto.SalesLineResponse;
import com.smarterp.inventory.sales.dto.SalesRequest;
import com.smarterp.inventory.sales.dto.SalesResponse;
import com.smarterp.inventory.sales.entity.Sales;
import com.smarterp.inventory.sales.entity.SalesLine;
import com.smarterp.inventory.sales.entity.SalesStatus;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import com.smarterp.inventory.sales.event.SalesCompletedEvent;
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.inventory.sales.service.SalesService;
import com.smarterp.inventory.purchase.strategy.TaxCalculationStrategy;
import com.smarterp.inventory.master.service.InventoryTransactionService;
import com.smarterp.inventory.master.dto.InventoryTransactionRequest;
import com.smarterp.inventory.master.entity.InventoryTransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SalesServiceImpl implements SalesService {

    private final SalesRepository salesRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final TaxCalculationStrategy taxCalculationStrategy;
    private final InventoryTransactionService inventoryTransactionService;
    private final ApplicationEventPublisher eventPublisher;
    private final com.smarterp.common.workflow.WorkflowEngine workflowEngine;

    @Override
    public SalesResponse createSales(SalesRequest request, Company company, String userEmail) {
        log.info("Creating sales transaction for company {}", company.getId());
        validateRequest(request, company);

        BusinessPartner customer = partnerRepository.findById(request.getCustomerId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        // If status is APPROVED/COMPLETED, check stock availability
        SalesStatus initialStatus = request.getStatus() != null ? request.getStatus() : SalesStatus.DRAFT;
        if (initialStatus == SalesStatus.APPROVED || initialStatus == SalesStatus.COMPLETED) {
            checkStockAvailability(request.getLineItems(), company.getId());
        }

        String salesNum = generateSalesNumber(company);

        Sales sales = Sales.builder()
                .salesNumber(salesNum)
                .salesDate(request.getSalesDate() != null ? request.getSalesDate() : LocalDate.now())
                .dueDate(request.getDueDate())
                .paymentTerms(request.getPaymentTerms())
                .customer(customer)
                .warehouse(warehouse)
                .company(company)
                .status(initialStatus)
                .createdBy(userEmail)
                .notes(request.getNotes())
                .attachments(request.getAttachments())
                .build();

        calculateTaxesAndTotals(sales, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Sales saved = salesRepository.save(sales);

        // If approved/completed, trigger stock reductions via inventory transaction service
        if (saved.getStatus() == SalesStatus.APPROVED || saved.getStatus() == SalesStatus.COMPLETED) {
            reduceInventory(saved, userEmail);
        }

        publishSalesLifecycleEvents(saved, company.getId(), userEmail, SalesStatus.DRAFT);

        return mapToResponse(saved);
    }

    @Override
    public SalesResponse updateSales(UUID id, SalesRequest request, Company company, String userEmail) {
        log.info("Updating sales transaction {} for company {}", id, company.getId());
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));

        if (sales.getStatus() == SalesStatus.APPROVED || sales.getStatus() == SalesStatus.COMPLETED) {
            throw new BusinessValidationException("Approved or Completed sales transactions cannot be modified.");
        }

        validateRequest(request, company);

        BusinessPartner customer = partnerRepository.findById(request.getCustomerId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        SalesStatus oldStatus = sales.getStatus();
        SalesStatus newStatus = request.getStatus() != null ? request.getStatus() : SalesStatus.DRAFT;

        if (newStatus == SalesStatus.APPROVED || newStatus == SalesStatus.COMPLETED) {
            checkStockAvailability(request.getLineItems(), company.getId());
        }

        sales.setSalesDate(request.getSalesDate() != null ? request.getSalesDate() : LocalDate.now());
        sales.setDueDate(request.getDueDate());
        sales.setPaymentTerms(request.getPaymentTerms());
        sales.setCustomer(customer);
        sales.setWarehouse(warehouse);
        sales.setNotes(request.getNotes());
        sales.setAttachments(request.getAttachments());
        sales.setStatus(newStatus);

        sales.getLineItems().clear();
        calculateTaxesAndTotals(sales, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Sales saved = salesRepository.save(sales);

        if (saved.getStatus() == SalesStatus.APPROVED || saved.getStatus() == SalesStatus.COMPLETED) {
            reduceInventory(saved, userEmail);
        }

        publishSalesLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SalesResponse getSalesById(UUID id, Company company) {
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));
        return mapToResponse(sales);
    }

    @Override
    public SalesResponse updateSalesStatus(UUID id, SalesStatus status, Company company, String userEmail) {
        log.info("Updating status of sales invoice {} to {} in company {}", id, status, company.getId());
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));

        SalesStatus oldStatus = sales.getStatus();
        if (oldStatus == status) {
            return mapToResponse(sales);
        }

        if (!workflowEngine.canTransition(oldStatus.name(), status.name())) {
            throw new BusinessValidationException("Invalid status transition from " + oldStatus + " to " + status + ".");
        }

        if (status == SalesStatus.APPROVED || status == SalesStatus.COMPLETED) {
            // Check stock of existing saved lines
            List<SalesLineRequest> lines = sales.getLineItems().stream()
                    .map(l -> SalesLineRequest.builder()
                            .stockItemId(l.getStockItem().getId())
                            .quantity(l.getQuantity())
                            .build())
                    .collect(Collectors.toList());
            checkStockAvailability(lines, company.getId());
        }

        sales.setStatus(status);
        Sales saved = salesRepository.save(sales);

        if (saved.getStatus() == SalesStatus.APPROVED || saved.getStatus() == SalesStatus.COMPLETED) {
            reduceInventory(saved, userEmail);
        }

        publishSalesLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalesResponse> searchAndFilterSales(
            Company company, String search, SalesStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<Sales> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("company"), company));

            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("salesNumber")), term),
                        cb.like(cb.lower(root.get("customer").get("name")), term)
                ));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("salesDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("salesDate"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return salesRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Override
    public void deleteSales(UUID id, Company company) {
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));

        if (sales.getStatus() == SalesStatus.APPROVED || sales.getStatus() == SalesStatus.COMPLETED) {
            throw new BusinessValidationException("Cannot delete approved or completed sales invoices.");
        }

        salesRepository.delete(sales);
    }

    private void checkStockAvailability(List<SalesLineRequest> lines, UUID companyId) {
        for (SalesLineRequest line : lines) {
            StockItem item = stockItemRepository.findById(line.getStockItemId())
                    .filter(i -> i.getCompany().getId().equals(companyId))
                    .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

            BigDecimal available = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
            if (available.compareTo(line.getQuantity()) < 0) {
                throw new BusinessValidationException("Insufficient stock for item: " + item.getName() + 
                        ". Available: " + available + ", Required: " + line.getQuantity());
            }
        }
    }

    private void reduceInventory(Sales sales, String performedBy) {
        for (SalesLine line : sales.getLineItems()) {
            InventoryTransactionRequest req = InventoryTransactionRequest.builder()
                    .stockItemId(line.getStockItem().getId())
                    .warehouseId(line.getWarehouse() != null ? line.getWarehouse().getId() : sales.getWarehouse().getId())
                    .transactionType(InventoryTransactionType.GOODS_ISSUE)
                    .quantity(line.getQuantity())
                    .rate(line.getRate())
                    .referenceNumber(sales.getSalesNumber())
                    .transactionDate(sales.getSalesDate())
                    .notes("Sales dispatch invoice: " + sales.getSalesNumber())
                    .build();

            inventoryTransactionService.recordTransaction(req, sales.getCompany(), performedBy);
        }
    }

    private String generateSalesNumber(Company company) {
        int currentYear = LocalDate.now().getYear();
        String prefix = "SAL-" + currentYear + "-%";
        String maxNum = salesRepository.findMaxSalesNumberByCompanyAndPrefix(company, prefix);

        int nextVal = 1;
        if (maxNum != null && maxNum.length() >= 17) {
            try {
                String seqStr = maxNum.substring(maxNum.length() - 6);
                nextVal = Integer.parseInt(seqStr) + 1;
            } catch (Exception e) {
                log.warn("Failed to parse sequential number from Max Sales Number {}", maxNum);
            }
        }

        return String.format("SAL-%d-%06d", currentYear, nextVal);
    }

    private void calculateTaxesAndTotals(
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

            TaxCalculationStrategy.TaxCalculationResult taxResult = taxCalculationStrategy.calculateTax(
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

    private boolean determineIntraState(BusinessPartner customer, Company company) {
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

    private void publishSalesLifecycleEvents(Sales sales, UUID companyId, String performedBy, SalesStatus oldStatus) {
        if (oldStatus == SalesStatus.DRAFT) {
            if (sales.getStatus() == SalesStatus.APPROVED) {
                eventPublisher.publishEvent(new SalesApprovedEvent(this, sales.getId(), companyId, performedBy));
            } else if (sales.getStatus() == SalesStatus.COMPLETED) {
                eventPublisher.publishEvent(new SalesCompletedEvent(this, sales.getId(), companyId, performedBy));
            }
        }
    }

    private void validateRequest(SalesRequest request, Company company) {
        if (request.getLineItems() == null || request.getLineItems().isEmpty()) {
            throw new BusinessValidationException("Sales invoice must contain at least one line item.");
        }
        for (SalesLineRequest line : request.getLineItems()) {
            if (line.getStockItemId() == null) throw new BusinessValidationException("Stock item ID is required on all lines.");
            if (line.getQuantity() == null || line.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Quantity must be greater than zero.");
            }
            if (line.getRate() == null || line.getRate().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Rate must be greater than zero.");
            }
        }
    }

    private SalesResponse mapToResponse(Sales s) {
        List<SalesLineResponse> lines = s.getLineItems().stream()
                .map(line -> SalesLineResponse.builder()
                        .id(line.getId())
                        .stockItemId(line.getStockItem().getId())
                        .stockItemName(line.getStockItem().getName())
                        .sku(line.getStockItem().getSku())
                        .quantity(line.getQuantity())
                        .rate(line.getRate())
                        .discount(line.getDiscount())
                        .taxPercentage(line.getTaxPercentage())
                        .taxAmount(line.getTaxAmount())
                        .totalAmount(line.getTotalAmount())
                        .warehouseId(line.getWarehouse() != null ? line.getWarehouse().getId() : null)
                        .warehouseName(line.getWarehouse() != null ? line.getWarehouse().getName() : "")
                        .batchNumber(line.getBatchNumber())
                        .build())
                .collect(Collectors.toList());

        return SalesResponse.builder()
                .id(s.getId())
                .salesNumber(s.getSalesNumber())
                .salesDate(s.getSalesDate())
                .dueDate(s.getDueDate())
                .paymentTerms(s.getPaymentTerms())
                .customerId(s.getCustomer().getId())
                .customerName(s.getCustomer().getName())
                .warehouseId(s.getWarehouse().getId())
                .warehouseName(s.getWarehouse().getName())
                .status(s.getStatus())
                .grossAmount(s.getGrossAmount())
                .discountAmount(s.getDiscountAmount())
                .taxAmount(s.getTaxAmount())
                .cgst(s.getCgst())
                .sgst(s.getSgst())
                .igst(s.getIgst())
                .cess(s.getCess())
                .roundOff(s.getRoundOff())
                .grandTotal(s.getGrandTotal())
                .notes(s.getNotes())
                .attachments(s.getAttachments())
                .createdBy(s.getCreatedBy())
                .lineItems(lines)
                .createdAt(s.getCreatedAt())
                .build();
    }
}
