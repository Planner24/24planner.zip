package com.example.p24zip.domain.house.service;

import com.example.p24zip.domain.house.dto.request.AddHouseRequestDto;
import com.example.p24zip.domain.house.dto.response.AddHouseResponseDto;
import com.example.p24zip.domain.house.dto.response.KaKaoGeocodeResponse;
import com.example.p24zip.domain.house.dto.response.KaKaoGeocodeResponse.Document;
import com.example.p24zip.domain.house.entity.House;
import com.example.p24zip.domain.house.repository.HouseRepository;
import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.global.exception.GeocoderExceptionHandler;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class HouseService {
    private final HouseRepository houseRepository;
    private final MovingPlanRepository movingPlanRepository;

    @Value("${KAKAO_RESTAPI_KEY}")
    private String restApiKey;


    @Transactional
    public AddHouseResponseDto postHouse(Long movingPlanId, AddHouseRequestDto requestDto) {
        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
            .orElseThrow();
        House house = requestDto.toEntity(movingPlan);

        String address1 = requestDto.getAddress1();
        Document location = Geocoder(address1);
        double latitude = Double.parseDouble(location.getLatitude());
        double longitude = Double.parseDouble(location.getLongitude());

        house.setLatitude(latitude);
        house.setLongtitude(longitude);
        houseRepository.save(house);

        return AddHouseResponseDto.from(house);

    }
    ///////////////////////////////////////////////////////////////////////////////
    // 보조 메서드
    ///////////////////////////////////////////////////////////////////////////////
    private Document Geocoder(String address1) {

        WebClient webClient = WebClient.builder()
            .baseUrl("https://dapi.kakao.com/v2/local/search/address.json")
            .build();

        KaKaoGeocodeResponse coordinates = webClient.get().uri(uriBuilder -> uriBuilder.queryParam("query",address1).build())
            .header("Authorization", "KakaoAK " + restApiKey)
            .retrieve()
            .bodyToMono(KaKaoGeocodeResponse.class).block();


        if(coordinates != null && !coordinates.getDocuments().isEmpty()){
            KaKaoGeocodeResponse.Document location = coordinates.getDocuments().get(0);
            return location;
        }else {
            throw new GeocoderExceptionHandler("GEOCODER_API_CONVERT_ERROR","좌표 변경 API에서 변환 오류가 발생했습니다.");
        }
    }


}
