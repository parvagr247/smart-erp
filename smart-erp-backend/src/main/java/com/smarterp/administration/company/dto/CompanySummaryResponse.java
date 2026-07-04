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
public class CompanySummaryResponse {
    private UUID id;
    private String name;
    private String gstNumber;
    private String financialYear;
    private String state;
    private String address;
    private LocalDateTime createdAt;

    public static CompanySummaryResponse fromEntity(com.smarterp.administration.company.entity.Company company) {
        if (company == null) return null;
        return CompanySummaryResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .gstNumber(company.getGstNumber())
                .financialYear(company.getFinancialYear())
                .state(company.getState())
                .address(company.getAddress())
                .createdAt(company.getCreatedAt())
                .build();
    }
}
