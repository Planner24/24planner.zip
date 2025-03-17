package com.example.p24zip.domain.user.controller;

import com.example.p24zip.domain.user.dto.request.SignupRequestDto;
import com.example.p24zip.domain.user.dto.request.VerifyEmailRequestDto;
import com.example.p24zip.domain.user.dto.response.VerifyEmailDataResponseDto;
import com.example.p24zip.domain.user.service.AuthService;
import com.example.p24zip.global.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.Random;
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

    @PostMapping(value = "/verify-email")
    public ResponseEntity<ApiResponse<VerifyEmailDataResponseDto>> verifyEmail(@RequestBody @Valid VerifyEmailRequestDto requestDto){
        String subject = "회원가입 인증 메일입니다.";
        Random random = new Random();
        int code = random.nextInt(9000) +1000;
        String text = "인증 코드는" + code + "입니다.";

        return ResponseEntity.ok(
            ApiResponse.ok("OK", "인증 번호를 전송했습니다.", authService.sendEmail(requestDto.getUsername(), subject, text, code))
        );

    }
}
