package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, UUID> {
    List<InventoryTransaction> findAllByCompanyOrderByTransactionDateDescCreatedAtDesc(Company company);
    List<InventoryTransaction> findAllByCompanyAndStockItemIdOrderByTransactionDateDescCreatedAtDesc(Company company, UUID itemId);
}
