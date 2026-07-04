package com.smarterp.common.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailSharingService {

    public boolean sendEmailWithAttachment(String toEmail, String subject, String body, byte[] attachment, String fileName) {
        log.info("Simulating email dispatch to: {}", toEmail);
        log.info("Subject: {}", subject);
        log.info("Body: {}", body);
        log.info("Attachment Name: {} | Size: {} bytes", fileName, attachment.length);
        
        // Mock successful email sending
        return true;
    }
}
