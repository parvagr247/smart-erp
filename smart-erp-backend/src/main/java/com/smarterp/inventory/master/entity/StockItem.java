package com.smarterp.inventory.master.entity;

import com.smarterp.common.entity.BaseEntity;
import com.smarterp.administration.company.entity.Company;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.Check;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(
    name = "stock_items",
    schema = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"company_id", "code"}),
        @UniqueConstraint(columnNames = {"company_id", "sku"})
    },
    indexes = {
        @Index(name = "idx_item_company_code", columnList = "company_id, code"),
        @Index(name = "idx_item_company_name", columnList = "company_id, name"),
        @Index(name = "idx_item_sku", columnList = "company_id, sku"),
        @Index(name = "idx_item_barcode", columnList = "company_id, barcode")
    }
)
@SQLDelete(sql = "UPDATE stock_items SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Check(constraints = "reorder_level >= 0 AND opening_quantity >= 0 AND current_quantity >= 0 AND average_cost >= 0")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockItem extends BaseEntity {

    @Column(nullable = false)
    private String code; // Unique within company

    @Column(nullable = false)
    private String name;

    private String alias;

    private String description;

    @Column(nullable = false)
    private String sku; // Stock Keeping Unit, unique within company

    private String barcode;

    private String qrCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manufacturer_id")
    private Manufacturer manufacturer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_group_id")
    private StockGroup stockGroup;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "stock_item_categories_mapping",
        schema = "inventory",
        joinColumns = @JoinColumn(name = "stock_item_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @Builder.Default
    private Set<StockCategory> categories = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_unit_id", nullable = false)
    private Unit primaryUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "secondary_unit_id")
    private Unit secondaryUnit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tax_category_id")
    private TaxCategory taxCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hsn_id")
    private Hsn hsn;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal openingQuantity = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal openingValue = BigDecimal.ZERO;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal currentQuantity = BigDecimal.ZERO;

    @Column(precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal averageCost = BigDecimal.ZERO;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal minimumStock = BigDecimal.ZERO;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal maximumStock = BigDecimal.ZERO;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal reorderLevel = BigDecimal.ZERO;

    @Column(precision = 15, scale = 4)
    @Builder.Default
    private BigDecimal reorderQuantity = BigDecimal.ZERO;

    @Column(precision = 10, scale = 4)
    @Builder.Default
    private BigDecimal weight = BigDecimal.ZERO;

    private String dimensions; // L x W x H

    private String image; // URL or File path

    @Lob
    private String notes;

    @Column(nullable = false)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, BLOCKED

    @Builder.Default
    private Boolean isBatchManaged = false;

    @Builder.Default
    private Boolean isSerialNumberManaged = false;

    @Builder.Default
    private Boolean hasVariants = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @OneToMany(mappedBy = "stockItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ItemVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "stockItem", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PriceList> priceLists = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "stock_item_tags_mapping",
        schema = "inventory",
        joinColumns = @JoinColumn(name = "stock_item_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    public void addVariant(ItemVariant variant) {
        variants.add(variant);
        variant.setStockItem(this);
    }

    public void removeVariant(ItemVariant variant) {
        variants.remove(variant);
        variant.setStockItem(null);
    }

    public void addPriceList(PriceList priceList) {
        priceLists.add(priceList);
        priceList.setStockItem(this);
    }

    public void removePriceList(PriceList priceList) {
        priceLists.remove(priceList);
        priceList.setStockItem(null);
    }
}
