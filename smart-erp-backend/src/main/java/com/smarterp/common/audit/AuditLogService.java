package com.smarterp.common.audit;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.inventory.master.entity.ActivityTimeline;
import com.smarterp.inventory.master.repository.ActivityTimelineRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final ActivityTimelineRepository timelineRepository;
    private final EntityManager entityManager;

    private String getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return "System";
    }

    @Transactional
    public void saveLog(UUID companyId, String entityType, UUID entityId, String action, String details) {
        if (companyId == null) return;
        Company company = entityManager.getReference(Company.class, companyId);

        ActivityTimeline logEntry = ActivityTimeline.builder()
                .company(company)
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .details(details)
                .performedBy(getCurrentUser())
                .build();
        timelineRepository.save(logEntry);
    }
}
