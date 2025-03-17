package com.example.p24zip.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
public class RedisConfig {

    // application.yml 또는 application.properties에서 설정값을 가져옵니다.
    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Value("${spring.data.redis.timeout}")
    private int timeout;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory(host, port);
        factory.setTimeout(timeout);  // 연결 타임아웃 설정 (ms 단위)
        return factory;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());  // RedisConnectionFactory 연결 설정

        // 키와 값을 직렬화할 때 사용할 직렬화기 설정 (String으로 직렬화)
        redisTemplate.setKeySerializer(new StringRedisSerializer());  // 키를 String으로 직렬화
        redisTemplate.setValueSerializer(new StringRedisSerializer());  // 값을 String으로 직렬화

        // 해시를 사용할 경우 직렬화기 설정
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(new StringRedisSerializer());

        return redisTemplate;
    }
}