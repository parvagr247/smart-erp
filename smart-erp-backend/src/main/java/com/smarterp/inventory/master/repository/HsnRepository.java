package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.Hsn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface HsnRepository extends JpaRepository<Hsn, UUID> {
    List<Hsn> findAllByCompany(Company company);
    boolean existsByCompanyAndHsnCode(Company company, String hsnCode);
}
