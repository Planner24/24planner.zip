package com.example.p24zip.domain.schedule.service;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.schedule.dto.request.ScheduleCreateRequestDto;
import com.example.p24zip.domain.schedule.dto.response.ScheduleListResponseDto;
import com.example.p24zip.domain.schedule.dto.response.ScheduleResponseDto;
import com.example.p24zip.domain.schedule.entity.Schedule;
import com.example.p24zip.domain.schedule.repository.ScheduleRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import java.time.YearMonth;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final MovingPlanRepository movingPlanRepository;

    // 할 일 생성
    @Transactional
    public ScheduleResponseDto createSchedule(ScheduleCreateRequestDto requestDto, Long movingPlanId){

        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
            .orElseThrow(ResourceNotFoundException::new);

        Schedule newSchedule = scheduleRepository.save(requestDto.toEntity(movingPlan));

        return ScheduleResponseDto.from(newSchedule);
    }

    // 할 일 전체 조회
    public ScheduleListResponseDto getSchedules(Long movingPlanId, YearMonth month){

        List<Schedule> allSchedules = scheduleRepository.findAllByMovingPlanId(movingPlanId);

        int monthValue = month.getMonthValue();

        List<ScheduleResponseDto> scheduleInMonth = allSchedules.stream()
            .filter(schedule -> isScheduleInMonth(schedule, monthValue))
            .map(ScheduleResponseDto :: from)
            .toList();

        return ScheduleListResponseDto.from(month, scheduleInMonth);
    }

    // 검색한 달의 스케줄인지 확인
    private boolean isScheduleInMonth(Schedule schedule, int monthValue){
        return schedule.getStartDate().getMonthValue() == monthValue
            || schedule.getEndDate().getMonthValue() == monthValue;
    }
}
