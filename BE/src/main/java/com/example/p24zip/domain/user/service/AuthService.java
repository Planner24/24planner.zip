package com.example.p24zip.domain.user.service;


import com.example.p24zip.domain.chat.entity.Chat;
import com.example.p24zip.domain.chat.repository.ChatRepository;
import com.example.p24zip.domain.house.dto.response.ShowNicknameResponseDto;
import com.example.p24zip.domain.movingPlan.entity.Housemate;
import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.HousemateRepository;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.user.dto.request.ChangeNicknameRequestDto;
import com.example.p24zip.domain.user.dto.request.ChangePasswordRequestDto;
import com.example.p24zip.domain.user.dto.request.LoginRequestDto;
import com.example.p24zip.domain.user.dto.request.OAuthSignupRequestDto;
import com.example.p24zip.domain.user.dto.request.SignupRequestDto;
import com.example.p24zip.domain.user.dto.request.VerifyEmailRequestCodeDto;
import com.example.p24zip.domain.user.dto.request.VerifyEmailRequestDto;
import com.example.p24zip.domain.user.dto.response.OAuthSignupResponseDto;
import com.example.p24zip.domain.user.dto.response.ChangeNicknameResponseDto;
import com.example.p24zip.domain.user.dto.response.FindPasswordResponseDto;
import com.example.p24zip.domain.user.dto.response.RedisValueResponseDto;
import com.example.p24zip.domain.user.dto.response.VerifyEmailDataResponseDto;
import com.example.p24zip.domain.user.dto.response.AccessTokenResponseDto;
import com.example.p24zip.domain.user.dto.response.LoginResponseDto;
import com.example.p24zip.domain.user.entity.Role;
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
import java.util.List;
import java.util.Map;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import java.util.UUID;
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
    private final HousemateRepository housemateRepository;
    private final MovingPlanRepository movingPlanRepository;
    private final ChatRepository chatRepository;

    private final PasswordEncoder passwordEncoder; // 회원가입 시 비밀번호 암호화
    private final JavaMailSender mailSender; // 메일 보내는 객체
    private final StringRedisTemplate redisTemplate; // redis 객체

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    private final TempUserService tempUserService;

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

        if(redisTemplate.hasKey(username+"_mail")){
            LocalDateTime checkAccessTime = LocalDateTime.parse(
            redisTemplate.opsForValue().get(username + "_mail_createdAt"));

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

        if(!redisTemplate.hasKey(username+"_mail")) {
            throw new CustomException("BAD_REQUEST", "인증번호가 틀렸습니다.");
        }
        // -2: 시간 만료
        if(redisTemplate.getExpire(username+"_mail")!=-2){
            if(!code.equals(redisTemplate.opsForValue().get(username+"_mail"))){
               throw new CustomException("BAD_REQUEST", "인증번호가 틀렸습니다.");
            }else{
                redisTemplate.delete(username+"_mail");
                redisTemplate.delete(username + "_mail_createdAt");
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
                redisTemplate.opsForValue().get(username + "_tempToken_createdAt"));

            if(!checkAccessTime.plusSeconds(5).isBefore(ZonedDateTime.now())){
                throw new CustomException("TOOMANY_REQUEST","5초안에 다시 요청했습니다.");
            }
        }

        String tempJwt = jwtTokenProvider.accessCreateToken(user);

        String key = username +"_tempToken";
        redisTemplate.opsForValue().set(key,tempJwt, 10, TimeUnit.MINUTES);
        String createdAt = username + "_tempToken_createdAt";
        redisTemplate.opsForValue().set(createdAt, String.valueOf(ZonedDateTime.now()), 10, TimeUnit.MINUTES); // 생성시간

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(new InternetAddress(mailAddress, "이사모음.zip"));
        helper.setTo(username);
        helper.setSubject("이사모음.zip 비밀번호 인증 메일입니다.");
        String text = String.format("<h1>해당 링크로 접속 후 비밀번호를 변경해 주세요. 이용시간은 10분 입니다. 이용시간이 끝나거나 비밀번호 변경 후에는 해당 링크를 이용할 수 없습니다.</h1><p>%s/newpassword?query=%s</p>",origin,tempJwt);
        helper.setText(text, true);
        mailSender.send(message);

        ZonedDateTime date = ZonedDateTime.now().plusMinutes(2);
        String expiredAt = date.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);;

        return new FindPasswordResponseDto(tempJwt,expiredAt);
    }

    /**
     * 비밀번호 수정
     *
     * @param requestDto 수정될 password
     * @param response
     * @param user       인증된 사용자
     * @return null
     **/
    @Transactional
    public void updatePassword(ChangePasswordRequestDto requestDto, HttpServletResponse response,
        User user) {
        String encryptedPassword = passwordEncoder.encode(requestDto.getPassword());

        user.setPassword(encryptedPassword);
        userRepository.save(user);

        String username = user.getUsername();
        redisTemplate.delete(username+"_tempToken");
        redisTemplate.delete(username + "_tempToken_createdAt");
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
        cookie.setMaxAge(172800);
        cookie.setPath("/");
        response.addCookie(cookie);

        // refreshToken redis 넣기
        redisTemplate.opsForValue().set(refreshjwt, refreshjwt, 2, TimeUnit.DAYS);

        return new LoginResponseDto(accessjwt, user.getNickname());
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


    public ShowNicknameResponseDto getNickname(User user) {
        return new ShowNicknameResponseDto(user.getId(), user.getNickname());
    }

    @Transactional
    public ChangeNicknameResponseDto updateNickname(ChangeNicknameRequestDto requestDto, User user) {

        String nickname = requestDto.getNickname();

        if(userRepository.existsByNickname(nickname)){
            throw new CustomException("EXIST_NICKNAME", "이미 존재하는 닉네임입니다.");
        }

        user.setNickname(nickname);
        userRepository.save(user);

        return new ChangeNicknameResponseDto(user.getId(),user.getNickname());

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

    @Transactional
    public void deleteUser(User user) {
        List<Housemate> housemateList = housemateRepository.findByUserAndIsOwnerTrue(user);
        System.out.println(housemateList);

        List<MovingPlan> movingPlanList = housemateList.stream().map(Housemate::getMovingPlan).toList();
        System.out.println(movingPlanList);

        movingPlanList.forEach(movingPlanRepository::delete);
        userRepository.delete(user);

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

        String key = username+"_mail";
        String code = String.valueOf(codeNum);
        String createdAt = username + "_mail_createdAt";

        redisTemplate.opsForValue().set(key, code, 3, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(createdAt, String.valueOf(LocalDateTime.now()), 3, TimeUnit.MINUTES); // 생성시간
        return ZonedDateTime.now(ZoneId.of("Asia/Seoul")).plusMinutes(3);
    }

    // 기존 사용자 확인 및 신규 사용자 처리
    @Transactional
    public OAuthSignupResponseDto completeSignup(HttpServletRequest request,
        HttpServletResponse response, OAuthSignupRequestDto requestDto) {

        String tempToken = requestDto.getTempToken();
        String nickname = requestDto.getNickname();

        // 임시 사용자 정보 가져오기
        Map<String, String> tempUser = tempUserService.getTempUser(tempToken);

        String username = tempUser.get("email");
        String provider = tempUser.get("provider");
        String providerId = tempUser.get("providerId");

        // 사용자가 이미 존재하는 경우 처리
        if (userRepository.existsByUsername(username)){
            throw new IllegalStateException("이미 가입된 사용자입니다.");
        }

        String password = String.valueOf(UUID.randomUUID());
        // 비밀번호 처리 (UUID를 이용해 기본 비밀번호를 설정하고, 이를 암호화)
        String encodedPassword = passwordEncoder.encode(password);

        // 임시 유저 정보를 일반 사용자로 변환
        User user = User.builder()
            .username(username)
            .password(encodedPassword)
            .nickname(nickname)
            .role(Role.ROLE_USER)
            .provider(provider)
            .providerId(providerId)
            .build();

        // User 엔티티로 저장
        userRepository.save(user);

        // 임시 유저 삭제
        tempUserService.deleteTempUser(user.getUsername());

        // 토큰 생성
        String refreshToken = jwtTokenProvider.refreshCreateToken(user);
        String accessToken = jwtTokenProvider.accessCreateToken(user);

        // 쿠키 생성 및 refreshToken 쿠키에 넣기
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(17800);
        cookie.setPath("/");
        response.addCookie(cookie);

        return OAuthSignupResponseDto.from(nickname, accessToken);
    }

    public RedisValueResponseDto getRedisValue(String key) {
        String value = redisTemplate.opsForValue().get(key);
        if(value == null){
            new ResourceNotFoundException();
        }
        System.out.println(value);
        return new RedisValueResponseDto(value);
    }


}
