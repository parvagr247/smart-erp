package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.PaymentTerms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentTermsRepository extends JpaRepository<PaymentTerms, UUID> {
    List<PaymentTerms> findAllByCompany(Company company);
    boolean existsByCompanyAndName(Company company, String name);
}
