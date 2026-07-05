package com.smarterp.inventory.master.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockItemRequest {
    @NotBlank(message = "Item code is required.")
    private String code;

    @NotBlank(message = "Item name is required.")
    private String name;

    private String alias;

    private String description;

    @NotBlank(message = "SKU is required.")
    private String sku;

    private String barcode;

    private String qrCode;

    private UUID brandId;

    private UUID manufacturerId;

    private UUID stockGroupId;

    @Builder.Default
    private List<UUID> categoryIds = new ArrayList<>();

    @NotNull(message = "Primary unit is required.")
    private UUID primaryUnitId;

    private UUID secondaryUnitId;

    private UUID warehouseId;

    private UUID taxCategoryId;

    private UUID hsnId;

    @Builder.Default
    private BigDecimal openingQuantity = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal openingValue = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal minimumStock = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal maximumStock = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal reorderLevel = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal reorderQuantity = BigDecimal.ZERO;

    @Builder.Default
    private BigDecimal weight = BigDecimal.ZERO;

    private String dimensions;

    private String image;

    private String notes;

    @Builder.Default
    private String status = "ACTIVE";

    @Builder.Default
    private String productType = "PHYSICAL";

    @Builder.Default
    private Boolean trackInventory = true;

    private String binLocation;

    @Builder.Default
    private Boolean isBatchManaged = false;

    @Builder.Default
    private Boolean isSerialNumberManaged = false;

    @Builder.Default
    private Boolean hasVariants = false;

    @Builder.Default
    private List<PriceListDto> priceLists = new ArrayList<>();

    public com.smarterp.inventory.master.entity.StockItem toEntity(
            com.smarterp.administration.company.entity.Company company,
            com.smarterp.inventory.master.entity.Brand brand,
            com.smarterp.inventory.master.entity.Manufacturer manufacturer,
            com.smarterp.inventory.master.entity.StockGroup stockGroup,
            com.smarterp.inventory.master.entity.Unit primaryUnit,
            com.smarterp.inventory.master.entity.Unit secondaryUnit,
            com.smarterp.inventory.master.entity.Warehouse warehouse,
            com.smarterp.inventory.master.entity.TaxCategory taxCategory,
            com.smarterp.inventory.master.entity.Hsn hsn,
            java.util.Set<com.smarterp.inventory.master.entity.StockCategory> categories) {
        
        com.smarterp.inventory.master.entity.StockItem item = com.smarterp.inventory.master.entity.StockItem.builder()
                .code(this.code.trim())
                .name(this.name.trim())
                .alias(this.alias != null ? this.alias.trim() : null)
                .description(this.description)
                .sku(this.sku.trim())
                .barcode(this.barcode)
                .qrCode(this.qrCode)
                .openingQuantity(this.openingQuantity != null ? this.openingQuantity : BigDecimal.ZERO)
                .openingValue(this.openingValue != null ? this.openingValue : BigDecimal.ZERO)
                .minimumStock(this.minimumStock != null ? this.minimumStock : BigDecimal.ZERO)
                .maximumStock(this.maximumStock != null ? this.maximumStock : BigDecimal.ZERO)
                .reorderLevel(this.reorderLevel != null ? this.reorderLevel : BigDecimal.ZERO)
                .reorderQuantity(this.reorderQuantity != null ? this.reorderQuantity : BigDecimal.ZERO)
                .weight(this.weight != null ? this.weight : BigDecimal.ZERO)
                .dimensions(this.dimensions)
                .image(this.image)
                .notes(this.notes)
                .status(this.status != null ? this.status : "ACTIVE")
                .productType(this.productType != null ? this.productType : "PHYSICAL")
                .trackInventory(this.trackInventory != null ? this.trackInventory : true)
                .binLocation(this.binLocation)
                .isBatchManaged(this.isBatchManaged != null ? this.isBatchManaged : false)
                .isSerialNumberManaged(this.isSerialNumberManaged != null ? this.isSerialNumberManaged : false)
                .hasVariants(this.hasVariants != null ? this.hasVariants : false)
                .company(company)
                .brand(brand)
                .manufacturer(manufacturer)
                .stockGroup(stockGroup)
                .primaryUnit(primaryUnit)
                .secondaryUnit(secondaryUnit)
                .warehouse(warehouse)
                .taxCategory(taxCategory)
                .hsn(hsn)
                .categories(categories)
                .build();

        if (this.priceLists != null) {
            for (PriceListDto priceDto : this.priceLists) {
                com.smarterp.inventory.master.entity.PriceList pl = com.smarterp.inventory.master.entity.PriceList.builder()
                        .name(priceDto.getName())
                        .priceType(priceDto.getPriceType())
                        .price(priceDto.getPrice())
                        .effectiveFrom(priceDto.getEffectiveFrom())
                        .effectiveTo(priceDto.getEffectiveTo())
                        .company(company)
                        .build();
                item.addPriceList(pl);
            }
        }

        return item;
    }

    public void updateEntity(
            com.smarterp.inventory.master.entity.StockItem item,
            com.smarterp.inventory.master.entity.Brand brand,
            com.smarterp.inventory.master.entity.Manufacturer manufacturer,
            com.smarterp.inventory.master.entity.StockGroup stockGroup,
            com.smarterp.inventory.master.entity.Unit primaryUnit,
            com.smarterp.inventory.master.entity.Unit secondaryUnit,
            com.smarterp.inventory.master.entity.Warehouse warehouse,
            com.smarterp.inventory.master.entity.TaxCategory taxCategory,
            com.smarterp.inventory.master.entity.Hsn hsn,
            java.util.Set<com.smarterp.inventory.master.entity.StockCategory> categories) {
        
        if (item == null) return;
        item.setCode(this.code.trim());
        item.setName(this.name.trim());
        item.setAlias(this.alias != null ? this.alias.trim() : null);
        item.setDescription(this.description);
        item.setSku(this.sku.trim());
        item.setBarcode(this.barcode);
        item.setQrCode(this.qrCode);
        item.setMinimumStock(this.minimumStock != null ? this.minimumStock : BigDecimal.ZERO);
        item.setMaximumStock(this.maximumStock != null ? this.maximumStock : BigDecimal.ZERO);
        item.setReorderLevel(this.reorderLevel != null ? this.reorderLevel : BigDecimal.ZERO);
        item.setReorderQuantity(this.reorderQuantity != null ? this.reorderQuantity : BigDecimal.ZERO);
        item.setWeight(this.weight != null ? this.weight : BigDecimal.ZERO);
        item.setDimensions(this.dimensions);
        item.setImage(this.image);
        item.setNotes(this.notes);
        if (this.status != null) {
            item.setStatus(this.status);
        }
        item.setProductType(this.productType != null ? this.productType : "PHYSICAL");
        item.setTrackInventory(this.trackInventory != null ? this.trackInventory : true);
        item.setBinLocation(this.binLocation);
        item.setIsBatchManaged(this.isBatchManaged != null ? this.isBatchManaged : false);
        item.setIsSerialNumberManaged(this.isSerialNumberManaged != null ? this.isSerialNumberManaged : false);
        item.setHasVariants(this.hasVariants != null ? this.hasVariants : false);

        item.setBrand(brand);
        item.setManufacturer(manufacturer);
        item.setStockGroup(stockGroup);
        item.setPrimaryUnit(primaryUnit);
        item.setSecondaryUnit(secondaryUnit);
        item.setWarehouse(warehouse);
        item.setTaxCategory(taxCategory);
        item.setHsn(hsn);

        item.getCategories().clear();
        if (categories != null) {
            item.getCategories().addAll(categories);
        }

        item.getPriceLists().clear();
        if (this.priceLists != null) {
            for (PriceListDto priceDto : this.priceLists) {
                com.smarterp.inventory.master.entity.PriceList pl = com.smarterp.inventory.master.entity.PriceList.builder()
                        .name(priceDto.getName())
                        .priceType(priceDto.getPriceType())
                        .price(priceDto.getPrice())
                        .effectiveFrom(priceDto.getEffectiveFrom())
                        .effectiveTo(priceDto.getEffectiveTo())
                        .company(item.getCompany())
                        .build();
                item.addPriceList(pl);
            }
        }
    }
}
