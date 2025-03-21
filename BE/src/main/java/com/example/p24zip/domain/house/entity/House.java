package com.example.p24zip.domain.house.entity;

import com.example.p24zip.domain.house.dto.request.ChangeHouseNicknameRequestDto;
import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
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
import org.hibernate.validator.constraints.Length;

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
    @JoinColumn(name = "movingPlan_id", nullable = false)
    private MovingPlan movingPlan;

    @NotBlank
    @Length(max = 5)
    private String nickname;
    @NotBlank
    private String address1;
    private String address2; // 상세 주소
    @NotNull
    private double longitude; // 경도
    @NotNull
    private double latitude; // 위도
    @Column(length = 1000)
    private String content;

    @Builder
    public House(MovingPlan movingPlan, String nickname, String address1,String address2,
        double latitude, double longitude, String content) {
        this.movingPlan = movingPlan;
        this.nickname = nickname;
        this.address1 = address1;
        this.address2 = address2;
        this.latitude = latitude;
        this.longitude = longitude;
        this.content = content;
    }

    public House update(ChangeHouseNicknameRequestDto requestDto) {
        this.nickname = requestDto.getNickname();
        return this;
    }

}
