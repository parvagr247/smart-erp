package com.smarterp.inventory.sales.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.sales.dto.SalesRequest;
import com.smarterp.inventory.sales.dto.SalesResponse;
import com.smarterp.inventory.sales.entity.SalesStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.UUID;

public interface SalesService {
    SalesResponse createSales(SalesRequest request, Company company, String userEmail);
    SalesResponse updateSales(UUID id, SalesRequest request, Company company, String userEmail);
    SalesResponse getSalesById(UUID id, Company company);
    SalesResponse updateSalesStatus(UUID id, SalesStatus status, Company company, String userEmail);
    Page<SalesResponse> searchAndFilterSales(Company company, String search, SalesStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable);
    void deleteSales(UUID id, Company company);
}
