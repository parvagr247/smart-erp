package com.smarterp.inventory.purchase.entity;

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

import org.hibernate.annotations.Check;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "purchases",
    schema = "purchase",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "purchaseNumber"})
    },
    indexes = {
        @Index(name = "idx_purchase_company_num", columnList = "company_id, purchaseNumber"),
        @Index(name = "idx_purchase_date", columnList = "purchaseDate"),
        @Index(name = "idx_purchase_supplier", columnList = "supplier_id"),
        @Index(name = "idx_purchase_warehouse", columnList = "warehouse_id")
    }
)
@SQLDelete(sql = "UPDATE purchases SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Check(constraints = "grand_total >= 0 AND discount_amount >= 0 AND tax_amount >= 0")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Purchase extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String purchaseNumber;

    @Column(nullable = false)
    private LocalDate purchaseDate;

    private LocalDate dueDate;

    @Column(length = 100)
    private String paymentTerms;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id", nullable = false)
    private BusinessPartner supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PurchaseStatus status;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal grossAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cgst = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal sgst = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal igst = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal cess = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal roundOff = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @Lob
    private String notes;

    @Lob
    private String attachments; // Comma-separated paths or URLs

    @Column(nullable = false, length = 100)
    private String createdBy;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PurchaseLine> lineItems = new ArrayList<>();

    public void addLineItem(PurchaseLine item) {
        lineItems.add(item);
        item.setPurchase(this);
    }

    public void removeLineItem(PurchaseLine item) {
        lineItems.remove(item);
        item.setPurchase(null);
    }
}
