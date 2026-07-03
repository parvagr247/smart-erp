package com.smarterp.accounting.group.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "ledger_groups",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_group_company_name", columnNames = {"company_id", "name"})
    },
    indexes = {
        @Index(name = "idx_group_company_id", columnList = "company_id"),
        @Index(name = "idx_group_name", columnList = "name")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountGroup extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GroupNature nature;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_group_id")
    private AccountGroup parentGroup;

    @Column(length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSystemGenerated = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
