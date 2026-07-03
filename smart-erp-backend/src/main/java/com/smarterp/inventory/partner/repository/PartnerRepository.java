package com.smarterp.inventory.partner.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.partner.entity.BusinessPartner;
import com.smarterp.inventory.partner.entity.PartnerType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.UUID;

@Repository
public interface PartnerRepository extends JpaRepository<BusinessPartner, UUID>, JpaSpecificationExecutor<BusinessPartner> {

    boolean existsByCompanyAndCode(Company company, String code);

    boolean existsByCompanyAndCodeAndIdNot(Company company, String code, UUID id);

    long countByCompany(Company company);

    @Query("SELECT COUNT(p) FROM BusinessPartner p WHERE p.company = :company AND (p.type = :type OR p.type = 'BOTH')")
    long countByCompanyAndTypeOrBoth(@Param("company") Company company, @Param("type") PartnerType type);

    @Query("SELECT COALESCE(SUM(p.openingBalance), 0) FROM BusinessPartner p WHERE p.company = :company AND p.balanceType = 'DEBIT' AND p.isActive = true")
    BigDecimal sumOutstandingReceivables(@Param("company") Company company);

    @Query("SELECT COALESCE(SUM(p.openingBalance), 0) FROM BusinessPartner p WHERE p.company = :company AND p.balanceType = 'CREDIT' AND p.isActive = true")
    BigDecimal sumOutstandingPayables(@Param("company") Company company);
}
