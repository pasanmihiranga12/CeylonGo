package com.ceylonGo.messaging.dto;

import com.ceylonGo.messaging.model.Message;

import java.time.LocalDateTime;

public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String content;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;

    public static MessageResponse fromEntity(Message m) {
        MessageResponse dto = new MessageResponse();
        dto.id = m.getId();
        dto.senderId = m.getSender().getId();
        dto.senderName = m.getSender().getName();
        dto.receiverId = m.getReceiver().getId();
        dto.receiverName = m.getReceiver().getName();
        dto.content = m.getContent();
        dto.sentAt = m.getSentAt();
        dto.readAt = m.getReadAt();
        return dto;
    }

    public Long getId() { return id; }
    public Long getSenderId() { return senderId; }
    public String getSenderName() { return senderName; }
    public Long getReceiverId() { return receiverId; }
    public String getReceiverName() { return receiverName; }
    public String getContent() { return content; }
    public LocalDateTime getSentAt() { return sentAt; }
    public LocalDateTime getReadAt() { return readAt; }
}
