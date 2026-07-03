package com.smarterp.notification.service.impl;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.notification.service.NotificationDispatcher;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SmsNotificationDispatcher implements NotificationDispatcher {
    @Override
    public void dispatch(Company company, String title, String message, String userEmail) {
        log.info("[MOCK SMS OUTBOX] Dispatching text alert to recipient linked to {} details: {}", userEmail, message);
    }
}
