package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(
    name = "item_variants",
    schema = "inventory"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemVariant extends BaseEntity {

    @Column(nullable = false)
    private String attributeName; // e.g. RAM, Storage, Color

    @Column(nullable = false)
    private String attributeValue; // e.g. 16GB, 512GB, Blue

    private String sku;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal priceAdjustment = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_item_id", nullable = false)
    private StockItem stockItem;
}
