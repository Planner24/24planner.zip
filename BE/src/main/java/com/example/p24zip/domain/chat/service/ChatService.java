package com.example.p24zip.domain.chat.service;

import com.example.p24zip.domain.chat.dto.request.MessageRequestDto;
import com.example.p24zip.domain.chat.dto.response.MessageResponseDto;
import com.example.p24zip.domain.chat.entity.Chat;
import com.example.p24zip.domain.chat.repository.ChatRepository;
import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.domain.user.repository.UserRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final MovingPlanRepository movingPlanRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;


    @Transactional
    public MessageResponseDto Chatting(
            Long id,
            MessageRequestDto requestDto,
            String tokenusername
            ) {

        MovingPlan movingPlan = movingPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException());

        User user = userRepository.findByUsername(tokenusername)
                .orElseThrow(() -> new ResourceNotFoundException());

        log.info(user.getNickname());



        Chat save = chatRepository.save(requestDto.toEntity(movingPlan, user));

        String text = HtmlUtils.htmlEscape(save.getText());

        return MessageResponseDto.from(text, user.getNickname());
    }
}
