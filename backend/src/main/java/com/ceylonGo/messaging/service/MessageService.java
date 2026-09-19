package com.ceylonGo.messaging.service;

import org.springframework.transaction.annotation.Transactional;

import com.ceylonGo.auth.model.User;
import com.ceylonGo.auth.service.UserService;
import com.ceylonGo.common.BadRequestException;
import com.ceylonGo.messaging.dto.ConversationSummaryResponse;
import com.ceylonGo.messaging.dto.MessageRequest;
import com.ceylonGo.messaging.dto.MessageResponse;
import com.ceylonGo.messaging.model.Message;
import com.ceylonGo.messaging.repository.MessageRepository;
import com.ceylonGo.notification.service.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Simple, database-backed messaging (no real-time/WebSocket infrastructure -
 * the frontend can poll GET /api/messages/{userId} as needed, which is
 * sufficient for a student project per the brief).
 */
@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public MessageService(MessageRepository messageRepository, UserService userService,
                          NotificationService notificationService) {
        this.messageRepository = messageRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    public MessageResponse send(Long senderId, MessageRequest request) {
        if (senderId.equals(request.getReceiverId())) {
            throw new BadRequestException("You cannot send a message to yourself");
        }

        User sender = userService.getUserEntity(senderId);
        User receiver = userService.getUserEntity(request.getReceiverId());

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());

        Message saved = messageRepository.save(message);
        notificationService.notify(receiver.getId(), sender.getName() + " sent you a message", "NEW_MESSAGE");

        return MessageResponse.fromEntity(saved);
    }

    public List<MessageResponse> getConversation(Long userId, Long otherUserId) {
        return messageRepository.findConversation(userId, otherUserId)
                .stream().map(MessageResponse::fromEntity).toList();
    }

    public List<ConversationSummaryResponse> getMyConversations(Long userId) {
        return messageRepository.findLatestMessagePerConversation(userId).stream()
                .map(m -> {
                    boolean iAmSender = m.getSender().getId().equals(userId);
                    User other = iAmSender ? m.getReceiver() : m.getSender();
                    return new ConversationSummaryResponse(
                            other.getId(), other.getName(), m.getContent(), m.getSentAt().toString());
                })
                .toList();
    }
}