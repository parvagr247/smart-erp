package com.smarterp.repo;

import com.smarterp.entities.Company;
import com.smarterp.entities.Ledger;
import com.smarterp.entities.enums.LedgerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LedgerRepo extends JpaRepository<Ledger, UUID> {

    Optional<Ledger> findByCompanyAndLedgerName(
            Company company,
            String ledgerName
    );

    boolean existsByCompanyAndLedgerName(
            Company company,
            String ledgerName
    );

    List<Ledger> findByCompany(
            Company company
    );

    List<Ledger> findByCompanyAndLedgerType(
            Company company,
            LedgerType ledgerType
    );

    List<Ledger> findByCompanyOrderByLedgerNameAsc(
            Company company
    );
}
