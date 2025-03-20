package com.example.p24zip.domain.house.entity;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.global.entity.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "house")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class House extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movingPlan_id")
    private MovingPlan movingPlanID;
    @NotBlank
    private String nickname;
    @NotBlank
    private String address;
    @NotNull
    private double latitude; // 위도
    @NotNull
    private double longtiude; // 경도
    private String content;

    @Builder
    public House(MovingPlan movingPlanID, String nickname, String address, double latitude, double longtitude, String content) {
        this.movingPlanID = movingPlanID;
        this.nickname = nickname;
        this.address = address;
        this.latitude = latitude;
        this.longtiude = longtitude;
        this.content = content;

    }


}
