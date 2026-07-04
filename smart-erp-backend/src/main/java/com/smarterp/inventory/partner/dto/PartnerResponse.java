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

    public static PartnerResponse fromEntity(com.smarterp.inventory.partner.entity.BusinessPartner partner) {
        if (partner == null) return null;

        java.util.List<AddressDto> addressDtos = partner.getAddresses().stream()
                .map(a -> AddressDto.builder()
                        .id(a.getId())
                        .addressType(a.getAddressType())
                        .addressLine1(a.getAddressLine1())
                        .addressLine2(a.getAddressLine2())
                        .city(a.getCity())
                        .state(a.getState())
                        .country(a.getCountry())
                        .pincode(a.getPincode())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        java.util.List<PartnerContactDto> contactDtos = partner.getContacts().stream()
                .map(c -> PartnerContactDto.builder()
                        .id(c.getId())
                        .contactName(c.getContactName())
                        .designation(c.getDesignation())
                        .email(c.getEmail())
                        .phone(c.getPhone())
                        .mobile(c.getMobile())
                        .isPrimary(c.getIsPrimary())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        return PartnerResponse.builder()
                .id(partner.getId())
                .code(partner.getCode())
                .name(partner.getName())
                .type(partner.getType())
                .gstNumber(partner.getGstNumber())
                .pan(partner.getPan())
                .email(partner.getEmail())
                .phone(partner.getPhone())
                .mobile(partner.getMobile())
                .website(partner.getWebsite())
                .creditLimit(partner.getCreditLimit())
                .openingBalance(partner.getOpeningBalance())
                .balanceType(partner.getBalanceType())
                .paymentTerms(partner.getPaymentTerms())
                .status(partner.getStatus())
                .notes(partner.getNotes())
                .isActive(partner.getIsActive())
                .createdAt(partner.getCreatedAt())
                .updatedAt(partner.getUpdatedAt())
                .addresses(addressDtos)
                .contacts(contactDtos)
                .build();
    }
}
