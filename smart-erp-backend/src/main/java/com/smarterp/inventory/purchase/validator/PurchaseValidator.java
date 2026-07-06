package com.smarterp.inventory.purchase.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.inventory.purchase.dto.PurchaseLineRequest;
import com.smarterp.inventory.purchase.dto.PurchaseRequest;
import com.smarterp.inventory.purchase.entity.PurchaseStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class PurchaseValidator {

    public void validateRequest(PurchaseRequest request, Company company) {
        if (request.getSupplierId() == null) {
            throw new BusinessValidationException("Supplier is required.");
        }
        if (request.getWarehouseId() == null) {
            throw new BusinessValidationException("Primary warehouse is required.");
        }
        if (request.getLineItems() == null || request.getLineItems().isEmpty()) {
            throw new BusinessValidationException("Purchase voucher must contain at least one item line.");
        }

        for (PurchaseLineRequest line : request.getLineItems()) {
            if (line.getStockItemId() == null) {
                throw new BusinessValidationException("Stock item ID is required on all lines.");
            }
            if (line.getQuantity() == null || line.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Quantity must be greater than zero.");
            }
            if (line.getRate() == null || line.getRate().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessValidationException("Rate must be greater than zero.");
            }
        }
    }

    public boolean canTransition(PurchaseStatus current, PurchaseStatus target) {
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
