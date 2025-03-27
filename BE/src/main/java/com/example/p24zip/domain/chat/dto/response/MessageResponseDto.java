package com.example.p24zip.domain.chat.dto.response;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MessageResponseDto {

    private final String text;

    public static MessageResponseDtoBuilder from(String text) {
        return MessageResponseDto.builder()
                .text(text);
    }
}
