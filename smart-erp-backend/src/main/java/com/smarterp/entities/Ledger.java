package com.smarterp.entities;


import com.smarterp.entities.enums.LedgerType;
import com.smarterp.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "ledgers",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"company_id", "ledger_name"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ledger extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String ledgerName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LedgerType ledgerType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ledger_group_id", nullable = false)
    private AccountGroup ledgerGroup;

    private BigDecimal openingBalance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

}
