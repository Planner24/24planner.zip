package com.example.p24zip.domain.user.dto.response;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class LoginResponseDto {

    private final String accessToken;
    private final String nickname;
}
