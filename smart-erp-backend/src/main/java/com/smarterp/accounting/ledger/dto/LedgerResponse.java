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
}
