package com.smarterp.administration.company.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {

    Page<Company> findByOwner(User owner, Pageable pageable);

    Optional<Company> findByIdAndOwner(UUID id, User owner);

    boolean existsByGstNumber(String gstNumber);

    boolean existsByGstNumberAndIdNot(String gstNumber, UUID id);

    Optional<Company> findByGstNumber(String gstNumber);

    @Query("SELECT c FROM Company c LEFT JOIN c.permittedUsers u WHERE c.owner.id = :userId OR u.id = :userId")
    Page<Company> findByOwnerOrPermittedUser(@Param("userId") UUID userId, Pageable pageable);
}
