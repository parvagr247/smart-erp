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
    private Boolean isBatchManaged = false;

    @Builder.Default
    private Boolean isSerialNumberManaged = false;

    @Builder.Default
    private Boolean hasVariants = false;

    @Builder.Default
    private List<PriceListDto> priceLists = new ArrayList<>();
}
