package com.smarterp.inventory.partner.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.Check;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "business_partners",
    schema = "partner",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "code"})
    },
    indexes = {
        @Index(name = "idx_partner_company_code", columnList = "company_id, code"),
        @Index(name = "idx_partner_company_name", columnList = "company_id, name"),
        @Index(name = "idx_partner_email", columnList = "email"),
        @Index(name = "idx_partner_phone", columnList = "phone"),
        @Index(name = "idx_partner_gst_number", columnList = "gstNumber")
    }
)
@SQLDelete(sql = "UPDATE business_partners SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Check(constraints = "credit_limit >= 0")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessPartner extends BaseEntity {

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartnerType type;

    private String gstNumber;

    private String pan;

    private String email;

    private String phone;

    private String mobile;

    private String website;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal creditLimit = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal outstandingBalance = BigDecimal.ZERO;

    private LocalDate lastPurchaseDate;

    @Enumerated(EnumType.STRING)
    private BalanceType balanceType;

    private String paymentTerms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PartnerStatus status = PartnerStatus.ACTIVE;

    @Lob
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Builder.Default
    private Boolean isActive = true;

    @OneToMany(mappedBy = "businessPartner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Address> addresses = new ArrayList<>();

    @OneToMany(mappedBy = "businessPartner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PartnerContact> contacts = new ArrayList<>();

    public void addAddress(Address address) {
        addresses.add(address);
        address.setBusinessPartner(this);
    }

    public void removeAddress(Address address) {
        addresses.remove(address);
        address.setBusinessPartner(null);
    }

    public void addContact(PartnerContact contact) {
        contacts.add(contact);
        contact.setBusinessPartner(this);
    }

    public void removeContact(PartnerContact contact) {
        contacts.remove(contact);
        contact.setBusinessPartner(null);
    }
}
