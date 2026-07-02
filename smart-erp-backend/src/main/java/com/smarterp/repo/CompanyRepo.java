package com.smarterp.repo;

import com.smarterp.entities.Company;
import com.smarterp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyRepo extends JpaRepository<Company, UUID> {

    Optional<Company> findByGstNumber(String gstNumber);

    boolean existsByGstNumber(String gstNumber);

    Optional<Company> findByCompanyName(String companyName);

    List<Company> findByOwner(User owner);

}
