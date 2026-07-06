package com.smarterp.inventory.purchase.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.service.PartnerService;
import com.smarterp.inventory.master.service.InventoryLookupService;
import com.smarterp.inventory.master.entity.Warehouse;
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
import com.smarterp.common.aop.annotations.AuditOperation;
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
import org.springframework.cache.annotation.CacheEvict;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PartnerService partnerService;
    private final InventoryLookupService inventoryLookupService;
    private final ApplicationEventPublisher eventPublisher;

    private final com.smarterp.inventory.purchase.validator.PurchaseValidator purchaseValidator;
    private final com.smarterp.inventory.purchase.mapper.PurchaseMapper purchaseMapper;
    private final com.smarterp.inventory.purchase.service.PurchaseCalculationService purchaseCalculationService;

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    @AuditOperation(action = "CREATED", entityType = "Purchase", details = "'Purchase Voucher ' + #result.purchaseNumber + ' recorded.'")
    public PurchaseResponse createPurchase(PurchaseRequest request, Company company, String userEmail) {
        log.info("Creating purchase transaction for company {}", company.getId());
        purchaseValidator.validateRequest(request, company);

        BusinessPartner supplier = partnerService.getPartnerEntity(request.getSupplierId(), company);
        Warehouse warehouse = inventoryLookupService.getWarehouseEntity(request.getWarehouseId(), company);

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

        purchaseCalculationService.calculateTaxesAndTotals(purchase, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Purchase saved = purchaseRepository.save(purchase);

        // Publish Lifecycle domain events if posted/approved immediately
        publishPurchaseLifecycleEvents(saved, company.getId(), userEmail, PurchaseStatus.DRAFT);

        return purchaseMapper.mapToResponse(saved);
    }

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public PurchaseResponse updatePurchase(UUID id, PurchaseRequest request, Company company, String userEmail) {
        log.info("Updating purchase transaction {} for company {}", id, company.getId());
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));

        if (purchase.getStatus() == PurchaseStatus.APPROVED || purchase.getStatus() == PurchaseStatus.COMPLETED) {
            throw new BusinessValidationException("Approved or Completed purchase transactions cannot be modified.");
        }

        purchaseValidator.validateRequest(request, company);

        BusinessPartner supplier = partnerService.getPartnerEntity(request.getSupplierId(), company);
        Warehouse warehouse = inventoryLookupService.getWarehouseEntity(request.getWarehouseId(), company);

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
        purchaseCalculationService.calculateTaxesAndTotals(purchase, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Purchase saved = purchaseRepository.save(purchase);

        publishPurchaseLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return purchaseMapper.mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseResponse getPurchaseById(UUID id, Company company) {
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));
        return purchaseMapper.mapToResponse(purchase);
    }

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public PurchaseResponse updatePurchaseStatus(UUID id, PurchaseStatus status, Company company, String userEmail) {
        log.info("Updating status of purchase {} to {} in company {}", id, status, company.getId());
        Purchase purchase = purchaseRepository.findById(id)
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Purchase voucher not found."));

        PurchaseStatus oldStatus = purchase.getStatus();
        if (oldStatus == status) {
            return purchaseMapper.mapToResponse(purchase);
        }

        if (!purchaseValidator.canTransition(oldStatus, status)) {
            throw new BusinessValidationException("Invalid status transition from " + oldStatus + " to " + status + ".");
        }

        purchase.setStatus(status);
        Purchase saved = purchaseRepository.save(purchase);

        publishPurchaseLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return purchaseMapper.mapToResponse(saved);
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
                .map(purchaseMapper::mapToSummaryResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, page.getTotalElements());
    }

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
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

    private String generatePurchaseNumber(Company company) {
        int currentYear = LocalDate.now().getYear();
        String prefix = "PUR-" + currentYear + "-%";
        String maxNum = purchaseRepository.findMaxPurchaseNumberByCompanyAndPrefix(company, prefix);

        int nextVal = 1;
        if (maxNum != null && maxNum.length() >= 15) {
            try {
                String seqStr = maxNum.substring(maxNum.length() - 6);
                nextVal = Integer.parseInt(seqStr) + 1;
            } catch (Exception e) {
                log.warn("Failed to parse sequential number from Max Purchase Number {}", maxNum);
            }
        }

        return String.format("PUR-%d-%06d", currentYear, nextVal);
    }

    private void publishPurchaseLifecycleEvents(Purchase purchase, UUID companyId, String performedBy, PurchaseStatus oldStatus) {
        if (oldStatus == PurchaseStatus.DRAFT) {
            if (purchase.getStatus() == PurchaseStatus.APPROVED) {
                eventPublisher.publishEvent(new PurchaseApprovedEvent(this, purchase.getId(), companyId, performedBy));
            }
        }
    }
}
