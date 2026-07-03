package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "item_discount_rules",
    schema = "inventory"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountRule extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String ruleType; // PERCENTAGE, FLAT, PARTNER_BASED, ITEM_BASED, INVOICE_BASED

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountValue = BigDecimal.ZERO;

    private LocalDateTime effectiveFrom;

    private LocalDateTime effectiveTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
