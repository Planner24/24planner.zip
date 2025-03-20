package com.example.p24zip.domain.house.dto.response;

import com.example.p24zip.domain.house.entity.House;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AddHouseResponseDto {
    private Long id;
    private String nickname;
    private String address1;
    private String address2;
    private double longtitude;
    private double latitude;

    public static AddHouseResponseDto from (House house){
        return AddHouseResponseDto.builder()
            .id(house.getId())
            .nickname(house.getNickname())
            .address1(house.getAddress1())
            .address2(house.getAddress2())
            .longtitude(house.getLongtitude())
            .latitude(house.getLatitude())
            .build();
    }
}
