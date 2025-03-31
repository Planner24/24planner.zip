package com.example.p24zip.oauth2;

import com.example.p24zip.oauth2.userinfo.OAuthUserInfo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TempUserRedisService {

    private final StringRedisTemplate redisTemplate;
    private static final String TEMP_USER_PREFIX = "temp:user:"; // Redis 키 접두사
    private static final long TEMP_USER_EXPIRE_MINUTES = 10; // 임시 데이터 유지 시간

    // 임시 사용자 정보 저장 (소셜 정보 + UUID)
    public String saveTempUser(OAuthUserInfo oAuthInfo) {
        String tempToken = UUID.randomUUID().toString();
        String key = TEMP_USER_PREFIX + tempToken;

        // JSON 형태로 저장 (provider, providerId, email)
        try {
            ObjectMapper mapper = new ObjectMapper();
            String value = mapper.writeValueAsString(oAuthInfo);
            redisTemplate.opsForValue().set(key, value, TEMP_USER_EXPIRE_MINUTES, TimeUnit.MINUTES);
            return tempToken;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("임시 사용자 저장 실패");
        }
    }

    // 임시 사용자 정보 조회
    public OAuthUserInfo getTempUser(String tempToken) {
        String key = TEMP_USER_PREFIX + tempToken;
        String value = redisTemplate.opsForValue().get(key);
        if (value == null) throw new IllegalArgumentException("유효하지 않은 토큰");

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(value, OAuthUserInfo.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("임시 사용자 조회 실패");
        }
    }

    // 임시 데이터 삭제 (회원가입 완료 시)
    public void deleteTempUser(String tempToken) {
        redisTemplate.delete(TEMP_USER_PREFIX + tempToken);
    }
}
