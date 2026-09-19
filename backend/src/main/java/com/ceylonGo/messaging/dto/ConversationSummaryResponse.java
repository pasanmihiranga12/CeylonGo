package com.ceylonGo.messaging.dto;

public class ConversationSummaryResponse {
    private Long otherUserId;
    private String otherUserName;
    private String lastMessage;
    private String lastMessageAt;

    public ConversationSummaryResponse(Long otherUserId, String otherUserName, String lastMessage, String lastMessageAt) {
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.lastMessage = lastMessage;
        this.lastMessageAt = lastMessageAt;
    }

    public Long getOtherUserId() { return otherUserId; }
    public String getOtherUserName() { return otherUserName; }
    public String getLastMessage() { return lastMessage; }
    public String getLastMessageAt() { return lastMessageAt; }
}
