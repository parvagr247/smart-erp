package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.TaxCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaxCategoryRepository extends JpaRepository<TaxCategory, UUID> {
    List<TaxCategory> findAllByCompany(Company company);
    boolean existsByCompanyAndTaxCode(Company company, String taxCode);
}
