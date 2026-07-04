package com.smarterp.inventory.sales.listener;

import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.repository.PartnerRepository;
import com.smarterp.inventory.sales.entity.Sales;
import com.smarterp.inventory.sales.event.SalesApprovedEvent;
import com.smarterp.inventory.sales.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomerBalanceListener {

    private final SalesRepository salesRepository;
    private final PartnerRepository partnerRepository;

    @EventListener
    @Transactional
    public void onSalesApproved(SalesApprovedEvent event) {
        log.info("Customer balance listener reacting to SalesApprovedEvent for Sales ID: {}", event.getSalesId());
        Sales sales = salesRepository.findById(event.getSalesId()).orElse(null);
        if (sales == null) return;

        BusinessPartner customer = sales.getCustomer();
        BigDecimal currentOutstanding = customer.getOutstandingBalance() != null ? customer.getOutstandingBalance() : BigDecimal.ZERO;

        customer.setOutstandingBalance(currentOutstanding.add(sales.getGrandTotal()));
        partnerRepository.save(customer);
        log.info("Customer {} outstanding balance updated to {}", customer.getName(), customer.getOutstandingBalance());
    }
}
