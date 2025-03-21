package com.example.p24zip.domain.taskGroup.service;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.taskGroup.dto.request.TaskGroupRequestDto;
import com.example.p24zip.domain.taskGroup.dto.response.TaskGroupResponseDto;
import com.example.p24zip.domain.taskGroup.entity.TaskGroup;
import com.example.p24zip.domain.taskGroup.repository.TaskGroupRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskGroupService {

    private final TaskGroupRepository taskGroupRepository;
    private final MovingPlanRepository movingPlanRepository;

    // 체크 그룹 생성
    @Transactional
    public TaskGroupResponseDto createSchedule(TaskGroupRequestDto requestDto, Long movingPlanId){

        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
            .orElseThrow(ResourceNotFoundException::new);

        TaskGroup newTaskGroup = taskGroupRepository.save(requestDto.toEntity(movingPlan));

        return TaskGroupResponseDto.from(newTaskGroup);

    }
}
