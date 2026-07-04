package com.smarterp.inventory.purchase.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.purchase.dto.PurchaseLineRequest;
import com.smarterp.inventory.purchase.dto.PurchaseLineResponse;
import com.smarterp.inventory.purchase.dto.PurchaseRequest;
import com.smarterp.inventory.purchase.dto.PurchaseResponse;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.entity.PurchaseLine;
import com.smarterp.inventory.purchase.entity.PurchaseStatus;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.purchase.service.PurchaseService;
import com.smarterp.inventory.purchase.domain.TaxCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PartnerRepository partnerRepository;
    private final StockItemRepository stockItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final TaxCalculator taxCalculator;
    private final ApplicationEventPublisher eventPublisher;
    private final com.smarterp.common.audit.AuditLogService auditLogService;

    @Override
    public PurchaseResponse createPurchase(PurchaseRequest request, Company company, String userEmail) {
        log.info("Creating purchase transaction for company {}", company.getId());
        validateRequest(request, company);

        BusinessPartner supplier = partnerRepository.findById(request.getSupplierId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found."));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        String purchaseNum = generatePurchaseNumber(company);

        Purchase purchase = Purchase.builder()
                .purchaseNumber(purchaseNum)
                .purchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now())
                .dueDate(request.getDueDate())
                .paymentTerms(request.getPaymentTerms())
                .supplier(supplier)
                .warehouse(warehouse)
                .company(company)
                .status(request.getStatus() != null ? request.getStatus() : PurchaseStatus.DRAFT)
                .createdBy(userEmail)
                .notes(request.getNotes())
                .attachments(request.getAttachments())
                .build();

        calculateTaxesAndTotals(purchase, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Purchase saved = purchaseRepository.save(purchase);

        auditLogService.saveLog(company.getId(), "Purchase", saved.getId(), "CREATED", 
                "Purchase Voucher created. Supplier: " + saved.getSupplier().getName() + " | Grand Total: " + saved.getGrandTotal());

        // Publish Lifecycle domain events if posted/approved immediately
        publishPurchaseLifecycleEvents(saved, company.getId(), userEmail, PurchaseStatus.DRAFT);

        return mapToResponse(saved);
    }

    @Override
    public PurchaseResponse updatePurchase(UUID id, PurchaseRequest request, Company company, String userEmail) {
        log.info("Updating purchase transaction {} for company {}", id, company.getId());
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));

        if (purchase.getStatus() == PurchaseStatus.APPROVED || purchase.getStatus() == PurchaseStatus.COMPLETED) {
            throw new BusinessValidationException("Approved or Completed purchase transactions cannot be modified.");
        }

        validateRequest(request, company);

        BusinessPartner supplier = partnerRepository.findById(request.getSupplierId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found."));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        purchase.setPurchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now());
        purchase.setDueDate(request.getDueDate());
        purchase.setPaymentTerms(request.getPaymentTerms());
        purchase.setSupplier(supplier);
        purchase.setWarehouse(warehouse);
        purchase.setNotes(request.getNotes());
        purchase.setAttachments(request.getAttachments());

        PurchaseStatus oldStatus = purchase.getStatus();
        PurchaseStatus newStatus = request.getStatus() != null ? request.getStatus() : PurchaseStatus.DRAFT;
        purchase.setStatus(newStatus);

        purchase.getLineItems().clear();
        calculateTaxesAndTotals(purchase, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Purchase saved = purchaseRepository.save(purchase);

        publishPurchaseLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseResponse getPurchaseById(UUID id, Company company) {
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));
        return mapToResponse(purchase);
    }

    @Override
    public PurchaseResponse updatePurchaseStatus(UUID id, PurchaseStatus status, Company company, String userEmail) {
        log.info("Updating status of purchase {} to {} in company {}", id, status, company.getId());
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));

        PurchaseStatus oldStatus = purchase.getStatus();
        if (oldStatus == status) {
            return mapToResponse(purchase);
        }

        if (!canTransition(oldStatus, status)) {
            throw new BusinessValidationException("Invalid status transition from " + oldStatus + " to " + status + ".");
        }

        purchase.setStatus(status);
        Purchase saved = purchaseRepository.save(purchase);

        publishPurchaseLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PurchaseResponse> searchPurchases(
            Pageable pageable,
            Company company,
            String search,
            PurchaseStatus status,
            UUID supplierId,
            UUID warehouseId,
            LocalDate fromDate,
            LocalDate toDate) {

        Specification<Purchase> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("company"), company));

            if (search != null && !search.trim().isEmpty()) {
                String clean = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("purchaseNumber")), clean),
                        cb.like(cb.lower(root.get("supplier").get("name")), clean),
                        cb.like(cb.lower(root.get("paymentTerms")), clean)
                ));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (supplierId != null) {
                predicates.add(cb.equal(root.get("supplier").get("id"), supplierId));
            }
            if (warehouseId != null) {
                predicates.add(cb.equal(root.get("warehouse").get("id"), warehouseId));
            }
            if (fromDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("purchaseDate"), fromDate));
            }
            if (toDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("purchaseDate"), toDate));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        Page<Purchase> page = purchaseRepository.findAll(spec, pageable);
        List<PurchaseResponse> dtoList = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, page.getTotalElements());
    }

    @Override
    public void deletePurchase(UUID id, Company company) {
        log.info("Deleting purchase {} for company {}", id, company.getId());
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));

        if (purchase.getStatus() == PurchaseStatus.APPROVED || purchase.getStatus() == PurchaseStatus.COMPLETED) {
            throw new BusinessValidationException("Cannot delete approved or completed purchase vouchers.");
        }

        purchaseRepository.delete(purchase);
    }

    private void validateRequest(PurchaseRequest request, Company company) {
        if (request.getSupplierId() == null) throw new BusinessValidationException("Supplier is required.");
        if (request.getWarehouseId() == null) throw new BusinessValidationException("Primary warehouse is required.");
        if (request.getLineItems() == null || request.getLineItems().isEmpty()) {
            throw new BusinessValidationException("Purchase voucher must contain at least one item line.");
        }

        for (PurchaseLineRequest line : request.getLineItems()) {
            if (line.getStockItemId() == null) throw new BusinessValidationException("Stock item ID is required on all lines.");
            if (line.getQuantity() == null || line.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Quantity must be greater than zero.");
            }
            if (line.getRate() == null || line.getRate().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Rate must be greater than zero.");
            }
        }
    }

    private String generatePurchaseNumber(Company company) {
        int currentYear = LocalDate.now().getYear();
        String prefix = "PUR-" + currentYear + "-%";
        String maxNum = purchaseRepository.findMaxPurchaseNumberByCompanyAndPrefix(company, prefix);

        int nextVal = 1;
        if (maxNum != null && maxNum.length() >= 17) {
            try {
                String seqStr = maxNum.substring(maxNum.length() - 6);
                nextVal = Integer.parseInt(seqStr) + 1;
            } catch (Exception e) {
                log.warn("Failed to parse sequential number from Max Purchase Number {}", maxNum);
            }
        }

        return String.format("PUR-%d-%06d", currentYear, nextVal);
    }

    private void calculateTaxesAndTotals(
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

            purchase.addLineItem(line);

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

    private boolean determineIntraState(BusinessPartner supplier, Company company) {
        String compState = company.getState() != null ? company.getState().trim().toLowerCase() : "";
        String suppState = "";
        if (supplier.getAddresses() != null && !supplier.getAddresses().isEmpty()) {
            suppState = supplier.getAddresses().stream()
                    .filter(a -> "BILLING".equalsIgnoreCase(a.getAddressType()))
                    .findFirst()
                    .orElse(supplier.getAddresses().get(0))
                    .getState();
        }
        if (suppState == null) suppState = "";
        suppState = suppState.trim().toLowerCase();

        return compState.isEmpty() || suppState.isEmpty() || compState.equalsIgnoreCase(suppState);
    }

    private void publishPurchaseLifecycleEvents(Purchase purchase, UUID companyId, String performedBy, PurchaseStatus oldStatus) {
        if (oldStatus == PurchaseStatus.DRAFT) {
            if (purchase.getStatus() == PurchaseStatus.APPROVED) {
                eventPublisher.publishEvent(new PurchaseApprovedEvent(this, purchase.getId(), companyId, performedBy));
            }
        }
    }

    private PurchaseResponse mapToResponse(Purchase purchase) {
        List<PurchaseLineResponse> lines = purchase.getLineItems().stream()
                .map(line -> PurchaseLineResponse.builder()
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

        return PurchaseResponse.builder()
                .id(purchase.getId())
                .purchaseNumber(purchase.getPurchaseNumber())
                .purchaseDate(purchase.getPurchaseDate())
                .dueDate(purchase.getDueDate())
                .paymentTerms(purchase.getPaymentTerms())
                .supplierId(purchase.getSupplier().getId())
                .supplierName(purchase.getSupplier().getName())
                .warehouseId(purchase.getWarehouse().getId())
                .warehouseName(purchase.getWarehouse().getName())
                .status(purchase.getStatus())
                .grossAmount(purchase.getGrossAmount())
                .discountAmount(purchase.getDiscountAmount())
                .taxAmount(purchase.getTaxAmount())
                .cgst(purchase.getCgst())
                .sgst(purchase.getSgst())
                .igst(purchase.getIgst())
                .cess(purchase.getCess())
                .roundOff(purchase.getRoundOff())
                .grandTotal(purchase.getGrandTotal())
                .notes(purchase.getNotes())
                .attachments(purchase.getAttachments())
                .createdBy(purchase.getCreatedBy())
                .lineItems(lines)
                .build();
    }
    private boolean canTransition(PurchaseStatus current, PurchaseStatus target) {
        if (current == target) return true;
        switch (current) {
            case DRAFT:
                return target == PurchaseStatus.APPROVED || target == PurchaseStatus.CANCELLED;
            case APPROVED:
                return target == PurchaseStatus.RECEIVED || target == PurchaseStatus.COMPLETED || target == PurchaseStatus.CANCELLED;
            case RECEIVED:
                return target == PurchaseStatus.COMPLETED || target == PurchaseStatus.CANCELLED;
            case COMPLETED:
            case CANCELLED:
                return false;
            default:
                return false;
        }
    }
}
