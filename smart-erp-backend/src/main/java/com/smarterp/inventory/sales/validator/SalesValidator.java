package com.smarterp.inventory.sales.validator;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.repository.StockItemRepository;
import com.smarterp.inventory.sales.dto.SalesLineRequest;
import com.smarterp.inventory.sales.dto.SalesRequest;
import com.smarterp.inventory.sales.entity.SalesStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SalesValidator {

    private final StockItemRepository stockItemRepository;

    public void validateRequest(SalesRequest request, Company company) {
        if (request.getLineItems() == null || request.getLineItems().isEmpty()) {
            throw new BusinessValidationException("Sales invoice must contain at least one line item.");
        }
        for (SalesLineRequest line : request.getLineItems()) {
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

    public void checkStockAvailability(List<SalesLineRequest> lines, UUID companyId) {
        for (SalesLineRequest line : lines) {
            StockItem item = stockItemRepository.findById(line.getStockItemId())
                    .filter(i -> i.getCompany().getId().equals(companyId))
                    .orElseThrow(() -> new ResourceNotFoundException("Stock item not found."));

            if (item.getTrackInventory() != null && item.getTrackInventory()) {
                BigDecimal available = item.getCurrentQuantity() != null ? item.getCurrentQuantity() : BigDecimal.ZERO;
                if (available.compareTo(line.getQuantity()) < 0) {
                    throw new BusinessValidationException("Insufficient stock for item: " + item.getName() + 
                            ". Available: " + available + ", Required: " + line.getQuantity());
                }
            }
        }
    }

    public boolean canTransition(SalesStatus current, SalesStatus target) {
        if (current == target) return true;
        switch (current) {
            case DRAFT:
                return target == SalesStatus.APPROVED || target == SalesStatus.CANCELLED;
            case APPROVED:
                return target == SalesStatus.COMPLETED || target == SalesStatus.CANCELLED;
            case COMPLETED:
            case CANCELLED:
                return false;
            default:
                return false;
        }
    }
}
