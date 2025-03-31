package com.example.p24zip.global.exception;

import lombok.Getter;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;

@Getter
public class AdditionalInfoRequiredException extends OAuth2AuthenticationException {

    private final String tempToken; // 프론트에 전달할 임시 토큰

    public AdditionalInfoRequiredException(String msg, String tempToken) {
        super(msg);
        this.tempToken = tempToken;
    }

}