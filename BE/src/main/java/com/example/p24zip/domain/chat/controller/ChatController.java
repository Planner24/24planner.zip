package com.example.p24zip.domain.chat.controller;


import com.example.p24zip.domain.chat.dto.request.MessageRequestDto;
import com.example.p24zip.domain.chat.dto.response.MessageResponseDto;
import com.example.p24zip.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;



    @MessageMapping("/chat/{movingPlanId}")
    @SendTo("/topic/{movingPlanId}")
    public MessageResponseDto chatting(
            @DestinationVariable Long movingPlanId,
            MessageRequestDto requestDto) {

        return chatService.Chatting(movingPlanId, requestDto);
    }
}
