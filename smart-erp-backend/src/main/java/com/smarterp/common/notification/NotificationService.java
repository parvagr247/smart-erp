package com.smarterp.common.notification;

import java.util.UUID;

public interface NotificationService {
    void sendNotification(UUID companyId, String title, String message, String level);
}
