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
    
    private Boolean isBatchManaged;
    private Boolean isSerialNumberManaged;
    private Boolean hasVariants;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Builder.Default
    private List<PriceListDto> priceLists = new ArrayList<>();
}
