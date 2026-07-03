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
}
