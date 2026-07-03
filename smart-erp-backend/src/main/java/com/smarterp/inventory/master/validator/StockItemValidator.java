package com.smarterp.inventory.master.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.inventory.master.dto.StockItemRequest;
import com.smarterp.inventory.master.repository.StockItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StockItemValidator {

    private final StockItemRepository repository;

    public void validateCreate(Company company, StockItemRequest request) {
        if (repository.existsByCompanyAndCode(company, request.getCode().trim())) {
            throw new BusinessValidationException("Stock item code '" + request.getCode().trim() + "' already exists in this company.");
        }
        if (repository.existsByCompanyAndSku(company, request.getSku().trim())) {
            throw new BusinessValidationException("SKU '" + request.getSku().trim() + "' already exists in this company.");
        }
        validateValues(request);
    }

    public void validateUpdate(Company company, UUID id, StockItemRequest request) {
        if (repository.existsByCompanyAndCodeAndIdNot(company, request.getCode().trim(), id)) {
            throw new BusinessValidationException("Another stock item with code '" + request.getCode().trim() + "' already exists in this company.");
        }
        if (repository.existsByCompanyAndSkuAndIdNot(company, request.getSku().trim(), id)) {
            throw new BusinessValidationException("Another stock item with SKU '" + request.getSku().trim() + "' already exists in this company.");
        }
        validateValues(request);
    }

    private void validateValues(StockItemRequest request) {
        if (request.getOpeningQuantity() != null && request.getOpeningQuantity().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Opening quantity cannot be negative.");
        }
        if (request.getOpeningValue() != null && request.getOpeningValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Opening value cannot be negative.");
        }
        if (request.getMinimumStock() != null && request.getMinimumStock().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Minimum stock cannot be negative.");
        }
        if (request.getMaximumStock() != null && request.getMaximumStock().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Maximum stock cannot be negative.");
        }
        if (request.getReorderLevel() != null && request.getReorderLevel().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessValidationException("Reorder level cannot be negative.");
        }
    }
}
