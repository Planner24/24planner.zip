package com.example.p24zip.domain.schedule.service;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.schedule.dto.request.ScheduleCreateRequestDto;
import com.example.p24zip.domain.schedule.dto.response.DayScheduleListResponseDto;
import com.example.p24zip.domain.schedule.dto.response.DayScheduleResponseDto;
import com.example.p24zip.domain.schedule.dto.response.MonthScheduleListResponseDto;
import com.example.p24zip.domain.schedule.dto.response.ScheduleResponseDto;
import com.example.p24zip.domain.schedule.entity.Schedule;
import com.example.p24zip.domain.schedule.repository.ScheduleRepository;
import com.example.p24zip.global.exception.CustomException;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import java.time.LocalDate;
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

        // 시작 날짜가 종료 날짜 이후인 경우
        if(requestDto.getStartDate().isAfter(requestDto.getEndDate())){
            throw new CustomException("INVALID_DATE", "시작 날짜는 종료 날짜보다 이전이어야 합니다.");
        }

        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
            .orElseThrow(ResourceNotFoundException::new);

        Schedule newSchedule = scheduleRepository.save(requestDto.toEntity(movingPlan));

        return ScheduleResponseDto.from(newSchedule);
    }

    // 할 일 전체 조회 (월별 조회)
    public MonthScheduleListResponseDto getSchedules(Long movingPlanId, YearMonth month){

        List<Schedule> allSchedules = scheduleRepository.findAllByMovingPlanId(movingPlanId);

        int monthValue = month.getMonthValue();

        // 해당 월의 스케줄만 가져오기
        List<ScheduleResponseDto> scheduleInMonth = allSchedules.stream()
            .filter(schedule -> isScheduleInMonth(schedule, monthValue))
            .map(ScheduleResponseDto :: from)
            .toList();

        return MonthScheduleListResponseDto.from(month, scheduleInMonth);
    }

    // 할 일 날짜별 조회
    public DayScheduleListResponseDto getScheduleById(Long movingPlanId, LocalDate date){

        List<Schedule> allSchedules = scheduleRepository.findAllByMovingPlanId(movingPlanId);

        // 해당 날짜의 스케줄만 가져오기
        List<DayScheduleResponseDto> scheduleInDate = allSchedules.stream()
            .filter(schedule -> isScheduleInDay(schedule, date))
            .map(DayScheduleResponseDto :: from)
            .toList();

        return DayScheduleListResponseDto.from(date, scheduleInDate);

    }

    // 해당 달의 스케줄인지 확인
    private boolean isScheduleInMonth(Schedule schedule, int monthValue){

        return schedule.getStartDate().getMonthValue() == monthValue
            || schedule.getEndDate().getMonthValue() == monthValue;
    }

    // 해당 날짜의 스케줄인지 확인
    private boolean isScheduleInDay(Schedule schedule, LocalDate date){

        int startDateResult = date.compareTo(schedule.getStartDate());
        int endDateResult = date.compareTo(schedule.getEndDate());

        return startDateResult >= 0 && endDateResult <= 0;
    }
}
