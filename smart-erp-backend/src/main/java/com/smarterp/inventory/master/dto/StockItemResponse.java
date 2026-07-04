package com.smarterp.inventory.master.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockItemResponse {
    private UUID id;
    private String code;
    private String name;
    private String alias;
    private String description;
    private String sku;
    private String barcode;
    private String qrCode;
    
    private UUID brandId;
    private String brandName;
    
    private UUID manufacturerId;
    private String manufacturerName;
    
    private UUID stockGroupId;
    private String stockGroupName;
    
    @Builder.Default
    private List<UUID> categoryIds = new ArrayList<>();
    @Builder.Default
    private List<String> categoryNames = new ArrayList<>();
    
    private UUID primaryUnitId;
    private String primaryUnitCode;
    
    private UUID secondaryUnitId;
    private String secondaryUnitCode;
    
    private UUID warehouseId;
    private String warehouseName;
    
    private UUID taxCategoryId;
    private String taxCategoryName;
    
    private UUID hsnId;
    private String hsnCode;
    
    private BigDecimal openingQuantity;
    private BigDecimal openingValue;
    private BigDecimal minimumStock;
    private BigDecimal maximumStock;
    private BigDecimal reorderLevel;
    private BigDecimal reorderQuantity;
    
    private BigDecimal weight;
    private String dimensions;
    private String image;
    private String notes;
    private String status;
    private String productType;
    private Boolean trackInventory;
    private String binLocation;
    
    private Boolean isBatchManaged;
    private Boolean isSerialNumberManaged;
    private Boolean hasVariants;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Builder.Default
    private List<PriceListDto> priceLists = new ArrayList<>();

    public static StockItemResponse fromEntity(com.smarterp.inventory.master.entity.StockItem item) {
        if (item == null) return null;

        java.util.List<PriceListDto> priceDtos = item.getPriceLists().stream()
                .map(pl -> PriceListDto.builder()
                        .name(pl.getName())
                        .priceType(pl.getPriceType())
                        .price(pl.getPrice())
                        .effectiveFrom(pl.getEffectiveFrom())
                        .effectiveTo(pl.getEffectiveTo())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        java.util.List<UUID> catIds = item.getCategories().stream().map(com.smarterp.inventory.master.entity.StockCategory::getId).collect(java.util.stream.Collectors.toList());
        java.util.List<String> catNames = item.getCategories().stream().map(com.smarterp.inventory.master.entity.StockCategory::getName).collect(java.util.stream.Collectors.toList());

        return StockItemResponse.builder()
                .id(item.getId())
                .code(item.getCode())
                .name(item.getName())
                .alias(item.getAlias())
                .description(item.getDescription())
                .sku(item.getSku())
                .barcode(item.getBarcode())
                .qrCode(item.getQrCode())
                .brandId(item.getBrand() != null ? item.getBrand().getId() : null)
                .brandName(item.getBrand() != null ? item.getBrand().getName() : null)
                .manufacturerId(item.getManufacturer() != null ? item.getManufacturer().getId() : null)
                .manufacturerName(item.getManufacturer() != null ? item.getManufacturer().getName() : null)
                .stockGroupId(item.getStockGroup() != null ? item.getStockGroup().getId() : null)
                .stockGroupName(item.getStockGroup() != null ? item.getStockGroup().getName() : null)
                .categoryIds(catIds)
                .categoryNames(catNames)
                .primaryUnitId(item.getPrimaryUnit() != null ? item.getPrimaryUnit().getId() : null)
                .primaryUnitCode(item.getPrimaryUnit() != null ? item.getPrimaryUnit().getCode() : null)
                .secondaryUnitId(item.getSecondaryUnit() != null ? item.getSecondaryUnit().getId() : null)
                .secondaryUnitCode(item.getSecondaryUnit() != null ? item.getSecondaryUnit().getCode() : null)
                .warehouseId(item.getWarehouse() != null ? item.getWarehouse().getId() : null)
                .warehouseName(item.getWarehouse() != null ? item.getWarehouse().getName() : null)
                .taxCategoryId(item.getTaxCategory() != null ? item.getTaxCategory().getId() : null)
                .taxCategoryName(item.getTaxCategory() != null ? item.getTaxCategory().getName() : null)
                .hsnId(item.getHsn() != null ? item.getHsn().getId() : null)
                .hsnCode(item.getHsn() != null ? item.getHsn().getHsnCode() : null)
                .openingQuantity(item.getOpeningQuantity())
                .openingValue(item.getOpeningValue())
                .minimumStock(item.getMinimumStock())
                .maximumStock(item.getMaximumStock())
                .reorderLevel(item.getReorderLevel())
                .reorderQuantity(item.getReorderQuantity())
                .weight(item.getWeight())
                .dimensions(item.getDimensions())
                .image(item.getImage())
                .notes(item.getNotes())
                .status(item.getStatus())
                .productType(item.getProductType())
                .trackInventory(item.getTrackInventory())
                .binLocation(item.getBinLocation())
                .isBatchManaged(item.getIsBatchManaged())
                .isSerialNumberManaged(item.getIsSerialNumberManaged())
                .hasVariants(item.getHasVariants())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .priceLists(priceDtos)
                .build();
    }
}
