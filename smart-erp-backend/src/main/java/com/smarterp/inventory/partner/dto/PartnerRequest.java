package com.smarterp.inventory.partner.dto;

import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.inventory.partner.entity.PartnerStatus;
import com.smarterp.inventory.partner.entity.PartnerType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerRequest {

    @NotBlank(message = "Partner code is required.")
    @Size(min = 2, max = 50, message = "Partner code must be between 2 and 50 characters.")
    private String code;

    @NotBlank(message = "Partner name is required.")
    @Size(min = 2, max = 100, message = "Partner name must be between 2 and 100 characters.")
    private String name;

    @NotNull(message = "Partner type is required.")
    private PartnerType type;

    private String gstNumber;

    private String pan;

    @Email(message = "Invalid email format.")
    private String email;

    private String phone;

    private String mobile;

    private String website;

    @Min(value = 0, message = "Credit limit cannot be negative.")
    private BigDecimal creditLimit;

    @Min(value = 0, message = "Opening balance cannot be negative.")
    private BigDecimal openingBalance;

    private BalanceType balanceType;

    private String paymentTerms;

    private PartnerStatus status;

    private String notes;

    @Builder.Default
    private Boolean isActive = true;

    @Valid
    @Builder.Default
    private List<AddressDto> addresses = new ArrayList<>();

    @Valid
    @Builder.Default
    private List<PartnerContactDto> contacts = new ArrayList<>();
}
