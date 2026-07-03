package com.smarterp.company.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCompanyRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "GST Number is required")
    @Pattern(
        regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
        message = "Invalid GST Number format. Must be a valid 15-digit Indian GSTIN."
    )
    private String gstNumber;

    @NotBlank(message = "PAN Number is required")
    @Pattern(
        regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
        message = "Invalid PAN Number format. Must be a valid 10-digit PAN."
    )
    private String panNumber;

    @NotBlank(message = "Financial Year is required")
    @Pattern(
        regexp = "^[0-9]{4}-[0-9]{4}$",
        message = "Invalid Financial Year format. Must be YYYY-YYYY (e.g. 2026-2027)."
    )
    private String financialYear;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private String country;
    private String pincode;
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    private String currency;
    private String logo;

    @NotNull(message = "Version is required for concurrency control")
    private Long version;
}
