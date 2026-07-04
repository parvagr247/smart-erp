package com.smarterp.inventory.master.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.BusinessValidationException;
import com.smarterp.inventory.master.dto.*;
import com.smarterp.inventory.master.entity.*;
import com.smarterp.inventory.master.repository.*;
import com.smarterp.inventory.master.service.InventoryLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryLookupServiceImpl implements InventoryLookupService {

    private final BrandRepository brandRepository;
    private final ManufacturerRepository manufacturerRepository;
    private final StockCategoryRepository stockCategoryRepository;
    private final StockGroupRepository stockGroupRepository;
    private final UnitRepository unitRepository;
    private final WarehouseRepository warehouseRepository;
    private final TaxCategoryRepository taxCategoryRepository;
    private final HsnRepository hsnRepository;
    private final com.smarterp.common.audit.AuditLogService auditLogService;

    // ==========================================================================
    // Brands
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "brands", key = "#company.id")
    public List<Brand> getBrands(Company company) {
        return brandRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "brands", key = "#company.id")
    public Brand createBrand(GenericLookupRequest request, Company company) {
        if (brandRepository.existsByCompanyAndName(company, request.getName().trim())) {
            throw new BusinessValidationException("Brand name already exists.");
        }
        Brand brand = Brand.builder()
                .name(request.getName().trim())
                .company(company)
                .build();
        return brandRepository.save(brand);
    }

    @Override
    @CacheEvict(value = "brands", key = "#company.id")
    public void deleteBrand(UUID id, Company company) {
        brandRepository.deleteById(id);
    }

    // ==========================================================================
    // Manufacturers
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "manufacturers", key = "#company.id")
    public List<Manufacturer> getManufacturers(Company company) {
        return manufacturerRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "manufacturers", key = "#company.id")
    public Manufacturer createManufacturer(GenericLookupRequest request, Company company) {
        if (manufacturerRepository.existsByCompanyAndName(company, request.getName().trim())) {
            throw new BusinessValidationException("Manufacturer name already exists.");
        }
        Manufacturer manufacturer = Manufacturer.builder()
                .name(request.getName().trim())
                .company(company)
                .build();
        return manufacturerRepository.save(manufacturer);
    }

    @Override
    @CacheEvict(value = "manufacturers", key = "#company.id")
    public void deleteManufacturer(UUID id, Company company) {
        manufacturerRepository.deleteById(id);
    }

    // ==========================================================================
    // StockCategories
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "categories", key = "#company.id")
    public List<StockCategory> getCategories(Company company) {
        return stockCategoryRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "categories", key = "#company.id")
    public StockCategory createCategory(GenericLookupRequest request, Company company) {
        if (stockCategoryRepository.existsByCompanyAndName(company, request.getName().trim())) {
            throw new BusinessValidationException("Category name already exists.");
        }
        StockCategory category = StockCategory.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .company(company)
                .build();
        return stockCategoryRepository.save(category);
    }

    @Override
    @CacheEvict(value = "categories", key = "#company.id")
    public void deleteCategory(UUID id, Company company) {
        stockCategoryRepository.deleteById(id);
    }

    // ==========================================================================
    // StockGroups
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "stock-groups", key = "#company.id")
    public List<StockGroup> getGroups(Company company) {
        return stockGroupRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "stock-groups", key = "#company.id")
    public StockGroup createGroup(GenericLookupRequest request, Company company) {
        if (stockGroupRepository.existsByCompanyAndName(company, request.getName().trim())) {
            throw new BusinessValidationException("Group name already exists.");
        }

        StockGroup group = StockGroup.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .company(company)
                .build();

        if (request.getCode() != null && !request.getCode().isEmpty()) {
            try {
                group.setParentGroup(stockGroupRepository.findById(UUID.fromString(request.getCode())).orElse(null));
            } catch (IllegalArgumentException e) {
                // Ignore invalid UUID
            }
        }

        return stockGroupRepository.save(group);
    }

    @Override
    @CacheEvict(value = "stock-groups", key = "#company.id")
    public void deleteGroup(UUID id, Company company) {
        stockGroupRepository.deleteById(id);
    }

    // ==========================================================================
    // Units
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "units", key = "#company.id")
    public List<Unit> getUnits(Company company) {
        return unitRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "units", key = "#company.id")
    public Unit createUnit(UnitRequest request, Company company) {
        if (unitRepository.existsByCompanyAndCode(company, request.getCode().trim().toUpperCase())) {
            throw new BusinessValidationException("Unit code already exists.");
        }
        Unit unit = Unit.builder()
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .abbreviation(request.getAbbreviation())
                .decimalPrecision(request.getDecimalPrecision())
                .company(company)
                .build();
        return unitRepository.save(unit);
    }

    @Override
    @CacheEvict(value = "units", key = "#company.id")
    public void deleteUnit(UUID id, Company company) {
        unitRepository.deleteById(id);
    }

    // ==========================================================================
    // Warehouses
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "warehouses", key = "#company.id")
    public List<Warehouse> getWarehouses(Company company) {
        return warehouseRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "warehouses", key = "#company.id")
    public Warehouse createWarehouse(WarehouseRequest request, Company company) {
        if (warehouseRepository.existsByCompanyAndCode(company, request.getCode().trim().toUpperCase())) {
            throw new BusinessValidationException("Warehouse code already exists.");
        }

        Warehouse wh = Warehouse.builder()
                .code(request.getCode().trim().toUpperCase())
                .name(request.getName().trim())
                .address(request.getAddress())
                .company(company)
                .build();

        Warehouse saved = warehouseRepository.save(wh);
        auditLogService.saveLog(company.getId(), "Warehouse", saved.getId(), "CREATED", "Warehouse " + saved.getName() + " registered.");
        return saved;
    }

    @Override
    @CacheEvict(value = "warehouses", key = "#company.id")
    public void deleteWarehouse(UUID id, Company company) {
        warehouseRepository.deleteById(id);
    }

    // ==========================================================================
    // TaxCategories
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "tax-categories", key = "#company.id")
    public List<TaxCategory> getTaxCategories(Company company) {
        return taxCategoryRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "tax-categories", key = "#company.id")
    public TaxCategory createTaxCategory(TaxCategoryRequest request, Company company) {
        if (taxCategoryRepository.existsByCompanyAndTaxCode(company, request.getTaxCode().trim().toUpperCase())) {
            throw new BusinessValidationException("Tax Code already exists.");
        }

        BigDecimal gst = request.getGstRate();
        BigDecimal half = gst.divide(BigDecimal.valueOf(2), 2, BigDecimal.ROUND_HALF_UP);

        TaxCategory tc = TaxCategory.builder()
                .taxCode(request.getTaxCode().trim().toUpperCase())
                .name(request.getName().trim())
                .gstRate(gst)
                .cgstRate(request.getCgstRate() != null ? request.getCgstRate() : half)
                .sgstRate(request.getSgstRate() != null ? request.getSgstRate() : half)
                .igstRate(request.getIgstRate() != null ? request.getIgstRate() : gst)
                .cessRate(request.getCessRate() != null ? request.getCessRate() : BigDecimal.ZERO)
                .effectiveDate(request.getEffectiveDate())
                .company(company)
                .build();
        return taxCategoryRepository.save(tc);
    }

    @Override
    @CacheEvict(value = "tax-categories", key = "#company.id")
    public void deleteTaxCategory(UUID id, Company company) {
        taxCategoryRepository.deleteById(id);
    }

    // ==========================================================================
    // Hsn
    // ==========================================================================
    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "hsn", key = "#company.id")
    public List<Hsn> getHsns(Company company) {
        return hsnRepository.findAllByCompany(company);
    }

    @Override
    @CacheEvict(value = "hsn", key = "#company.id")
    public Hsn createHsn(HsnRequest request, Company company) {
        if (hsnRepository.existsByCompanyAndHsnCode(company, request.getHsnCode().trim())) {
            throw new BusinessValidationException("HSN code already exists.");
        }

        TaxCategory tc = null;
        if (request.getTaxCategoryId() != null) {
            tc = taxCategoryRepository.findById(request.getTaxCategoryId()).orElse(null);
        }

        Hsn hsn = Hsn.builder()
                .hsnCode(request.getHsnCode().trim())
                .description(request.getDescription())
                .taxCategory(tc)
                .company(company)
                .build();
        return hsnRepository.save(hsn);
    }

    @Override
    @CacheEvict(value = "hsn", key = "#company.id")
    public void deleteHsn(UUID id, Company company) {
        hsnRepository.deleteById(id);
    }
}
