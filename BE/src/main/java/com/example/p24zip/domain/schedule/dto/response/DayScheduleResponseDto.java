package com.example.p24zip.domain.schedule.dto.response;

import com.example.p24zip.domain.schedule.entity.Schedule;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class DayScheduleResponseDto {

    private final Long id;
    private final String content;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final String color;

    public static DayScheduleResponseDto from(Schedule schedule){
        return DayScheduleResponseDto.builder()
            .id(schedule.getId())
            .content(schedule.getContent())
            .startDate(schedule.getStartDate())
            .endDate(schedule.getEndDate())
            .color(schedule.getColor())
            .build();
    }
}
