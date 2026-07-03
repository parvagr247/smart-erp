package com.smarterp.inventory.master.mapper;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.dto.PriceListDto;
import com.smarterp.inventory.master.dto.StockItemRequest;
import com.smarterp.inventory.master.dto.StockItemResponse;
import com.smarterp.inventory.master.entity.*;
import com.smarterp.inventory.master.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class StockItemMapper {

    private final BrandRepository brandRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final StockGroupRepository stockGroupRepository;
    private final StockCategoryRepository stockCategoryRepository;
    private final UnitRepository unitRepository;
    private final WarehouseRepository warehouseRepository;
    private final TaxCategoryRepository taxCategoryRepository;
    private final HsnRepository hsnRepository;

    public StockItem toEntity(StockItemRequest request, Company company) {
        if (request == null) return null;

        StockItem item = StockItem.builder()
                .code(request.getCode().trim())
                .name(request.getName().trim())
                .alias(request.getAlias() != null ? request.getAlias().trim() : null)
                .description(request.getDescription())
                .sku(request.getSku().trim())
                .barcode(request.getBarcode())
                .qrCode(request.getQrCode())
                .openingQuantity(request.getOpeningQuantity() != null ? request.getOpeningQuantity() : BigDecimal.ZERO)
                .openingValue(request.getOpeningValue() != null ? request.getOpeningValue() : BigDecimal.ZERO)
                .minimumStock(request.getMinimumStock() != null ? request.getMinimumStock() : BigDecimal.ZERO)
                .maximumStock(request.getMaximumStock() != null ? request.getMaximumStock() : BigDecimal.ZERO)
                .reorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : BigDecimal.ZERO)
                .reorderQuantity(request.getReorderQuantity() != null ? request.getReorderQuantity() : BigDecimal.ZERO)
                .weight(request.getWeight() != null ? request.getWeight() : BigDecimal.ZERO)
                .dimensions(request.getDimensions())
                .image(request.getImage())
                .notes(request.getNotes())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .isBatchManaged(request.getIsBatchManaged() != null ? request.getIsBatchManaged() : false)
                .isSerialNumberManaged(request.getIsSerialNumberManaged() != null ? request.getIsSerialNumberManaged() : false)
                .hasVariants(request.getHasVariants() != null ? request.getHasVariants() : false)
                .company(company)
                .build();

        // Map Relations
        if (request.getBrandId() != null) {
            item.setBrand(brandRepository.findById(request.getBrandId()).orElse(null));
        }
        if (request.getManufacturerId() != null) {
            item.setManufacturer(manufacturerRepository.findById(request.getManufacturerId()).orElse(null));
        }
        if (request.getStockGroupId() != null) {
            item.setStockGroup(stockGroupRepository.findById(request.getStockGroupId()).orElse(null));
        }
        if (request.getPrimaryUnitId() != null) {
            item.setPrimaryUnit(unitRepository.findById(request.getPrimaryUnitId()).orElse(null));
        }
        if (request.getSecondaryUnitId() != null) {
            item.setSecondaryUnit(unitRepository.findById(request.getSecondaryUnitId()).orElse(null));
        }
        if (request.getWarehouseId() != null) {
            item.setWarehouse(warehouseRepository.findById(request.getWarehouseId()).orElse(null));
        }
        if (request.getTaxCategoryId() != null) {
            item.setTaxCategory(taxCategoryRepository.findById(request.getTaxCategoryId()).orElse(null));
        }
        if (request.getHsnId() != null) {
            item.setHsn(hsnRepository.findById(request.getHsnId()).orElse(null));
        }

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            item.setCategories(new HashSet<>(stockCategoryRepository.findAllById(request.getCategoryIds())));
        }

        if (request.getPriceLists() != null) {
            for (PriceListDto priceDto : request.getPriceLists()) {
                PriceList pl = PriceList.builder()
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

    public void updateEntity(StockItem item, StockItemRequest request) {
        if (request == null || item == null) return;

        item.setCode(request.getCode().trim());
        item.setName(request.getName().trim());
        item.setAlias(request.getAlias() != null ? request.getAlias().trim() : null);
        item.setDescription(request.getDescription());
        item.setSku(request.getSku().trim());
        item.setBarcode(request.getBarcode());
        item.setQrCode(request.getQrCode());
        item.setOpeningQuantity(request.getOpeningQuantity() != null ? request.getOpeningQuantity() : BigDecimal.ZERO);
        item.setOpeningValue(request.getOpeningValue() != null ? request.getOpeningValue() : BigDecimal.ZERO);
        item.setMinimumStock(request.getMinimumStock() != null ? request.getMinimumStock() : BigDecimal.ZERO);
        item.setMaximumStock(request.getMaximumStock() != null ? request.getMaximumStock() : BigDecimal.ZERO);
        item.setReorderLevel(request.getReorderLevel() != null ? request.getReorderLevel() : BigDecimal.ZERO);
        item.setReorderQuantity(request.getReorderQuantity() != null ? request.getReorderQuantity() : BigDecimal.ZERO);
        item.setWeight(request.getWeight() != null ? request.getWeight() : BigDecimal.ZERO);
        item.setDimensions(request.getDimensions());
        item.setImage(request.getImage());
        item.setNotes(request.getNotes());
        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }
        item.setIsBatchManaged(request.getIsBatchManaged() != null ? request.getIsBatchManaged() : false);
        item.setIsSerialNumberManaged(request.getIsSerialNumberManaged() != null ? request.getIsSerialNumberManaged() : false);
        item.setHasVariants(request.getHasVariants() != null ? request.getHasVariants() : false);

        // Update relations
        item.setBrand(request.getBrandId() != null ? brandRepository.findById(request.getBrandId()).orElse(null) : null);
        item.setManufacturer(request.getManufacturerId() != null ? manufacturerRepository.findById(request.getManufacturerId()).orElse(null) : null);
        item.setStockGroup(request.getStockGroupId() != null ? stockGroupRepository.findById(request.getStockGroupId()).orElse(null) : null);
        item.setPrimaryUnit(request.getPrimaryUnitId() != null ? unitRepository.findById(request.getPrimaryUnitId()).orElse(null) : null);
        item.setSecondaryUnit(request.getSecondaryUnitId() != null ? unitRepository.findById(request.getSecondaryUnitId()).orElse(null) : null);
        item.setWarehouse(request.getWarehouseId() != null ? warehouseRepository.findById(request.getWarehouseId()).orElse(null) : null);
        item.setTaxCategory(request.getTaxCategoryId() != null ? taxCategoryRepository.findById(request.getTaxCategoryId()).orElse(null) : null);
        item.setHsn(request.getHsnId() != null ? hsnRepository.findById(request.getHsnId()).orElse(null) : null);

        item.getCategories().clear();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            item.getCategories().addAll(stockCategoryRepository.findAllById(request.getCategoryIds()));
        }

        item.getPriceLists().clear();
        if (request.getPriceLists() != null) {
            for (PriceListDto priceDto : request.getPriceLists()) {
                PriceList pl = PriceList.builder()
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

    public StockItemResponse toResponse(StockItem item) {
        if (item == null) return null;

        List<PriceListDto> priceDtos = item.getPriceLists().stream()
                .map(pl -> PriceListDto.builder()
                        .name(pl.getName())
                        .priceType(pl.getPriceType())
                        .price(pl.getPrice())
                        .effectiveFrom(pl.getEffectiveFrom())
                        .effectiveTo(pl.getEffectiveTo())
                        .build())
                .collect(Collectors.toList());

        List<UUID> catIds = item.getCategories().stream().map(StockCategory::getId).collect(Collectors.toList());
        List<String> catNames = item.getCategories().stream().map(StockCategory::getName).collect(Collectors.toList());

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
                .isBatchManaged(item.getIsBatchManaged())
                .isSerialNumberManaged(item.getIsSerialNumberManaged())
                .hasVariants(item.getHasVariants())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .priceLists(priceDtos)
                .build();
    }
}
