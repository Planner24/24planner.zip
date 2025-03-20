package com.example.p24zip.domain.schedule.service;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.schedule.dto.request.ScheduleCreateRequestDto;
import com.example.p24zip.domain.schedule.dto.response.ScheduleResponseDto;
import com.example.p24zip.domain.schedule.entity.Schedule;
import com.example.p24zip.domain.schedule.repository.ScheduleRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final MovingPlanRepository movingPlanRepository;

    // 할 일 생성
    public ScheduleResponseDto createSchedule(ScheduleCreateRequestDto requestDto, Long movingPlanId){

        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
            .orElseThrow(() -> new ResourceNotFoundException());

        Schedule newSchedule = scheduleRepository.save(requestDto.toEntity(movingPlan));

        return ScheduleResponseDto.from(newSchedule);
    }
}
