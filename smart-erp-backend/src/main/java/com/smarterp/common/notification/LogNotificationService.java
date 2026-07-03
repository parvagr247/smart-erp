package com.smarterp.common.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@Slf4j
public class LogNotificationService implements NotificationService {

    @Override
    public void sendNotification(UUID companyId, String title, String message, String level) {
        log.info("[NOTIFICATION] [{}] [Company: {}] Title: '{}' | Message: '{}'", level, companyId, title, message);
    }
}
