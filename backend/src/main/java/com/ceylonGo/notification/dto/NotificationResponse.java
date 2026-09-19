package com.ceylonGo.notification.dto;

import com.ceylonGo.notification.model.Notification;

import java.time.LocalDateTime;

public class NotificationResponse {
    private Long id;
    private String message;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;

    public static NotificationResponse fromEntity(Notification n) {
        NotificationResponse dto = new NotificationResponse();
        dto.id = n.getId();
        dto.message = n.getMessage();
        dto.type = n.getType();
        dto.read = n.isRead();
        dto.createdAt = n.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
