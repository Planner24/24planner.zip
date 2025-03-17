package com.example.p24zip.domain.user.service;


import com.example.p24zip.domain.user.dto.request.SignupRequestDto;
import com.example.p24zip.domain.user.dto.response.VerifyEmailDataResponseDto;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.domain.user.repository.UserRepository;
import com.example.p24zip.global.exception.CustomException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // 회원가입 시 비밀번호 암호화
    private final JavaMailSender mailSender; // 메일 보내는 객체
    private final StringRedisTemplate redisTemplate; // redis 객체

    /**
     * @param requestDto
     *    username(email), password, nickname
     * **/
    @Transactional
    public void signup(@Valid SignupRequestDto requestDto) {
        boolean checkUsername = checkExistsUsername(requestDto.getUsername());

        if (checkUsername) {
            throw new CustomException("EXIST_EMAIL", "이미 사용중인 이메일입니다.");
        }

        User user = requestDto.toEntity();
        String encryptedPassword = passwordEncoder.encode(requestDto.getPassword());
        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }

    /**
     * @param userName 입력한 email
     * @return Boolean 이메일 존재 유무
     * **/
    public boolean checkExistsUsername(String userName) {
        return userRepository.existsByUsername(userName);
    }

    /**
     * @param username 입력한 email
     * @param subject 보내질 이메일 제목
     * @param text 보내질 이메일 본문 내용
     * @param code 보내질 인증 코드 랜덤한 4자리 수
     * @return 만료일 가진 responseDto
     * 
     * **/
    public VerifyEmailDataResponseDto sendEmail(@NotNull @Email String username, String subject, String text, int code) {
        boolean checkUsername = checkExistsUsername(username);
        if (checkUsername) {
            throw new CustomException("EXIST_EMAIL", "이미 사용중인 이메일입니다.");
        }

        // 정의된 SMTP 메일 객체로 메일 전송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(username);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
        
        // redis인증 코드 저장
        LocalDateTime expiredAt = saveCodeToRedis(username, String.valueOf(code));

        return VerifyEmailDataResponseDto.from(expiredAt);


    }
    /**
     * @param username 입력한 email
     * @param code 4자리의 랜덤 수
     * @return LocalDateTime expiredAt
     * **/
    public LocalDateTime saveCodeToRedis(String username, String code) {

        redisTemplate.opsForValue().set(username, code, 3, TimeUnit.MINUTES);
        return LocalDateTime.now().plusMinutes(3);
    }

}
