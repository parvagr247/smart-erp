package com.smarterp.notification.listener;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.inventory.purchase.event.PurchaseApprovedEvent;
import com.smarterp.inventory.purchase.repository.PurchaseRepository;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import com.smarterp.inventory.sales.repository.SalesRepository;
import com.smarterp.accounting.voucher.event.VoucherApprovedEvent;
import com.smarterp.accounting.voucher.repository.VoucherRepository;
import com.smarterp.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationListener {

    private final NotificationService notificationService;
    private final CompanyRepository companyRepository;
    private final PurchaseRepository purchaseRepository;
    private final SalesRepository salesRepository;
    private final VoucherRepository voucherRepository;

    @EventListener
    public void onPurchaseApproved(PurchaseApprovedEvent event) {
        log.info("Reacting to PurchaseApprovedEvent for Purchase ID: {}", event.getPurchaseId());
        Company company = companyRepository.findById(event.getCompanyId()).orElse(null);
        if (company == null) return;

        purchaseRepository.findById(event.getPurchaseId()).ifPresent(p -> {
            String msg = String.format("Purchase voucher %s has been APPROVED. Supplier: %s, Amount: ₹%s.",
                    p.getPurchaseNumber(), p.getSupplier().getName(), p.getGrandTotal());
            notificationService.createNotification(company, "Purchase Approved", msg, event.getPerformedBy());
        });
    }

    @EventListener
    public void onSalesApproved(SalesApprovedEvent event) {
        log.info("Reacting to SalesApprovedEvent for Sales ID: {}", event.getSalesId());
        Company company = companyRepository.findById(event.getCompanyId()).orElse(null);
        if (company == null) return;

        salesRepository.findById(event.getSalesId()).ifPresent(s -> {
            String msg = String.format("Sales invoice %s has been APPROVED. Customer: %s, Amount: ₹%s.",
                    s.getSalesNumber(), s.getCustomer().getName(), s.getGrandTotal());
            notificationService.createNotification(company, "Sales Invoice Approved", msg, event.getPerformedBy());
        });
    }

    @EventListener
    public void onVoucherApproved(VoucherApprovedEvent event) {
        log.info("Reacting to VoucherApprovedEvent for Voucher ID: {}", event.getVoucherId());
        Company company = companyRepository.findById(event.getCompanyId()).orElse(null);
        if (company == null) return;

        voucherRepository.findById(event.getVoucherId()).ifPresent(v -> {
            BigDecimal totalAmount = v.getLineItems().stream()
                    .filter(line -> "DEBIT".equalsIgnoreCase(line.getEntryType()))
                    .map(line -> line.getAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            String msg = String.format("Accounting voucher %s has been APPROVED. Type: %s, Total: ₹%s.",
                    v.getVoucherNumber(), v.getVoucherType(), totalAmount);
            notificationService.createNotification(company, "Voucher Approved", msg, v.getCreatedBy());
        });
    }
}
