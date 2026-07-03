package com.smarterp.accounting.group.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "ledger_groups",
    schema = "accounting",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_group_company_name", columnNames = {"company_id", "group_name"})
    },
    indexes = {
        @Index(name = "idx_group_company_id", columnList = "company_id"),
        @Index(name = "idx_group_name", columnList = "group_name")
    }
)
@SQLDelete(sql = "UPDATE ledger_groups SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountGroup extends BaseEntity {

    @Column(name = "group_name", nullable = false, length = 100)
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
