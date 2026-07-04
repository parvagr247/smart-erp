package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface StockItemRepository extends JpaRepository<StockItem, UUID>, JpaSpecificationExecutor<StockItem> {

    boolean existsByCompanyAndCode(Company company, String code);

    boolean existsByCompanyAndCodeAndIdNot(Company company, String code, UUID id);

    boolean existsByCompanyAndSku(Company company, String sku);

    boolean existsByCompanyAndSkuAndIdNot(Company company, String sku, UUID id);

    long countByCompany(Company company);

    @Query("SELECT COALESCE(SUM(s.currentQuantity * s.averageCost), 0) FROM StockItem s WHERE s.company = :company")
    java.math.BigDecimal sumInventoryValueByCompany(@Param("company") Company company);

    @Query("SELECT COALESCE(SUM(s.openingValue), 0) FROM StockItem s WHERE s.company = :company")
    java.math.BigDecimal sumOpeningValueByCompany(@Param("company") Company company);

    @Query("SELECT COUNT(s) FROM StockItem s WHERE s.company = :company AND s.currentQuantity <= s.reorderLevel")
    long countLowStockByCompany(@Param("company") Company company);
}
