package com.smarterp.inventory.partner.entity;

import com.smarterp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "partner_contacts",
    schema = "partner",
    indexes = {
        @Index(name = "idx_contact_partner_id", columnList = "business_partner_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerContact extends BaseEntity {

    @Column(nullable = false)
    private String contactName;

    private String designation;

    private String email;

    private String phone;

    private String mobile;

    @Builder.Default
    private Boolean isPrimary = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_partner_id", nullable = false)
    private BusinessPartner businessPartner;
}
