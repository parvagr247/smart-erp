package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "hsn_masters",
    schema = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "hsnCode"})
    },
    indexes = {
        @Index(name = "idx_hsn_company_code", columnList = "company_id, hsnCode")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hsn extends BaseEntity {

    @Column(nullable = false)
    private String hsnCode; // e.g. 84713010

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tax_category_id")
    private TaxCategory taxCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
