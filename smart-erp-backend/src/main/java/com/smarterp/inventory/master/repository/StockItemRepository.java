package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface StockItemRepository extends JpaRepository<StockItem, UUID>, JpaSpecificationExecutor<StockItem> {

    boolean existsByCompanyAndCode(Company company, String code);

    boolean existsByCompanyAndCodeAndIdNot(Company company, String code, UUID id);

    boolean existsByCompanyAndSku(Company company, String sku);

    boolean existsByCompanyAndSkuAndIdNot(Company company, String sku, UUID id);

    long countByCompany(Company company);
}
