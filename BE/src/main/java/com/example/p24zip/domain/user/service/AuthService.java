package com.example.p24zip.domain.user.service;


import com.example.p24zip.domain.user.dto.request.LoginRequestDto;
import com.example.p24zip.domain.user.dto.request.SignupRequestDto;
import com.example.p24zip.domain.user.dto.response.LoginResponseDto;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.domain.user.repository.UserRepository;
import com.example.p24zip.global.exception.CustomException;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import com.example.p24zip.global.security.jwt.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public void signup(@Valid SignupRequestDto requestDto) {
        boolean checkUsername = checkExistsUsername(requestDto.getEmail());

        if (checkUsername) {
            throw new CustomException("EXIST_EMAIL", "이미 사용중인 이메일입니다.");
        }

        User user = requestDto.toEntity();
        String encryptedPassword = passwordEncoder.encode(requestDto.getPassword());
        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }

    // 로그인
    public LoginResponseDto login(LoginRequestDto requestDto){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDto.getUsername(),
                        requestDto.getPassword()
                )
        );

        User user = userRepository.findByUsername(requestDto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException());

        String accessjwt = jwtTokenProvider.accessCreateToken(user);
        String refreshjwt = jwtTokenProvider.refreshCreateToken(user);

        return new LoginResponseDto(accessjwt, refreshjwt);
    }

    public boolean checkExistsUsername(String userName) {
        return userRepository.existsByUsername(userName);
    }
}
