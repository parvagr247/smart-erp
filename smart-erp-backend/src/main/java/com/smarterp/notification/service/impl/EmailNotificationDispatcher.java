package com.smarterp.notification.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.notification.service.NotificationDispatcher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class EmailNotificationDispatcher implements NotificationDispatcher {
    @Override
    public void dispatch(Company company, String title, String message, String userEmail) {
        log.info("[MOCK EMAIL OUTBOX] To: {}, Subject: {}, Body: {}", userEmail, title, message);
    }
}
