package com.smarterp.inventory.master.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.ActivityTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityTimelineRepository extends JpaRepository<ActivityTimeline, UUID> {
    List<ActivityTimeline> findAllByCompanyAndEntityTypeAndEntityIdOrderByCreatedAtDesc(Company company, String entityType, UUID entityId);
}
