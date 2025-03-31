package com.example.p24zip.oauth2.handler;

import com.example.p24zip.global.exception.AdditionalInfoRequiredException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomOAuthLoginFailureHandler implements AuthenticationFailureHandler {

    @Value("${origin}")
    private String origin;

    @Override
    public void onAuthenticationFailure(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException exception
    ) throws IOException {
        if (exception instanceof AdditionalInfoRequiredException ex) {
            // tempToken을 쿼리 파라미터로 전달
            String tempToken = ex.getTempToken();
            response.sendRedirect(origin + "/signup/additional-info?tempToken=" + tempToken);
        }
    }
}
