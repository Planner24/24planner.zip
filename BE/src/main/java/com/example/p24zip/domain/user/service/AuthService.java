package com.example.p24zip.domain.user.service;


import com.example.p24zip.domain.user.dto.request.ChangePasswordRequestDto;
import com.example.p24zip.domain.user.dto.request.LoginRequestDto;
import com.example.p24zip.domain.user.dto.request.SignupRequestDto;
import com.example.p24zip.domain.user.dto.request.VerifyEmailRequestCodeDto;
import com.example.p24zip.domain.user.dto.request.VerifyEmailRequestDto;
import com.example.p24zip.domain.user.dto.response.FindPasswordResponseDto;
import com.example.p24zip.domain.user.dto.response.VerifyEmailDataResponseDto;
import com.example.p24zip.domain.user.dto.response.AccessTokenResponseDto;
import com.example.p24zip.domain.user.dto.response.LoginResponseDto;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.domain.user.repository.UserRepository;
import com.example.p24zip.global.exception.CustomException;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import com.example.p24zip.global.exception.TokenException;
import com.example.p24zip.global.security.jwt.JwtTokenProvider;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${ORIGIN}")
    private String origin;

    @Value("${MAIL_ADDRESS")
    private String mailAddress;
 

    /**
     * 회원가입
     * @param requestDto
     *    username(email), password, nickname
     * @return null
     * **/
    @Transactional
    public void signup(@Valid SignupRequestDto requestDto) {
        boolean checkUsername = checkExistsUsername(requestDto.getUsername());

        if (checkUsername) {
            throw new CustomException("EXIST_EMAIL", "이미 사용중인 이메일입니다.");
        }
        checkExistNickname(requestDto.getNickname());

        User user = requestDto.toEntity();
        String encryptedPassword = passwordEncoder.encode(requestDto.getPassword());
        user.setPassword(encryptedPassword);
        userRepository.save(user);
    }


    /**
     * 이메일 인증(사용자 이메일로 랜덤한 숫자 4자리 전송)
     * @param requestDto 입력한 email을 가지고 있는 DTO
     * @return 만료일 가진 responseDto
     * **/
    public VerifyEmailDataResponseDto sendEmail(VerifyEmailRequestDto requestDto)
        throws UnsupportedEncodingException, MessagingException {
        String username = requestDto.getUsername();

        if(redisTemplate.hasKey(username)){
            LocalDateTime checkAccessTime = LocalDateTime.parse(
            redisTemplate.opsForValue().get(username + "_createdAt"));

            if(!checkAccessTime.plusSeconds(5).isBefore(LocalDateTime.now())){
                throw new CustomException("TOOMANY_REQUEST","5초안에 다시 요청했습니다.");
            }
        }

        boolean checkUsername = checkExistsUsername(username);
        if (checkUsername) {
            throw new CustomException("EXIST_EMAIL", "이미 사용중인 이메일입니다.");
        }

        Random random = new Random();
        int codeNum = random.nextInt(9000) +1000;
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(new InternetAddress(mailAddress, "이사모음.zip")); // 메일 보낸 이 표시
        helper.setTo(username);
        helper.setSubject("이사모음.zip 회원가입 인증 메일입니다."); // 메일 제목
        String text = String.format("<h1>인증 코드는 %d입니다.</h1>",codeNum);
        helper.setText(text, true);
        mailSender.send(message);

        // redis인증 코드 저장
        ZonedDateTime expiredAt = saveCodeToRedis(username, codeNum);

        return VerifyEmailDataResponseDto.from(expiredAt);

    }

    /**
     * 이메일 인증 확인
     * @param requestDto 인증한 이메일, 인증한 코드(랜덤한 숫자 4자리)
     * @return null
     * **/
    public void checkCode(VerifyEmailRequestCodeDto requestDto) {
        String username = requestDto.getUsername();
        String code = requestDto.getCode();

        if(!redisTemplate.hasKey(username)) {
            throw new CustomException("BAD_REQUEST", "인증번호가 틀렸습니다.");
        }
        // -2: 시간 만료
        if(redisTemplate.getExpire(username)!=-2){
            if(!code.equals(redisTemplate.opsForValue().get(username))){
               throw new CustomException("BAD_REQUEST", "인증번호가 틀렸습니다.");
            }else{
                redisTemplate.delete(username);
                redisTemplate.delete(username + "_createdAt");
            }
        }
        else{
            throw new CustomException("TIME_OUT", "시간이 초과되었습니다.");
        }

    }

    /**
     * 닉네임 확인
     * @param nickname
     * @return null
     * **/
    public void checkExistNickname(String nickname) {
        boolean checkExistNickname = userRepository.existsByNickname(nickname);

        if(checkExistNickname) {
            throw new CustomException("EXIST_NICKNAME","이미 사용중인 닉네임입니다.");
        }
        if(!(nickname.length()>=2 && nickname.length()<=17)){
            throw new CustomException("BAD_REQUEST", "필수값이 누락되거나 형식이 올바르지 않습니다.");
        }
    }

    /**
     * 사용자 이메일로 비밀번호 수정 임시 페이지 링크 보내줌
     *
     * @param requestDto username:email
     * @return null
     **/
    public FindPasswordResponseDto findPassword(VerifyEmailRequestDto requestDto)
        throws UnsupportedEncodingException, MessagingException {
        String username = requestDto.getUsername();
        System.out.println(username);
        User user = userRepository.findByUsername(username).orElseThrow(()-> new CustomException("NOT_EXIST_EMAIL", "존재하지 않는 이메일입니다."));

        if(redisTemplate.hasKey(username+"_tempToken")){
            ZonedDateTime checkAccessTime = ZonedDateTime.parse(
                redisTemplate.opsForValue().get(username + "_createdAt"));

            if(!checkAccessTime.plusSeconds(5).isBefore(ZonedDateTime.now())){
                throw new CustomException("TOOMANY_REQUEST","5초안에 다시 요청했습니다.");
            }
        }

        String tempJwt = jwtTokenProvider.accessCreateToken(user);

        String key = username +"_tempToken";
        redisTemplate.opsForValue().set(key,tempJwt, 30, TimeUnit.MINUTES);
        String createdAt = username + "_createdAt";
        redisTemplate.opsForValue().set(createdAt, String.valueOf(ZonedDateTime.now()), 30, TimeUnit.MINUTES); // 생성시간

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(new InternetAddress(mailAddress, "이사모음.zip"));
        helper.setTo(username);
        helper.setSubject("이사모음.zip 비밀번호 인증 메일입니다.");
        String text = String.format("<h1>해당 링크로 접속 후 비밀번호를 변경해 주세요. 이용시간은 30분까지 입니다.</h1><p>%s/newpassword?query=%s</p>",origin,tempJwt);
        helper.setText(text, true);
        mailSender.send(message);

        ZonedDateTime date = ZonedDateTime.now().plusMinutes(3);
        String expiredAt = date.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);;

        return new FindPasswordResponseDto(tempJwt,expiredAt);
    }

    /**
     * 비밀번호 수정
     * @param requestDto 수정될 password
     * @param user 인증된 사용자
     * @return null
     * **/
    @Transactional
    public void updatePassword(ChangePasswordRequestDto requestDto, User user) {
        String encryptedPassword = passwordEncoder.encode(requestDto.getPassword());

        user.setPassword(encryptedPassword);
        userRepository.save(user);

        String username = user.getUsername();
        redisTemplate.delete(username+"_tempToken");
        redisTemplate.delete(username + "_createdAt");
    }

    // 로그인
    public LoginResponseDto login(LoginRequestDto requestDto, HttpServletResponse response){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestDto.getUsername(),
                        requestDto.getPassword()
                )
        );

        User user = userRepository.findByUsername(requestDto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException());

        // 토큰 생성
        String accessjwt = jwtTokenProvider.accessCreateToken(user);
        String refreshjwt = jwtTokenProvider.refreshCreateToken(user);

        // 쿠키 생성 및 refreshToken 쿠키에 넣기
        Cookie cookie = new Cookie("refreshToken",refreshjwt);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        // refreshToken redis 넣기
        redisTemplate.opsForValue().set(refreshjwt, refreshjwt, 2, TimeUnit.DAYS);

        return new LoginResponseDto(accessjwt, refreshjwt);
    }

    // refresh token 검증 및 access token 재발급
    public AccessTokenResponseDto reissue(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();

        // cookie에서 refresh 추출
        String refresh = findByRefreshToken(cookies);
        if(refresh == null || !jwtTokenProvider.validateToken(refresh)) {
            throw new TokenException();
        }


        String refreshusername = jwtTokenProvider.getUsername(refresh);

        String redistoken = (String) redisTemplate.opsForValue().get(refresh);

        User user = userRepository.findByUsername(refreshusername)
                .orElseThrow(() -> new ResourceNotFoundException());

        String accessjwt = null;

        if(refresh.equals(redistoken)) {
            accessjwt = jwtTokenProvider.accessCreateToken(user);
        } else {
            throw new TokenException();
        }

        return new AccessTokenResponseDto(accessjwt);
    }

    // 로그아웃
    public void logout(HttpServletRequest request, HttpServletResponse response) {


        Cookie[] cookies = request.getCookies();

        // cookie에서 refresh 추출
        String refresh = findByRefreshToken(cookies);
        if(refresh == null) {
            throw new TokenException();
        }

        // redis에서 RefreshToken 삭제
        redisTemplate.delete(refresh);


        // 쿠키에서 RefreshToken 삭제
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }


    ///////////////////////////////////////////////////////////////////////////////
    // 보조 메서드
    ///////////////////////////////////////////////////////////////////////////////

    public String findByRefreshToken(Cookie[] cookies) {
        String refresh = null;

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if(cookie.getName().equals("refreshToken")) {
                    refresh = cookie.getValue();
                    return refresh;
                }
            }
        }
        return refresh;
    }


    /**
     * 사용 중인 username 확인
     * @param userName 입력한 email
     * @return Boolean 이메일 존재 유무
     * **/
    public boolean checkExistsUsername(String userName) {
        return userRepository.existsByUsername(userName);
    }

  
    /**
     * 4자리의 랜덤 수를 redis에 저장
     * @param username 입력한 email
     * @param codeNum     4자리의 랜덤 수
     * @return ZonedDateTime expiredAt
     **/
    public ZonedDateTime saveCodeToRedis(String username, int codeNum) {

        String key = username;
        String code = String.valueOf(codeNum);
        String createdAt = key + "_createdAt";

        redisTemplate.opsForValue().set(key, code, 3, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(createdAt, String.valueOf(LocalDateTime.now()), 3, TimeUnit.MINUTES); // 생성시간
        return ZonedDateTime.now(ZoneId.of("Asia/Seoul")).plusMinutes(3);
    }



}
