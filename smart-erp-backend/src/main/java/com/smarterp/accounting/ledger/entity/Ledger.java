package com.smarterp.accounting.ledger.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.group.entity.AccountGroup;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "ledgers",
    schema = "accounting",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_ledger_company_name", columnNames = {"company_id", "ledger_name"})
    },
    indexes = {
        @Index(name = "idx_ledger_company_id", columnList = "company_id"),
        @Index(name = "idx_ledger_name", columnList = "ledger_name"),
        @Index(name = "idx_ledger_email", columnList = "email"),
        @Index(name = "idx_ledger_phone", columnList = "phone"),
        @Index(name = "idx_ledger_gst_number", columnList = "gstNumber"),
        @Index(name = "idx_ledger_pan", columnList = "pan"),
        @Index(name = "idx_ledger_group_id", columnList = "ledger_group_id")
    }
)
@SQLDelete(sql = "UPDATE ledgers SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ledger extends BaseEntity {

    @Column(name = "ledger_name", nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ledger_group_id", nullable = false)
    private AccountGroup group;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal openingBalance = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private BalanceType balanceType;

    @Column(nullable = false)
    @Builder.Default
    private Boolean gstApplicable = false;

    @Column(length = 15)
    private String gstNumber;

    @Column(length = 10)
    private String pan;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
