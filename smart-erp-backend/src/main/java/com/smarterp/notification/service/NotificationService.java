package com.smarterp.notification.service;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.notification.dto.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    List<NotificationResponse> getNotifications(Company company, String userEmail);
    long getUnreadCount(Company company, String userEmail);
    void markAsRead(UUID notificationId, Company company, String userEmail);
    void markAllAsRead(Company company, String userEmail);
    void createNotification(Company company, String title, String message, String userEmail);
}
