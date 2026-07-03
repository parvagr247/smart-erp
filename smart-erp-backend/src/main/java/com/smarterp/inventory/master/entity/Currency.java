package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "currencies",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "code"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Currency extends BaseEntity {

    @Column(nullable = false)
    private String code; // e.g. INR, USD

    @Column(nullable = false)
    private String symbol; // e.g. ₹, $

    @Column(nullable = false)
    @Builder.Default
    private Integer decimalPrecision = 2;

    @Column(nullable = false, precision = 15, scale = 6)
    @Builder.Default
    private BigDecimal exchangeRate = BigDecimal.ONE;

    @Builder.Default
    private Boolean isDefault = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
