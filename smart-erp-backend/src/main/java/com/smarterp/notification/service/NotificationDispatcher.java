package com.smarterp.notification.service;

import com.smarterp.administration.company.entity.Company;

public interface NotificationDispatcher {
    void dispatch(Company company, String title, String message, String userEmail);
}
