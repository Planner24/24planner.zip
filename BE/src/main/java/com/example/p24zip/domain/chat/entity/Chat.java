package com.example.p24zip.domain.chat.entity;


import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chat extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="moving_plan_id")
    private MovingPlan movingPlan;

    private String text;

    @Builder
    public Chat(String text, MovingPlan movingPlan) {
        this.text = text;
        this.movingPlan = movingPlan;
    }
}
