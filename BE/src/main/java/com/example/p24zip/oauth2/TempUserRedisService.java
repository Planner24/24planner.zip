package com.example.p24zip.oauth2;

import com.example.p24zip.global.security.jwt.JwtTokenProvider;
import com.example.p24zip.oauth2.userinfo.OAuthUserInfo;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TempUserRedisService {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    private static final long TEMP_USER_EXPIRE_MINUTES = 10; // 10분 유지

    public String saveTempUser(OAuthUserInfo oAuthInfo) {
        String tempToken = jwtTokenProvider.getTempToken(oAuthInfo);
        String key = oAuthInfo.getEmail();

        redisTemplate.opsForValue().set(key, tempToken, TEMP_USER_EXPIRE_MINUTES, TimeUnit.MINUTES);
        return tempToken;
    }

    public String getTempUser(String tempToken) {

            String email = jwtTokenProvider.getEmailFromToken(tempToken);
            String value = redisTemplate.opsForValue().get(email);

            if (value == null || !value.equals(tempToken)) throw new IllegalArgumentException("유효하지 않은 토큰");

            return email;
    }

    public void deleteTempUser(String email) {
        redisTemplate.delete(email);
    }
}

