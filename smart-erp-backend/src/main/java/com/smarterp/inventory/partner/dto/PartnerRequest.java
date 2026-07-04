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

    public com.smarterp.inventory.partner.entity.BusinessPartner toEntity(com.smarterp.administration.company.entity.Company company) {
        com.smarterp.inventory.partner.entity.BusinessPartner partner = com.smarterp.inventory.partner.entity.BusinessPartner.builder()
                .code(this.code.trim())
                .name(this.name.trim())
                .type(this.type)
                .gstNumber(this.gstNumber != null ? this.gstNumber.trim().toUpperCase() : null)
                .pan(this.pan != null ? this.pan.trim().toUpperCase() : null)
                .email(this.email != null ? this.email.trim() : null)
                .phone(this.phone)
                .mobile(this.mobile)
                .website(this.website)
                .creditLimit(this.creditLimit != null ? this.creditLimit : BigDecimal.ZERO)
                .openingBalance(this.openingBalance != null ? this.openingBalance : BigDecimal.ZERO)
                .balanceType(this.balanceType)
                .paymentTerms(this.paymentTerms)
                .status(this.status != null ? this.status : com.smarterp.inventory.partner.entity.PartnerStatus.ACTIVE)
                .notes(this.notes)
                .company(company)
                .isActive(this.isActive != null ? this.isActive : true)
                .build();

        if (this.addresses != null) {
            for (AddressDto addrDto : this.addresses) {
                com.smarterp.inventory.partner.entity.Address address = com.smarterp.inventory.partner.entity.Address.builder()
                        .addressType(addrDto.getAddressType())
                        .addressLine1(addrDto.getAddressLine1())
                        .addressLine2(addrDto.getAddressLine2())
                        .city(addrDto.getCity())
                        .state(addrDto.getState())
                        .country(addrDto.getCountry())
                        .pincode(addrDto.getPincode())
                        .build();
                partner.addAddress(address);
            }
        }

        if (this.contacts != null) {
            for (PartnerContactDto contactDto : this.contacts) {
                com.smarterp.inventory.partner.entity.PartnerContact contact = com.smarterp.inventory.partner.entity.PartnerContact.builder()
                        .contactName(contactDto.getContactName())
                        .designation(contactDto.getDesignation())
                        .email(contactDto.getEmail())
                        .phone(contactDto.getPhone())
                        .mobile(contactDto.getMobile())
                        .isPrimary(contactDto.getIsPrimary() != null ? contactDto.getIsPrimary() : false)
                        .build();
                partner.addContact(contact);
            }
        }

        return partner;
    }

    public void updateEntity(com.smarterp.inventory.partner.entity.BusinessPartner partner) {
        if (partner == null) return;

        partner.setCode(this.code.trim());
        partner.setName(this.name.trim());
        partner.setType(this.type);
        partner.setGstNumber(this.gstNumber != null ? this.gstNumber.trim().toUpperCase() : null);
        partner.setPan(this.pan != null ? this.pan.trim().toUpperCase() : null);
        partner.setEmail(this.email != null ? this.email.trim() : null);
        partner.setPhone(this.phone);
        partner.setMobile(this.mobile);
        partner.setWebsite(this.website);
        partner.setCreditLimit(this.creditLimit != null ? this.creditLimit : BigDecimal.ZERO);
        partner.setOpeningBalance(this.openingBalance != null ? this.openingBalance : BigDecimal.ZERO);
        partner.setBalanceType(this.balanceType);
        partner.setPaymentTerms(this.paymentTerms);
        if (this.status != null) {
            partner.setStatus(this.status);
        }
        partner.setNotes(this.notes);
        if (this.isActive != null) {
            partner.setIsActive(this.isActive);
        }

        partner.getAddresses().clear();
        if (this.addresses != null) {
            for (AddressDto addrDto : this.addresses) {
                com.smarterp.inventory.partner.entity.Address address = com.smarterp.inventory.partner.entity.Address.builder()
                        .addressType(addrDto.getAddressType())
                        .addressLine1(addrDto.getAddressLine1())
                        .addressLine2(addrDto.getAddressLine2())
                        .city(addrDto.getCity())
                        .state(addrDto.getState())
                        .country(addrDto.getCountry())
                        .pincode(addrDto.getPincode())
                        .build();
                partner.addAddress(address);
            }
        }

        partner.getContacts().clear();
        if (this.contacts != null) {
            for (PartnerContactDto contactDto : this.contacts) {
                com.smarterp.inventory.partner.entity.PartnerContact contact = com.smarterp.inventory.partner.entity.PartnerContact.builder()
                        .contactName(contactDto.getContactName())
                        .designation(contactDto.getDesignation())
                        .email(contactDto.getEmail())
                        .phone(contactDto.getPhone())
                        .mobile(contactDto.getMobile())
                        .isPrimary(contactDto.getIsPrimary() != null ? contactDto.getIsPrimary() : false)
                        .build();
                partner.addContact(contact);
            }
        }
    }
}
