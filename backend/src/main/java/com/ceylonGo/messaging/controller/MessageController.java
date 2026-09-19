package com.ceylonGo.messaging.controller;

import com.ceylonGo.common.ApiResponse;
import com.ceylonGo.config.SecurityUtils;
import com.ceylonGo.messaging.dto.ConversationSummaryResponse;
import com.ceylonGo.messaging.dto.MessageRequest;
import com.ceylonGo.messaging.dto.MessageResponse;
import com.ceylonGo.messaging.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> send(@Valid @RequestBody MessageRequest request) {
        MessageResponse response = messageService.send(SecurityUtils.currentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Message sent", response));
    }

    @GetMapping("/conversations")
    public ApiResponse<List<ConversationSummaryResponse>> myConversations() {
        return ApiResponse.ok(messageService.getMyConversations(SecurityUtils.currentUserId()));
    }

    @GetMapping("/{otherUserId}")
    public ApiResponse<List<MessageResponse>> conversationWith(@PathVariable Long otherUserId) {
        return ApiResponse.ok(messageService.getConversation(SecurityUtils.currentUserId(), otherUserId));
    }
}
