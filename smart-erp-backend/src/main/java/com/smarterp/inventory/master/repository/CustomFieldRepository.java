package com.smarterp.inventory.master.repository;

import com.smarterp.inventory.master.entity.CustomField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CustomFieldRepository extends JpaRepository<CustomField, UUID> {
    List<CustomField> findAllByEntityTypeAndEntityId(String entityType, UUID entityId);
}
