package com.smarterp.administration.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {
    private UUID id;
    private String name;
    private String gstNumber;
    private String panNumber;
    private String financialYear;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String phone;
    private String email;
    private String currency;
    private String logo;
    private Boolean isActive;
    private Boolean keyboardOnlyMode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long version;

    public static CompanyResponse fromEntity(com.smarterp.administration.company.entity.Company company) {
        if (company == null) return null;
        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .gstNumber(company.getGstNumber())
                .panNumber(company.getPanNumber())
                .financialYear(company.getFinancialYear())
                .address(company.getAddress())
                .city(company.getCity())
                .state(company.getState())
                .country(company.getCountry())
                .pincode(company.getPincode())
                .phone(company.getPhone())
                .email(company.getEmail())
                .currency(company.getCurrency())
                .logo(company.getLogo())
                .isActive(company.getIsActive())
                .keyboardOnlyMode(company.getKeyboardOnlyMode())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .version(company.getVersion())
                .build();
    }
}
