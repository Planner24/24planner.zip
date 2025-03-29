package com.example.p24zip.oauth2.handler;

import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.global.response.ApiResponse;
import com.example.p24zip.global.security.jwt.JwtTokenProvider;
import com.example.p24zip.oauth2.CustomOAuth2User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomOAuthLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
        Authentication authentication) throws IOException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        User user = oAuth2User.getUser();

        // 리프레시 토큰 생성
        String refreshToken = jwtTokenProvider.refreshCreateToken(user);

        // 쿠키 생성 및 refreshToken 쿠키에 넣기
        Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);

        // refreshToken redis 넣기
        redisTemplate.opsForValue().set(refreshToken, refreshToken, 2, TimeUnit.DAYS);

        // 액세스 토큰 생성
        String accessToken = jwtTokenProvider.accessCreateToken(user);

        // 액세스 토큰 반환
        ResponseEntity<ApiResponse<String>> responseEntity
            = ResponseEntity.ok(ApiResponse.ok("OK", "로그인에 성공했습니다.", accessToken));

        // 응답을 ResponseEntity로 처리
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(new ObjectMapper().writeValueAsString(responseEntity.getBody()));
    }
}
