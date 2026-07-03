package com.smarterp.accounting.group.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.accounting.group.entity.AccountGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountGroupRepository extends JpaRepository<AccountGroup, UUID> {

    Optional<AccountGroup> findByCompanyAndName(Company company, String name);

    boolean existsByCompanyAndName(Company company, String name);

    boolean existsByCompanyAndNameAndIdNot(Company company, String name, UUID id);

    List<AccountGroup> findByCompanyOrderByNameAsc(Company company);

    List<AccountGroup> findByCompanyAndParentGroupIsNull(Company company);

    List<AccountGroup> findByCompanyAndParentGroup(Company company, AccountGroup parentGroup);
    
    long countByCompany(Company company);
}
