package com.smarterp.inventory.purchase.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.purchase.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, UUID>, JpaSpecificationExecutor<Purchase> {

    Optional<Purchase> findByCompanyAndPurchaseNumber(Company company, String purchaseNumber);

    boolean existsByCompanyAndPurchaseNumber(Company company, String purchaseNumber);

    long countByCompany(Company company);

    @Query("SELECT MAX(p.purchaseNumber) FROM Purchase p WHERE p.company = :company AND p.purchaseNumber LIKE :prefix")
    String findMaxPurchaseNumberByCompanyAndPrefix(@Param("company") Company company, @Param("prefix") String prefix);
}
