package com.example.p24zip.domain.movingPlan.dto.response;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HousemateInvitationValidationResponseDto {

    private String planTitle;
    private String inviterName;

    public static HousemateInvitationValidationResponseDto from(MovingPlan movingPlan, User user) {
        return HousemateInvitationValidationResponseDto.builder()
                .planTitle(movingPlan.getTitle())
                .inviterName(user.getNickname())
                .build();
    }
}
