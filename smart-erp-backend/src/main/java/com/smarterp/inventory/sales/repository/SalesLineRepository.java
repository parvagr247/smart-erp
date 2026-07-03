package com.smarterp.inventory.sales.repository;

import com.smarterp.inventory.sales.entity.SalesLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface SalesLineRepository extends JpaRepository<SalesLine, UUID> {
}
