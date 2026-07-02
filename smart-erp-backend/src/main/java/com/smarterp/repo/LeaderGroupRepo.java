package com.smarterp.repo;

import com.smarterp.entities.Company;
import com.smarterp.entities.AccountGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LeaderGroupRepo extends JpaRepository<AccountGroup, UUID> {

    Optional<AccountGroup> findByCompanyAndGroupName(
            Company company,
            String groupName
    );

    boolean existsByCompanyAndGroupName(
            Company company,
            String groupName
    );

    List<AccountGroup> findByCompanyOrderByGroupNameAsc(
            Company company
    );

}
