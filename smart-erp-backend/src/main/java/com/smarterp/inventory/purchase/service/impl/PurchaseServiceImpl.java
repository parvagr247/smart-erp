package com.smarterp.inventory.purchase.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.group.entity.GroupNature;
import com.smarterp.accounting.group.repository.AccountGroupRepository;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import com.smarterp.inventory.master.entity.ActivityTimeline;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.master.repository.WarehouseRepository;
import com.smarterp.inventory.master.repository.ActivityTimelineRepository;
import com.smarterp.inventory.purchase.dto.PurchaseLineRequest;
import com.smarterp.inventory.purchase.dto.PurchaseLineResponse;
import com.smarterp.inventory.purchase.dto.PurchaseRequest;
import com.smarterp.inventory.purchase.dto.PurchaseResponse;
import com.smarterp.inventory.purchase.entity.Purchase;
import com.smarterp.inventory.purchase.entity.PurchaseLine;
import com.smarterp.inventory.purchase.entity.PurchaseStatus;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.purchase.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final LedgerRepository ledgerRepository;
    private final AccountGroupRepository groupRepository;
    private final ActivityTimelineRepository timelineRepository;

    @Override
    public PurchaseResponse createPurchase(PurchaseRequest request, Company company, String userEmail) {
        log.info("Creating purchase for company {}", company.getId());
        validateRequest(request, company);

        // Fetch supplier
        BusinessPartner supplier = partnerRepository.findById(request.getSupplierId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found."));

        // Fetch main warehouse
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        // Generate unique purchase sequential number
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

        // Process line items and compute GST/Discounts
        calculateTaxesAndTotals(purchase, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Purchase saved = purchaseRepository.save(purchase);

        // Apply postings if approved immediately
        if (saved.getStatus() == PurchaseStatus.APPROVED || saved.getStatus() == PurchaseStatus.COMPLETED) {
            applyInventoryAndAccountingPostings(saved, company, userEmail);
        }

        logTimelineActivity(company, saved.getId(), "PURCHASE", "CREATED", 
                "Gross Amount: " + saved.getGrossAmount() + " | Supplier: " + supplier.getName(), userEmail);

        return mapToResponse(saved);
    }

    @Override
    public PurchaseResponse updatePurchase(UUID id, PurchaseRequest request, Company company, String userEmail) {
        log.info("Updating purchase {} for company {}", id, company.getId());
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));

        if (purchase.getStatus() == PurchaseStatus.APPROVED || purchase.getStatus() == PurchaseStatus.COMPLETED) {
            throw new BusinessValidationException("Approved or Completed purchase transactions cannot be modified.");
        }

        validateRequest(request, company);

        // Fetch supplier
        BusinessPartner supplier = partnerRepository.findById(request.getSupplierId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found."));

        // Fetch warehouse
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

        // Re-process line items and totals
        purchase.getLineItems().clear();
        calculateTaxesAndTotals(purchase, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Purchase saved = purchaseRepository.save(purchase);

        // Apply postings if transitioned from Draft to Approved/Completed
        if (oldStatus == PurchaseStatus.DRAFT && (newStatus == PurchaseStatus.APPROVED || newStatus == PurchaseStatus.COMPLETED)) {
            applyInventoryAndAccountingPostings(saved, company, userEmail);
        }

        logTimelineActivity(company, saved.getId(), "PURCHASE", "UPDATED", 
                "Status transitioned to " + newStatus, userEmail);

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

        if (oldStatus == PurchaseStatus.APPROVED || oldStatus == PurchaseStatus.COMPLETED || oldStatus == PurchaseStatus.CANCELLED) {
            throw new BusinessValidationException("Status of approved, completed, or cancelled purchase cannot be altered.");
        }

        purchase.setStatus(status);
        Purchase saved = purchaseRepository.save(purchase);

        if (oldStatus == PurchaseStatus.DRAFT && (status == PurchaseStatus.APPROVED || status == PurchaseStatus.COMPLETED)) {
            applyInventoryAndAccountingPostings(saved, company, userEmail);
        }

        logTimelineActivity(company, saved.getId(), "PURCHASE", "STATUS_TRANSITION", 
                "Transitioned from " + oldStatus + " to " + status, userEmail);

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

        // Check if intra-state or inter-state GST split
        boolean isIntraState = determineIntraState(purchase.getSupplier(), company);

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
            BigDecimal rawAmount = qty.multiply(rate);

            BigDecimal taxRate = BigDecimal.ZERO;
            BigDecimal cgstRate = BigDecimal.ZERO;
            BigDecimal sgstRate = BigDecimal.ZERO;
            BigDecimal igstRate = BigDecimal.ZERO;
            BigDecimal cessRate = BigDecimal.ZERO;

            if (item.getTaxCategory() != null) {
                taxRate = item.getTaxCategory().getGstRate() != null ? item.getTaxCategory().getGstRate() : BigDecimal.ZERO;
                cgstRate = item.getTaxCategory().getCgstRate() != null ? item.getTaxCategory().getCgstRate() : BigDecimal.ZERO;
                sgstRate = item.getTaxCategory().getSgstRate() != null ? item.getTaxCategory().getSgstRate() : BigDecimal.ZERO;
                igstRate = item.getTaxCategory().getIgstRate() != null ? item.getTaxCategory().getIgstRate() : BigDecimal.ZERO;
                cessRate = item.getTaxCategory().getCessRate() != null ? item.getTaxCategory().getCessRate() : BigDecimal.ZERO;
            }

            BigDecimal taxableAmount;
            BigDecimal taxAmount;

            if (isTaxInclusive != null && isTaxInclusive) {
                // Inclusive Tax Calculations
                // taxableAmount = (rawAmount - discount) / (1 + taxRate/100)
                BigDecimal divider = BigDecimal.ONE.add(taxRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                taxableAmount = rawAmount.subtract(lineDiscount).divide(divider, 2, RoundingMode.HALF_UP);
                taxAmount = rawAmount.subtract(lineDiscount).subtract(taxableAmount);
            } else {
                // Exclusive Tax Calculations
                taxableAmount = rawAmount.subtract(lineDiscount);
                taxAmount = taxableAmount.multiply(taxRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            }

            // GST Splits
            BigDecimal lineCgst = BigDecimal.ZERO;
            BigDecimal lineSgst = BigDecimal.ZERO;
            BigDecimal lineIgst = BigDecimal.ZERO;
            BigDecimal lineCess = taxableAmount.multiply(cessRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));

            if (isIntraState) {
                // Split standard tax rate by 2 for CGST/SGST if no specific sub-rates present
                BigDecimal localRate = taxRate.divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
                lineCgst = taxableAmount.multiply(localRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
                lineSgst = taxableAmount.multiply(localRate.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP));
            } else {
                lineIgst = taxAmount;
            }

            BigDecimal lineTotal = taxableAmount.add(taxAmount).add(lineCess);

            PurchaseLine line = PurchaseLine.builder()
                    .stockItem(item)
                    .quantity(qty)
                    .rate(rate)
                    .discount(lineDiscount)
                    .taxPercentage(taxRate)
                    .taxAmount(taxAmount)
                    .totalAmount(lineTotal)
                    .warehouse(lineWh)
                    .batchNumber(req.getBatchNumber())
                    .build();

            purchase.addLineItem(line);

            totalGross = totalGross.add(rawAmount);
            totalLineDiscounts = totalLineDiscounts.add(lineDiscount);
            totalTaxAmount = totalTaxAmount.add(taxAmount);
            totalCgst = totalCgst.add(lineCgst);
            totalSgst = totalSgst.add(lineSgst);
            totalIgst = totalIgst.add(lineIgst);
            totalCess = totalCess.add(lineCess);
        }

        BigDecimal netTotal = totalGross.subtract(totalLineDiscounts).add(totalTaxAmount).add(totalCess);
        
        // Apply invoice discount
        BigDecimal invDisc = invoiceDiscount != null ? invoiceDiscount : BigDecimal.ZERO;
        netTotal = netTotal.subtract(invDisc);

        // Round Off Calculations
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

    private void applyInventoryAndAccountingPostings(Purchase purchase, Company company, String email) {
        log.info("Applying double-entry ledger postings and inventory cost updates for Purchase {}", purchase.getPurchaseNumber());

        // 1. Update Supplier outstanding balance and lastPurchaseDate
        BusinessPartner supplier = purchase.getSupplier();
        BigDecimal currentOutstanding = supplier.getOutstandingBalance() != null ? supplier.getOutstandingBalance() : BigDecimal.ZERO;
        supplier.setOutstandingBalance(currentOutstanding.add(purchase.getGrandTotal()));
        supplier.setLastPurchaseDate(purchase.getPurchaseDate());
        partnerRepository.save(supplier);

        // 2. Perform Inventory Stock updates & average cost rollup
        for (PurchaseLine line : purchase.getLineItems()) {
            StockItem item = line.getStockItem();

            BigDecimal oldQty = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
            BigDecimal oldCost = item.getAverageCost() != null ? item.getAverageCost() : BigDecimal.ZERO;
            
            BigDecimal buyQty = line.getQuantity();
            BigDecimal buyRate = line.getRate().subtract(line.getDiscount().divide(buyQty, 4, RoundingMode.HALF_UP));

            BigDecimal newQty = oldQty.add(buyQty);
            BigDecimal newCost = oldCost;

            if (newQty.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal oldVal = oldQty.multiply(oldCost);
                BigDecimal newVal = buyQty.multiply(buyRate);
                newCost = oldVal.add(newVal).divide(newQty, 4, RoundingMode.HALF_UP);
            }

            item.setCurrentQuantity(newQty);
            item.setAverageCost(newCost);
            stockItemRepository.save(item);
        }

        // 3. Post Double-entry accounting ledger bookings
        // Debit: Purchase Account (tax-exclusive gross amount)
        BigDecimal taxableTotal = purchase.getGrossAmount().subtract(purchase.getDiscountAmount());
        Ledger purchaseLedger = getOrCreateLedger(company, "Purchase Account", "Purchase", GroupNature.EXPENSE);
        purchaseLedger.setOpeningBalance(purchaseLedger.getOpeningBalance().add(taxableTotal));
        ledgerRepository.save(purchaseLedger);

        // Credit: Supplier Account (grandTotal)
        Ledger supplierLedger = getOrCreateLedger(company, supplier.getName() + " Ledger", "Current Liabilities", GroupNature.LIABILITY);
        supplierLedger.setOpeningBalance(supplierLedger.getOpeningBalance().add(purchase.getGrandTotal()));
        ledgerRepository.save(supplierLedger);

        // Debit: Taxes
        if (purchase.getCgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cgstLedger = getOrCreateLedger(company, "CGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            cgstLedger.setOpeningBalance(cgstLedger.getOpeningBalance().subtract(purchase.getCgst()));
            ledgerRepository.save(cgstLedger);
        }
        if (purchase.getSgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger sgstLedger = getOrCreateLedger(company, "SGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            sgstLedger.setOpeningBalance(sgstLedger.getOpeningBalance().subtract(purchase.getSgst()));
            ledgerRepository.save(sgstLedger);
        }
        if (purchase.getIgst().compareTo(BigDecimal.ZERO) > 0) {
            Ledger igstLedger = getOrCreateLedger(company, "IGST Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            igstLedger.setOpeningBalance(igstLedger.getOpeningBalance().subtract(purchase.getIgst()));
            ledgerRepository.save(igstLedger);
        }
        if (purchase.getCess().compareTo(BigDecimal.ZERO) > 0) {
            Ledger cessLedger = getOrCreateLedger(company, "CESS Input Tax Account", "Duties & Taxes", GroupNature.LIABILITY);
            cessLedger.setOpeningBalance(cessLedger.getOpeningBalance().subtract(purchase.getCess()));
            ledgerRepository.save(cessLedger);
        }
    }

    private Ledger getOrCreateLedger(Company company, String name, String groupName, GroupNature nature) {
        return ledgerRepository.findByCompanyAndName(company, name)
                .orElseGet(() -> {
                    AccountGroup group = groupRepository.findByCompanyAndName(company, groupName)
                            .orElseGet(() -> {
                                AccountGroup parent = null;
                                if (groupName.equals("Duties & Taxes")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Current Liabilities").orElse(null);
                                } else if (groupName.equals("Purchase")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Expense").orElse(null);
                                } else if (groupName.equals("Current Assets")) {
                                    parent = groupRepository.findByCompanyAndName(company, "Assets").orElse(null);
                                }
                                return groupRepository.save(AccountGroup.builder()
                                        .name(groupName)
                                        .nature(nature)
                                        .parentGroup(parent)
                                        .company(company)
                                        .isSystemGenerated(true)
                                        .isActive(true)
                                        .build());
                            });
                    return ledgerRepository.save(Ledger.builder()
                            .name(name)
                            .group(group)
                            .company(company)
                            .balanceType(nature == GroupNature.ASSET || nature == GroupNature.EXPENSE ? BalanceType.DEBIT : BalanceType.CREDIT)
                            .openingBalance(BigDecimal.ZERO)
                            .isActive(true)
                            .build());
                });
    }

    private void logTimelineActivity(Company company, UUID entityId, String entityType, String action, String details, String performedBy) {
        timelineRepository.save(ActivityTimeline.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .details(details)
                .performedBy(performedBy)
                .company(company)
                .build());
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
}
