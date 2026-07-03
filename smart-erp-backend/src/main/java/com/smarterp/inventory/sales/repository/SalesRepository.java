package com.smarterp.inventory.sales.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.sales.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SalesRepository extends JpaRepository<Sales, UUID>, JpaSpecificationExecutor<Sales> {
    
    @Query("SELECT MAX(s.salesNumber) FROM Sales s WHERE s.company = :company AND s.salesNumber LIKE :prefix")
    String findMaxSalesNumberByCompanyAndPrefix(@Param("company") Company company, @Param("prefix") String prefix);

    long countByCompany(Company company);
}
