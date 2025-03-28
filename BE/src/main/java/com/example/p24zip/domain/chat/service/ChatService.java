package com.example.p24zip.domain.chat.service;

import com.example.p24zip.domain.chat.dto.request.MessageRequestDto;
import com.example.p24zip.domain.chat.dto.response.MessageResponseDto;
import com.example.p24zip.domain.chat.entity.Chat;
import com.example.p24zip.domain.chat.repository.ChatRepository;
import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ChatService {

    private final MovingPlanRepository movingPlanRepository;
    private final ChatRepository chatRepository;


    @Transactional
    public MessageResponseDto Chatting(
            Long id,
            MessageRequestDto requestDto
            ) {

        MovingPlan movingPlan = movingPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException());

        Chat save = chatRepository.save(requestDto.toEntity(movingPlan));

        String text = HtmlUtils.htmlEscape(save.getText());

        return MessageResponseDto.from(text);
    }
}
