package com.smarterp.inventory.sales.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.master.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "sales",
    schema = "purchase",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "salesNumber"})
    },
    indexes = {
        @Index(name = "idx_sales_company_num", columnList = "company_id, salesNumber"),
        @Index(name = "idx_sales_date", columnList = "salesDate"),
        @Index(name = "idx_sales_customer", columnList = "customer_id"),
        @Index(name = "idx_sales_warehouse", columnList = "warehouse_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sales extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String salesNumber;

    @Column(nullable = false)
    private LocalDate salesDate;

    private LocalDate dueDate;

    private String paymentTerms;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private BusinessPartner customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SalesStatus status;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal grossAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cgst = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal sgst = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal igst = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cess = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal roundOff = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal grandTotal = BigDecimal.ZERO;

    private String notes;

    private String attachments;

    private String createdBy;

    @OneToMany(mappedBy = "sales", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SalesLine> lineItems = new ArrayList<>();
}
