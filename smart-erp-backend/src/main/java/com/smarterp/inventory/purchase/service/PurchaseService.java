package com.smarterp.inventory.purchase.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.purchase.dto.PurchaseRequest;
import com.smarterp.inventory.purchase.dto.PurchaseResponse;
import com.smarterp.inventory.purchase.entity.PurchaseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.UUID;

public interface PurchaseService {

    PurchaseResponse createPurchase(PurchaseRequest request, Company company, String userEmail);

    PurchaseResponse updatePurchase(UUID id, PurchaseRequest request, Company company, String userEmail);

    PurchaseResponse getPurchaseById(UUID id, Company company);

    PurchaseResponse updatePurchaseStatus(UUID id, PurchaseStatus status, Company company, String userEmail);

    Page<PurchaseResponse> searchPurchases(
            Pageable pageable,
            Company company,
            String search,
            PurchaseStatus status,
            UUID supplierId,
            UUID warehouseId,
            LocalDate fromDate,
            LocalDate toDate
    );

    void deletePurchase(UUID id, Company company);
}
