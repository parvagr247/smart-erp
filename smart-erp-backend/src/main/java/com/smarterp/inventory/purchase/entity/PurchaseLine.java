package com.smarterp.inventory.purchase.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.inventory.master.entity.StockItem;
import com.smarterp.inventory.master.entity.Warehouse;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "purchase_line_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", nullable = false)
    private Purchase purchase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_item_id", nullable = false)
    private StockItem stockItem;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal quantity;

    @Column(nullable = false, precision = 15, scale = 4)
    private BigDecimal rate;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO; // flat discount amount

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal taxPercentage = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @Column(length = 50)
    private String batchNumber;
}
