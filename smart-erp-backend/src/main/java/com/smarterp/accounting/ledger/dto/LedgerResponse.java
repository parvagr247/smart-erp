package com.smarterp.accounting.ledger.dto;

import com.smarterp.accounting.ledger.entity.BalanceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerResponse {
    private UUID id;
    private String name;
    private UUID groupId;
    private String groupName;
    private BigDecimal openingBalance;
    private BalanceType balanceType;
    private Boolean gstApplicable;
    private String gstNumber;
    private String pan;
    private String email;
    private String phone;
    private String address;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static LedgerResponse fromEntity(com.smarterp.accounting.ledger.entity.Ledger entity) {
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
}
