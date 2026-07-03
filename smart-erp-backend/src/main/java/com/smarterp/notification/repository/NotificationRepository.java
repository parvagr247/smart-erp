package com.smarterp.notification.repository;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByCompanyAndUserEmailOrderByCreatedAtDesc(Company company, String userEmail);
    long countByCompanyAndUserEmailAndReadFalse(Company company, String userEmail);
}
