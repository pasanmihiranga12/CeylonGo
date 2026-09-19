package com.ceylonGo.notification.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import com.ceylonGo.notification.dto.NotificationResponse;
import com.ceylonGo.notification.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<NotificationResponse>> myNotifications() {
        return ApiResponse.ok(notificationService.getMyNotifications(SecurityUtils.currentUserId()));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Map<String, Long>> unreadCount() {
        return ApiResponse.ok(Map.of("unread", notificationService.getUnreadCount(SecurityUtils.currentUserId())));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id, SecurityUtils.currentUserId());
        return ApiResponse.ok("Marked as read", null);
    }
}
