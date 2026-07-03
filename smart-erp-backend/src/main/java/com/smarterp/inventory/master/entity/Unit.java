package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "item_units",
    schema = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "code"})
    },
    indexes = {
        @Index(name = "idx_unit_company_code", columnList = "company_id, code")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Unit extends BaseEntity {

    @Column(nullable = false)
    private String code; // e.g. PCS, BOX, KG

    @Column(nullable = false)
    private String name; // e.g. Pieces, Box, Kilograms

    private String abbreviation;

    @Column(nullable = false)
    @Builder.Default
    private Integer decimalPrecision = 0;

    @Builder.Default
    private Boolean isSystemDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
