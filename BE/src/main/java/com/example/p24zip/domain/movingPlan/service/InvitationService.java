package com.example.p24zip.domain.movingPlan.service;

import com.example.p24zip.domain.movingPlan.dto.response.HousemateInvitationResponseDto;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class InvitationService {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;

    @Value("${ORIGIN}")
    private String origin;

    public HousemateInvitationResponseDto createHouseMateInvitation(Long movingPlanId, User inviter) {

        String token = jwtTokenProvider.invitationToken(movingPlanId, inviter);

        String invitationKey = "invitation:" + token;
        redisTemplate.opsForValue().set(
                invitationKey,
                String.valueOf(movingPlanId),
                24,
                TimeUnit.HOURS
        );

        String invitationLink = origin + "/invite?token=" + token;

        return HousemateInvitationResponseDto.from(invitationLink);
    }
}
