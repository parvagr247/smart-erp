package com.smarterp.accounting.ledger.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.ledger.entity.BalanceType;
import com.smarterp.accounting.ledger.entity.Ledger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, UUID>, JpaSpecificationExecutor<Ledger> {

    Optional<Ledger> findByCompanyAndName(Company company, String name);

    boolean existsByCompanyAndName(Company company, String name);

    boolean existsByCompanyAndNameAndIdNot(Company company, String name, UUID id);

    long countByCompany(Company company);

    List<Ledger> findByCompany(Company company);

    @Query("SELECT l FROM Ledger l WHERE l.company = :company AND " +
           "(:search IS NULL OR LOWER(l.name) LIKE :search " +
           "OR LOWER(l.group.name) LIKE :search " +
           "OR LOWER(l.gstNumber) LIKE :search " +
           "OR LOWER(l.phone) LIKE :search) AND " +
           "(:groupId IS NULL OR l.group.id = :groupId) AND " +
           "(:isActive IS NULL OR l.isActive = :isActive) AND " +
           "(:balanceType IS NULL OR l.balanceType = :balanceType) AND " +
           "(:gstApplicable IS NULL OR l.gstApplicable = :gstApplicable)")
    Page<Ledger> searchAndFilter(
        @Param("company") Company company,
        @Param("search") String search,
        @Param("groupId") UUID groupId,
        @Param("isActive") Boolean isActive,
        @Param("balanceType") BalanceType balanceType,
        @Param("gstApplicable") Boolean gstApplicable,
        Pageable pageable
    );

    @Query("SELECT COALESCE(SUM(l.openingBalance), 0) FROM Ledger l WHERE l.company = :company AND l.group.name = :groupName")
    java.math.BigDecimal sumOpeningBalanceByCompanyAndGroupName(@Param("company") Company company, @Param("groupName") String groupName);

    @Query("SELECT COALESCE(SUM(l.openingBalance), 0) FROM Ledger l WHERE l.company = :company AND l.group.name IN :groupNames")
    java.math.BigDecimal sumOpeningBalanceByCompanyAndGroupNames(@Param("company") Company company, @Param("groupNames") java.util.List<String> groupNames);
}
