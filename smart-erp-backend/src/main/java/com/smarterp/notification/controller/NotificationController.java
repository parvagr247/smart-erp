package com.smarterp.notification.controller;

import com.smarterp.administration.company.entity.Company;
import com.smarterp.administration.company.repository.CompanyRepository;
import com.smarterp.common.dto.ApiResponse;
import com.smarterp.common.exception.ResourceNotFoundException;
import com.smarterp.common.security.AuthenticatedUser;
import com.smarterp.notification.dto.NotificationResponse;
import com.smarterp.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;
    private final CompanyRepository companyRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @RequestHeader("X-Company-ID") UUID companyId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        List<NotificationResponse> data = service.getNotifications(company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<List<NotificationResponse>>builder().success(true).data(data).build());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            @RequestHeader("X-Company-ID") UUID companyId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        long count = service.getUnreadCount(company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<Long>builder().success(true).data(count).build());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable UUID id,
            @RequestHeader("X-Company-ID") UUID companyId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        service.markAsRead(id, company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Notification marked as read.").build());
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @RequestHeader("X-Company-ID") UUID companyId,
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        Company company = getCompany(companyId);
        service.markAllAsRead(company, authenticatedUser.getUsername());
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("All notifications marked as read.").build());
    }

    private Company getCompany(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Active company context not found."));
    }
}
