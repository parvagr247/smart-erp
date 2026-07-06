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
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.inventory.sales.service.SalesService;
import com.smarterp.inventory.purchase.domain.TaxCalculator;
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
import org.springframework.cache.annotation.CacheEvict;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SalesServiceImpl implements SalesService {

    private final SalesRepository salesRepository;
    private final PartnerRepository partnerRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryTransactionService inventoryTransactionService;
    private final ApplicationEventPublisher eventPublisher;

    private final com.smarterp.inventory.sales.validator.SalesValidator salesValidator;
    private final com.smarterp.inventory.sales.mapper.SalesMapper salesMapper;
    private final com.smarterp.inventory.sales.service.SalesCalculationService salesCalculationService;

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public SalesResponse createSales(SalesRequest request, Company company, String userEmail) {
        log.info("Creating sales transaction for company {}", company.getId());
        salesValidator.validateRequest(request, company);

        BusinessPartner customer = partnerRepository.findById(request.getCustomerId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        // If status is APPROVED/COMPLETED, check stock availability
        SalesStatus initialStatus = request.getStatus() != null ? request.getStatus() : SalesStatus.DRAFT;
        if (initialStatus == SalesStatus.APPROVED || initialStatus == SalesStatus.COMPLETED) {
            salesValidator.checkStockAvailability(request.getLineItems(), company.getId());
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

        salesCalculationService.calculateTaxesAndTotals(sales, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Sales saved = salesRepository.save(sales);

        // If approved/completed, trigger stock reductions via inventory transaction service
        if (saved.getStatus() == SalesStatus.APPROVED || saved.getStatus() == SalesStatus.COMPLETED) {
            reduceInventory(saved, userEmail);
        }

        publishSalesLifecycleEvents(saved, company.getId(), userEmail, SalesStatus.DRAFT);

        return salesMapper.mapToResponse(saved);
    }

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public SalesResponse updateSales(UUID id, SalesRequest request, Company company, String userEmail) {
        log.info("Updating sales transaction {} for company {}", id, company.getId());
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));

        if (sales.getStatus() == SalesStatus.APPROVED || sales.getStatus() == SalesStatus.COMPLETED) {
            throw new BusinessValidationException("Approved or Completed sales transactions cannot be modified.");
        }

        salesValidator.validateRequest(request, company);

        BusinessPartner customer = partnerRepository.findById(request.getCustomerId())
                .filter(p -> p.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found."));

        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .filter(w -> w.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found."));

        SalesStatus oldStatus = sales.getStatus();
        SalesStatus newStatus = request.getStatus() != null ? request.getStatus() : SalesStatus.DRAFT;

        if (newStatus == SalesStatus.APPROVED || newStatus == SalesStatus.COMPLETED) {
            salesValidator.checkStockAvailability(request.getLineItems(), company.getId());
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
        salesCalculationService.calculateTaxesAndTotals(sales, request.getLineItems(), request.getInvoiceDiscountAmount(), request.getIsTaxInclusive(), company);

        Sales saved = salesRepository.save(sales);

        if (saved.getStatus() == SalesStatus.APPROVED || saved.getStatus() == SalesStatus.COMPLETED) {
            reduceInventory(saved, userEmail);
        }

        publishSalesLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return salesMapper.mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public SalesResponse getSalesById(UUID id, Company company) {
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));
        return salesMapper.mapToResponse(sales);
    }

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public SalesResponse updateSalesStatus(UUID id, SalesStatus status, Company company, String userEmail) {
        log.info("Updating status of sales invoice {} to {} in company {}", id, status, company.getId());
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));

        SalesStatus oldStatus = sales.getStatus();
        if (oldStatus == status) {
            return salesMapper.mapToResponse(sales);
        }

        if (!salesValidator.canTransition(oldStatus, status)) {
            throw new BusinessValidationException("Invalid status transition from " + oldStatus + " to " + status + ".");
        }

        if (oldStatus == SalesStatus.DRAFT && (status == SalesStatus.APPROVED || status == SalesStatus.COMPLETED)) {
            // Check stock of existing saved lines
            List<SalesLineRequest> lines = sales.getLineItems().stream()
                    .map(l -> SalesLineRequest.builder()
                            .stockItemId(l.getStockItem().getId())
                            .quantity(l.getQuantity())
                            .build())
                    .collect(Collectors.toList());
            salesValidator.checkStockAvailability(lines, company.getId());
        }

        sales.setStatus(status);
        Sales saved = salesRepository.save(sales);

        if (oldStatus == SalesStatus.DRAFT && (saved.getStatus() == SalesStatus.APPROVED || saved.getStatus() == SalesStatus.COMPLETED)) {
            reduceInventory(saved, userEmail);
        }

        publishSalesLifecycleEvents(saved, company.getId(), userEmail, oldStatus);

        return salesMapper.mapToResponse(saved);
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

        return salesRepository.findAll(spec, pageable).map(salesMapper::mapToSummaryResponse);
    }

    @Override
    @CacheEvict(value = "dashboard", key = "#company.id")
    public void deleteSales(UUID id, Company company) {
        Sales sales = salesRepository.findById(id)
                .filter(s -> s.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Sales invoice not found."));

        if (sales.getStatus() == SalesStatus.APPROVED || sales.getStatus() == SalesStatus.COMPLETED) {
            throw new BusinessValidationException("Cannot delete approved or completed sales invoices.");
        }

        salesRepository.delete(sales);
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
        if (maxNum != null && maxNum.length() >= 15) {
            try {
                String seqStr = maxNum.substring(maxNum.length() - 6);
                nextVal = Integer.parseInt(seqStr) + 1;
            } catch (Exception e) {
                log.warn("Failed to parse sequential number from Max Sales Number {}", maxNum);
            }
        }

        return String.format("SAL-%d-%06d", currentYear, nextVal);
    }

    private void publishSalesLifecycleEvents(Sales sales, UUID companyId, String performedBy, SalesStatus oldStatus) {
        if (oldStatus == SalesStatus.DRAFT) {
            if (sales.getStatus() == SalesStatus.APPROVED) {
                eventPublisher.publishEvent(new SalesApprovedEvent(this, sales.getId(), companyId, performedBy));
            }
        }
    }
}
