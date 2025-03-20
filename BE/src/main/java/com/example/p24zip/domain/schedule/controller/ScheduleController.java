package com.example.p24zip.domain.schedule.controller;

import com.example.p24zip.domain.schedule.dto.request.ScheduleCreateRequestDto;
import com.example.p24zip.domain.schedule.dto.response.ScheduleResponseDto;
import com.example.p24zip.domain.schedule.service.ScheduleService;
import com.example.p24zip.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plans/{movingPlanId}/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 할 일 생성
    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponseDto>> createSchedule(
        @RequestBody @Valid ScheduleCreateRequestDto requestDto,
        @PathVariable Long movingPlanId
        ){
        return ResponseEntity.ok(ApiResponse.ok(
            "CREATED",
            "할 일이 생성되었습니다.",
            scheduleService.createSchedule(requestDto, movingPlanId)
        ));
    }

}
