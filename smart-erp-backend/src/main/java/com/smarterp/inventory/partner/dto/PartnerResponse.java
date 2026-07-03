package com.smarterp.inventory.partner.dto;

import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerResponse {
    private UUID id;
    private String code;
    private String name;
    private PartnerType type;
    private String gstNumber;
    private String pan;
    private String email;
    private String phone;
    private String mobile;
    private String website;
    private BigDecimal creditLimit;
    private BigDecimal openingBalance;
    private BalanceType balanceType;
    private String paymentTerms;
    private PartnerStatus status;
    private String notes;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Builder.Default
    private List<AddressDto> addresses = new ArrayList<>();
    
    @Builder.Default
    private List<PartnerContactDto> contacts = new ArrayList<>();
}
