package com.smarterp.accounting.ledger.dto;

import com.smarterp.accounting.ledger.entity.BalanceType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerRequest {

    @NotBlank(message = "Ledger name is required")
    @Size(min = 2, max = 100, message = "Ledger name must be between 2 and 100 characters")
    private String name;

    @NotNull(message = "Account group is required")
    private UUID groupId;

    @DecimalMin(value = "0.0", message = "Opening balance cannot be negative")
    private BigDecimal openingBalance;

    private BalanceType balanceType;

    private Boolean gstApplicable;

    @Pattern(
        regexp = "^$|^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
        message = "Invalid GST Number format. Must be a valid 15-digit Indian GSTIN."
    )
    private String gstNumber;

    @Pattern(
        regexp = "^$|^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        message = "Invalid PAN Number format. Must be a valid 10-digit PAN."
    )
    private String pan;

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phone;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    private Boolean isActive;

    public com.smarterp.accounting.ledger.entity.Ledger toEntity(
            com.smarterp.administration.company.entity.Company company, 
            com.smarterp.accounting.group.entity.AccountGroup group) {
        return com.smarterp.accounting.ledger.entity.Ledger.builder()
                .name(this.name.trim())
                .group(group)
                .openingBalance(this.openingBalance != null ? this.openingBalance : BigDecimal.ZERO)
                .balanceType(this.balanceType)
                .gstApplicable(this.gstApplicable != null ? this.gstApplicable : false)
                .gstNumber(this.gstNumber != null ? this.gstNumber.trim() : null)
                .pan(this.pan != null ? this.pan.trim() : null)
                .email(this.email != null ? this.email.trim() : null)
                .phone(this.phone != null ? this.phone.trim() : null)
                .address(this.address != null ? this.address.trim() : null)
                .company(company)
                .isActive(this.isActive != null ? this.isActive : true)
                .build();
    }

    public void updateEntity(
            com.smarterp.accounting.ledger.entity.Ledger entity, 
            com.smarterp.accounting.group.entity.AccountGroup group) {
        if (entity == null) return;
        entity.setName(this.name.trim());
        entity.setGroup(group);
        entity.setOpeningBalance(this.openingBalance != null ? this.openingBalance : BigDecimal.ZERO);
        entity.setBalanceType(this.balanceType);
        entity.setGstApplicable(this.gstApplicable != null ? this.gstApplicable : false);
        entity.setGstNumber(this.gstNumber != null ? this.gstNumber.trim() : null);
        entity.setPan(this.pan != null ? this.pan.trim() : null);
        entity.setEmail(this.email != null ? this.email.trim() : null);
        entity.setPhone(this.phone != null ? this.phone.trim() : null);
        entity.setAddress(this.address != null ? this.address.trim() : null);
        if (this.isActive != null) {
            entity.setIsActive(this.isActive);
        }
    }
}
