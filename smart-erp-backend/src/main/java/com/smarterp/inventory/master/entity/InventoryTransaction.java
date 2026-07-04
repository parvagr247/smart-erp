package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
    name = "inventory_transactions",
    schema = "inventory",
    indexes = {
        @Index(name = "idx_inv_tx_company", columnList = "company_id"),
        @Index(name = "idx_inv_tx_item", columnList = "stock_item_id"),
        @Index(name = "idx_inv_tx_warehouse", columnList = "warehouse_id"),
        @Index(name = "idx_inv_tx_type", columnList = "transactionType")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_item_id", nullable = false)
    private StockItem stockItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_warehouse_id")
    private Warehouse targetWarehouse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InventoryTransactionType transactionType;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal quantity;

    @Column(precision = 15, scale = 4)
    private BigDecimal rate;

    @Column(nullable = false)
    private String referenceNumber;

    @Column(nullable = false)
    private LocalDate transactionDate;

    private String notes;
    private String performedBy;
}
