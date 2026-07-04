package com.smarterp.inventory.master.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.dto.*;
import com.smarterp.inventory.master.entity.*;
import java.util.List;
import java.util.UUID;

public interface InventoryLookupService {
    // Brands
    List<Brand> getBrands(Company company);
    Brand createBrand(GenericLookupRequest request, Company company);
    void deleteBrand(UUID id, Company company);

    // Manufacturers
    List<Manufacturer> getManufacturers(Company company);
    Manufacturer createManufacturer(GenericLookupRequest request, Company company);
    void deleteManufacturer(UUID id, Company company);

    // StockCategories
    List<StockCategory> getCategories(Company company);
    StockCategory createCategory(GenericLookupRequest request, Company company);
    void deleteCategory(UUID id, Company company);

    // StockGroups
    List<StockGroup> getGroups(Company company);
    StockGroup createGroup(GenericLookupRequest request, Company company);
    void deleteGroup(UUID id, Company company);

    // Units
    List<Unit> getUnits(Company company);
    Unit createUnit(UnitRequest request, Company company);
    void deleteUnit(UUID id, Company company);

    // Warehouses
    List<Warehouse> getWarehouses(Company company);
    Warehouse createWarehouse(WarehouseRequest request, Company company);
    void deleteWarehouse(UUID id, Company company);

    // TaxCategories
    List<TaxCategory> getTaxCategories(Company company);
    TaxCategory createTaxCategory(TaxCategoryRequest request, Company company);
    void deleteTaxCategory(UUID id, Company company);

    // Hsn
    List<Hsn> getHsns(Company company);
    Hsn createHsn(HsnRequest request, Company company);
    void deleteHsn(UUID id, Company company);
}
