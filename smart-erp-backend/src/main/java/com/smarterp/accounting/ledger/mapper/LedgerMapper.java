package com.smarterp.accounting.ledger.mapper;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.group.entity.AccountGroup;
import com.smarterp.accounting.ledger.dto.LedgerRequest;
import com.smarterp.accounting.ledger.dto.LedgerResponse;
import com.smarterp.accounting.ledger.entity.Ledger;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class LedgerMapper {

    public Ledger toEntity(LedgerRequest request, Company company, AccountGroup group) {
        if (request == null) return null;
        return Ledger.builder()
                .name(request.getName().trim())
                .group(group)
                .openingBalance(request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO)
                .balanceType(request.getBalanceType())
                .gstApplicable(request.getGstApplicable() != null ? request.getGstApplicable() : false)
                .gstNumber(request.getGstNumber() != null ? request.getGstNumber().trim() : null)
                .pan(request.getPan() != null ? request.getPan().trim() : null)
                .email(request.getEmail() != null ? request.getEmail().trim() : null)
                .phone(request.getPhone() != null ? request.getPhone().trim() : null)
                .address(request.getAddress() != null ? request.getAddress().trim() : null)
                .company(company)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();
    }

    public LedgerResponse toResponse(Ledger entity) {
        if (entity == null) return null;
        return LedgerResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .groupId(entity.getGroup() != null ? entity.getGroup().getId() : null)
                .groupName(entity.getGroup() != null ? entity.getGroup().getName() : null)
                .openingBalance(entity.getOpeningBalance())
                .balanceType(entity.getBalanceType())
                .gstApplicable(entity.getGstApplicable())
                .gstNumber(entity.getGstNumber())
                .pan(entity.getPan())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(LedgerRequest request, Ledger entity, AccountGroup group) {
        if (request == null || entity == null) return;
        entity.setName(request.getName().trim());
        entity.setGroup(group);
        entity.setOpeningBalance(request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO);
        entity.setBalanceType(request.getBalanceType());
        entity.setGstApplicable(request.getGstApplicable() != null ? request.getGstApplicable() : false);
        entity.setGstNumber(request.getGstNumber() != null ? request.getGstNumber().trim() : null);
        entity.setPan(request.getPan() != null ? request.getPan().trim() : null);
        entity.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        entity.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        entity.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        if (request.getIsActive() != null) {
            entity.setIsActive(request.getIsActive());
        }
    }
}
