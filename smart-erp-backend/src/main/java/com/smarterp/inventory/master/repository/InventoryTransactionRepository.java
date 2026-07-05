package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.InventoryTransaction;
import com.smarterp.inventory.master.entity.InventoryTransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, UUID> {
    List<InventoryTransaction> findAllByCompanyOrderByTransactionDateDescCreatedAtDesc(Company company);
    List<InventoryTransaction> findAllByCompanyAndStockItemIdOrderByTransactionDateDescCreatedAtDesc(Company company, UUID itemId);

    @Query("SELECT MAX(t.transactionDate) FROM InventoryTransaction t WHERE t.company = :company AND t.stockItem.id = :itemId AND t.transactionType = :type")
    LocalDate findLastTransactionDate(@Param("company") Company company, @Param("itemId") UUID itemId, @Param("type") InventoryTransactionType type);
}
