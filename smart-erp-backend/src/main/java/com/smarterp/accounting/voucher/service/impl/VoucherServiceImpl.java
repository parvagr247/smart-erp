package com.smarterp.accounting.voucher.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.accounting.ledger.entity.Ledger;
import com.smarterp.accounting.ledger.repository.LedgerRepository;
import com.smarterp.accounting.voucher.dto.VoucherLineRequest;
import com.smarterp.accounting.voucher.dto.VoucherLineResponse;
import com.smarterp.accounting.voucher.dto.VoucherRequest;
import com.smarterp.accounting.voucher.dto.VoucherResponse;
import com.smarterp.accounting.voucher.entity.Voucher;
import com.smarterp.accounting.voucher.entity.VoucherLine;
import com.smarterp.accounting.voucher.entity.VoucherStatus;
import com.smarterp.accounting.voucher.entity.VoucherType;
import com.smarterp.accounting.voucher.event.VoucherApprovedEvent;
import com.smarterp.accounting.voucher.event.VoucherCreatedEvent;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import com.smarterp.accounting.voucher.service.VoucherService;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository repository;
    private final LedgerRepository ledgerRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public VoucherResponse createVoucher(VoucherRequest request, Company company, String userEmail) {
        log.info("Creating accounting voucher type {} for company {}", request.getVoucherType(), company.getId());
        validateRequest(request, company);

        String voucherNum = generateVoucherNumber(company, request.getVoucherType());
        VoucherStatus initialStatus = request.getStatus() != null ? request.getStatus() : VoucherStatus.DRAFT;

        Voucher voucher = Voucher.builder()
                .voucherNumber(voucherNum)
                .voucherDate(request.getVoucherDate() != null ? request.getVoucherDate() : LocalDate.now())
                .voucherType(request.getVoucherType())
                .status(initialStatus)
                .narration(request.getNarration())
                .company(company)
                .createdBy(userEmail)
                .build();

        populateLineItems(voucher, request.getLineItems(), company);

        Voucher saved = repository.save(voucher);

        eventPublisher.publishEvent(new VoucherCreatedEvent(this, saved.getId(), company.getId()));
        if (saved.getStatus() == VoucherStatus.APPROVED) {
            eventPublisher.publishEvent(new VoucherApprovedEvent(this, saved.getId(), company.getId()));
        }

        return mapToResponse(saved);
    }

    @Override
    public VoucherResponse updateVoucher(UUID id, VoucherRequest request, Company company, String userEmail) {
        log.info("Updating accounting voucher {} for company {}", id, company.getId());
        Voucher voucher = repository.findById(id)
                .filter(v -> v.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found."));

        if (voucher.getStatus() == VoucherStatus.APPROVED) {
            throw new BusinessValidationException("Approved accounting vouchers cannot be modified.");
        }

        validateRequest(request, company);

        VoucherStatus oldStatus = voucher.getStatus();
        VoucherStatus newStatus = request.getStatus() != null ? request.getStatus() : VoucherStatus.DRAFT;

        voucher.setVoucherDate(request.getVoucherDate() != null ? request.getVoucherDate() : LocalDate.now());
        voucher.setVoucherType(request.getVoucherType());
        voucher.setNarration(request.getNarration());
        voucher.setStatus(newStatus);

        voucher.getLineItems().clear();
        populateLineItems(voucher, request.getLineItems(), company);

        Voucher saved = repository.save(voucher);

        if (oldStatus == VoucherStatus.DRAFT && saved.getStatus() == VoucherStatus.APPROVED) {
            eventPublisher.publishEvent(new VoucherApprovedEvent(this, saved.getId(), company.getId()));
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherResponse getVoucherById(UUID id, Company company) {
        Voucher voucher = repository.findById(id)
                .filter(v -> v.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found."));
        return mapToResponse(voucher);
    }

    @Override
    public VoucherResponse updateVoucherStatus(UUID id, VoucherStatus status, Company company, String userEmail) {
        log.info("Updating status of voucher {} to {} in company {}", id, status, company.getId());
        Voucher voucher = repository.findById(id)
                .filter(v -> v.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found."));

        VoucherStatus oldStatus = voucher.getStatus();
        if (oldStatus == status) {
            return mapToResponse(voucher);
        }

        if (!canTransition(oldStatus, status)) {
            throw new BusinessValidationException("Invalid status transition from " + oldStatus + " to " + status + ".");
        }

        voucher.setStatus(status);
        Voucher saved = repository.save(voucher);

        if (saved.getStatus() == VoucherStatus.APPROVED) {
            eventPublisher.publishEvent(new VoucherApprovedEvent(this, saved.getId(), company.getId()));
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<VoucherResponse> searchAndFilterVouchers(
            Company company, String search, VoucherType type, VoucherStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<Voucher> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("company"), company));

            if (search != null && !search.trim().isEmpty()) {
                String term = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("voucherNumber")), term));
            }

            if (type != null) {
                predicates.add(cb.equal(root.get("voucherType"), type));
            }

            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("voucherDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("voucherDate"), endDate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return repository.findAll(spec, pageable).map(this::mapToSummaryResponse);
    }

    @Override
    public void deleteVoucher(UUID id, Company company) {
        Voucher voucher = repository.findById(id)
                .filter(v -> v.getCompany().getId().equals(company.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Voucher not found."));

        if (voucher.getStatus() == VoucherStatus.APPROVED) {
            throw new BusinessValidationException("Cannot delete approved vouchers.");
        }

        repository.delete(voucher);
    }

    private void validateRequest(VoucherRequest request, Company company) {
        if (request.getLineItems() == null || request.getLineItems().size() < 2) {
            throw new BusinessValidationException("A voucher must contain at least 2 ledger entries.");
        }

        BigDecimal debitTotal = BigDecimal.ZERO;
        BigDecimal creditTotal = BigDecimal.ZERO;

        for (VoucherLineRequest line : request.getLineItems()) {
            if (line.getLedgerId() == null) {
                throw new BusinessValidationException("Ledger ID is required on all lines.");
            }
            if (line.getAmount() == null || line.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Voucher amount must be positive and greater than zero.");
            }
            if ("DEBIT".equalsIgnoreCase(line.getEntryType())) {
                debitTotal = debitTotal.add(line.getAmount());
            } else if ("CREDIT".equalsIgnoreCase(line.getEntryType())) {
                creditTotal = creditTotal.add(line.getAmount());
            } else {
                throw new BusinessValidationException("Entry type must be either 'DEBIT' or 'CREDIT'.");
            }
        }

        if (debitTotal.compareTo(creditTotal) != 0) {
            throw new BusinessValidationException("Double-entry equation mismatch! Total debits (" + debitTotal + 
                    ") must equal total credits (" + creditTotal + ").");
        }
    }

    private void populateLineItems(Voucher voucher, List<VoucherLineRequest> lines, Company company) {
        for (VoucherLineRequest req : lines) {
            Ledger ledger = ledgerRepository.findById(req.getLedgerId())
                    .filter(l -> l.getCompany().getId().equals(company.getId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Ledger not found."));

            VoucherLine line = VoucherLine.builder()
                    .voucher(voucher)
                    .ledger(ledger)
                    .amount(req.getAmount())
                    .entryType(req.getEntryType().trim().toUpperCase())
                    .build();

            voucher.getLineItems().add(line);
        }
    }

    private String generateVoucherNumber(Company company, VoucherType type) {
        int currentYear = LocalDate.now().getYear();
        String typePrefix = "";
        switch (type) {
            case PAYMENT -> typePrefix = "PAY";
            case RECEIPT -> typePrefix = "REC";
            case JOURNAL -> typePrefix = "JV";
            case CONTRA -> typePrefix = "CON";
        }
        String prefix = typePrefix + "-" + currentYear + "-%";
        String maxNum = repository.findMaxVoucherNumberByCompanyAndTypeAndPrefix(company, type, prefix);

        int nextVal = 1;
        if (maxNum != null && maxNum.length() >= (typePrefix.length() + 12)) {
            try {
                String seqStr = maxNum.substring(maxNum.length() - 6);
                nextVal = Integer.parseInt(seqStr) + 1;
            } catch (Exception e) {
                log.warn("Failed to parse sequential number from Max Voucher Number {}", maxNum);
            }
        }

        return String.format("%s-%d-%06d", typePrefix, currentYear, nextVal);
    }

    private VoucherResponse mapToSummaryResponse(Voucher v) {
        return VoucherResponse.builder()
                .id(v.getId())
                .voucherNumber(v.getVoucherNumber())
                .voucherDate(v.getVoucherDate())
                .voucherType(v.getVoucherType())
                .status(v.getStatus())
                .narration(v.getNarration())
                .lineItems(null)
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .build();
    }

    private VoucherResponse mapToResponse(Voucher v) {
        List<VoucherLineResponse> lines = v.getLineItems().stream()
                .map(line -> VoucherLineResponse.builder()
                        .id(line.getId())
                        .ledgerId(line.getLedger().getId())
                        .ledgerName(line.getLedger().getName())
                        .ledgerCode(line.getLedger().getName()) // Using name as code for representation or actual code if available
                        .amount(line.getAmount())
                        .entryType(line.getEntryType())
                        .build())
                .collect(Collectors.toList());

        return VoucherResponse.builder()
                .id(v.getId())
                .voucherNumber(v.getVoucherNumber())
                .voucherDate(v.getVoucherDate())
                .voucherType(v.getVoucherType())
                .status(v.getStatus())
                .narration(v.getNarration())
                .lineItems(lines)
                .createdBy(v.getCreatedBy())
                .createdAt(v.getCreatedAt())
                .build();
    }
    private boolean canTransition(VoucherStatus current, VoucherStatus target) {
        if (current == target) return true;
        if (current == VoucherStatus.DRAFT) {
            return target == VoucherStatus.APPROVED || target == VoucherStatus.CANCELLED;
        }
        if (current == VoucherStatus.APPROVED) {
            return target == VoucherStatus.CANCELLED;
        }
        return false;
    }
}
