package com.smarterp.notification.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.notification.dto.NotificationResponse;
import com.smarterp.notification.entity.Notification;
import com.smarterp.notification.repository.NotificationRepository;
import com.smarterp.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(Company company, String userEmail) {
        log.info("Fetching notifications for user {} in company {}", userEmail, company.getId());
        return repository.findByCompanyAndUserEmailOrderByCreatedAtDesc(company, userEmail)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Company company, String userEmail) {
        return repository.countByCompanyAndUserEmailAndReadFalse(company, userEmail);
    }

    @Override
    public void markAsRead(UUID notificationId, Company company, String userEmail) {
        Notification notification = repository.findById(notificationId)
                .filter(n -> n.getCompany().getId().equals(company.getId()) && n.getUserEmail().equals(userEmail))
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        notification.setRead(true);
        repository.save(notification);
    }

    @Override
    public void markAllAsRead(Company company, String userEmail) {
        List<Notification> unread = repository.findByCompanyAndUserEmailOrderByCreatedAtDesc(company, userEmail)
                .stream()
                .filter(n -> !n.getRead())
                .collect(Collectors.toList());

        for (Notification n : unread) {
            n.setRead(true);
        }
        repository.saveAll(unread);
    }

    @Override
    public void createNotification(Company company, String title, String message, String userEmail) {
        log.info("Creating notification: '{}' for user: {}", title, userEmail);
        Notification notification = Notification.builder()
                .company(company)
                .title(title)
                .message(message)
                .userEmail(userEmail)
                .read(false)
                .build();

        repository.save(notification);

        // Inline the mock dispatch logging for SMS and Email channels
        log.info("[MOCK EMAIL OUTBOX] To: {}, Subject: {}, Body: {}", userEmail, title, message);
        log.info("[MOCK SMS OUTBOX] To: {}, Message: {}", userEmail, message);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(n.getRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
