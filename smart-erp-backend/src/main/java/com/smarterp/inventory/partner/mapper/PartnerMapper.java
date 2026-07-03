package com.smarterp.inventory.partner.mapper;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.partner.dto.AddressDto;
import com.smarterp.inventory.partner.dto.PartnerContactDto;
import com.smarterp.inventory.partner.dto.PartnerRequest;
import com.smarterp.inventory.partner.dto.PartnerResponse;
import com.smarterp.inventory.partner.entity.Address;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.entity.PartnerContact;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PartnerMapper {

    public BusinessPartner toEntity(PartnerRequest request, Company company) {
        if (request == null) return null;

        BusinessPartner partner = BusinessPartner.builder()
                .code(request.getCode().trim())
                .name(request.getName().trim())
                .type(request.getType())
                .gstNumber(request.getGstNumber() != null ? request.getGstNumber().trim().toUpperCase() : null)
                .pan(request.getPan() != null ? request.getPan().trim().toUpperCase() : null)
                .email(request.getEmail() != null ? request.getEmail().trim() : null)
                .phone(request.getPhone())
                .mobile(request.getMobile())
                .website(request.getWebsite())
                .creditLimit(request.getCreditLimit() != null ? request.getCreditLimit() : BigDecimal.ZERO)
                .openingBalance(request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO)
                .balanceType(request.getBalanceType())
                .paymentTerms(request.getPaymentTerms())
                .status(request.getStatus() != null ? request.getStatus() : com.smarterp.inventory.partner.entity.PartnerStatus.ACTIVE)
                .notes(request.getNotes())
                .company(company)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        if (request.getAddresses() != null) {
            for (AddressDto addrDto : request.getAddresses()) {
                Address address = Address.builder()
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

        if (request.getContacts() != null) {
            for (PartnerContactDto contactDto : request.getContacts()) {
                PartnerContact contact = PartnerContact.builder()
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

    public void updateEntity(BusinessPartner partner, PartnerRequest request) {
        if (request == null || partner == null) return;

        partner.setCode(request.getCode().trim());
        partner.setName(request.getName().trim());
        partner.setType(request.getType());
        partner.setGstNumber(request.getGstNumber() != null ? request.getGstNumber().trim().toUpperCase() : null);
        partner.setPan(request.getPan() != null ? request.getPan().trim().toUpperCase() : null);
        partner.setEmail(request.getEmail() != null ? request.getEmail().trim() : null);
        partner.setPhone(request.getPhone());
        partner.setMobile(request.getMobile());
        partner.setWebsite(request.getWebsite());
        partner.setCreditLimit(request.getCreditLimit() != null ? request.getCreditLimit() : BigDecimal.ZERO);
        partner.setOpeningBalance(request.getOpeningBalance() != null ? request.getOpeningBalance() : BigDecimal.ZERO);
        partner.setBalanceType(request.getBalanceType());
        partner.setPaymentTerms(request.getPaymentTerms());
        if (request.getStatus() != null) {
            partner.setStatus(request.getStatus());
        }
        partner.setNotes(request.getNotes());
        if (request.getIsActive() != null) {
            partner.setIsActive(request.getIsActive());
        }

        // Update Addresses
        partner.getAddresses().clear();
        if (request.getAddresses() != null) {
            for (AddressDto addrDto : request.getAddresses()) {
                Address address = Address.builder()
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

        // Update Contacts
        partner.getContacts().clear();
        if (request.getContacts() != null) {
            for (PartnerContactDto contactDto : request.getContacts()) {
                PartnerContact contact = PartnerContact.builder()
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

    public PartnerResponse toResponse(BusinessPartner partner) {
        if (partner == null) return null;

        List<AddressDto> addressDtos = partner.getAddresses().stream()
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
                .collect(Collectors.toList());

        List<PartnerContactDto> contactDtos = partner.getContacts().stream()
                .map(c -> PartnerContactDto.builder()
                        .id(c.getId())
                        .contactName(c.getContactName())
                        .designation(c.getDesignation())
                        .email(c.getEmail())
                        .phone(c.getPhone())
                        .mobile(c.getMobile())
                        .isPrimary(c.getIsPrimary())
                        .build())
                .collect(Collectors.toList());

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
