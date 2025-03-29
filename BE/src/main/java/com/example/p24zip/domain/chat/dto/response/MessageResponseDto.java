package com.example.p24zip.domain.chat.dto.response;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MessageResponseDto {

    private final String text;
    private final String nickname;

    public static MessageResponseDto from(String text, String nickname) {
        return MessageResponseDto.builder()
                .text(text)
                .nickname(nickname)
                .build();
    }
}
