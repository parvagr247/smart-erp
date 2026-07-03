package com.smarterp.accounting.ledger.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.group.entity.AccountGroup;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "ledgers",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_ledger_company_name", columnNames = {"company_id", "name"})
    },
    indexes = {
        @Index(name = "idx_ledger_company_id", columnList = "company_id"),
        @Index(name = "idx_ledger_name", columnList = "name")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ledger extends BaseEntity {

    @Column(nullable = false, length = 100)
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
