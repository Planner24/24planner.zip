package com.example.p24zip.domain.chat.dto.request;

import com.example.p24zip.domain.chat.entity.Chat;
import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MessageRequestDto {

    @NotBlank
    private String text;

    public Chat toEntity(MovingPlan movingPlan) {
        return Chat.builder()
                .text(this.text)
                .movingPlan(movingPlan)
                .build();
    }
}
