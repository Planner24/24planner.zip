package com.example.p24zip.domain.chat.controller;


import com.example.p24zip.domain.chat.dto.request.MessageRequestDto;
import com.example.p24zip.domain.chat.dto.response.MessageResponseDto;
import com.example.p24zip.domain.chat.service.ChatService;
import com.example.p24zip.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final JwtTokenProvider jwtTokenProvider;



    @MessageMapping("/chat/{movingPlanId}")
    @SendTo("/topic/{movingPlanId}")
    public MessageResponseDto chatting(
            StompHeaderAccessor headerAccessor,
            @DestinationVariable Long movingPlanId,
            MessageRequestDto requestDto) {



        String token = headerAccessor.getFirstNativeHeader("Authorization");
        String tokenusername = jwtTokenProvider.getUsername(token);
        log.info(tokenusername);


        return chatService.Chatting(movingPlanId, requestDto, tokenusername);
    }
}
