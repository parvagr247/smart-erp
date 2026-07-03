package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

import org.hibernate.annotations.Check;

@Entity
@Table(
    name = "tax_categories",
    schema = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "taxCode"})
    },
    indexes = {
        @Index(name = "idx_tax_category_company_code", columnList = "company_id, taxCode")
    }
)
@Check(constraints = "gst_rate >= 0 AND gst_rate <= 100 AND cgst_rate >= 0 AND sgst_rate >= 0 AND igst_rate >= 0")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaxCategory extends BaseEntity {

    @Column(nullable = false)
    private String taxCode; // e.g. GST-18, GST-5

    @Column(nullable = false)
    private String name; // e.g. GST 18%

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal gstRate = BigDecimal.ZERO;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal cgstRate = BigDecimal.ZERO;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal sgstRate = BigDecimal.ZERO;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal igstRate = BigDecimal.ZERO;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal cessRate = BigDecimal.ZERO;

    private LocalDate effectiveDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}
