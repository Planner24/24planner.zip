package com.example.p24zip.domain.user.controller;

import com.example.p24zip.domain.user.dto.request.LoginRequestDto;
import com.example.p24zip.domain.user.dto.request.SignupRequestDto;
import com.example.p24zip.domain.user.dto.response.LoginResponseDto;
import com.example.p24zip.domain.user.service.AuthService;
import com.example.p24zip.global.response.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(
        @RequestBody @Valid SignupRequestDto requestDto) {
        authService.signup(requestDto);

        return ResponseEntity.ok(
            ApiResponse.ok("CREATED", "회원가입을 성공했습니다.", null)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(
            @Valid @RequestBody LoginRequestDto requestDto, HttpServletResponse response) {
        return ResponseEntity.ok(ApiResponse.ok(
                "OK",
                "로그인이 성공했습니다.",
                authService.login(requestDto, response)
        ));
    }
}
