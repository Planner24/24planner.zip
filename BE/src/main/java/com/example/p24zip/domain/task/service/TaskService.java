package com.example.p24zip.domain.task.service;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.task.dto.request.TaskRequestDto;
import com.example.p24zip.domain.task.dto.response.TaskResponseDto;
import com.example.p24zip.domain.task.repository.TaskRepository;
import com.example.p24zip.domain.taskGroup.entity.TaskGroup;
import com.example.p24zip.domain.taskGroup.repository.TaskGroupRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final MovingPlanRepository movingPlanRepository;
    private final TaskGroupRepository taskGroupRepository;

    @Transactional
    public TaskResponseDto createTask(Long movingPlanId, Long taskGroupId, TaskRequestDto requestDto) {
        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
                .orElseThrow(ResourceNotFoundException::new);
        TaskGroup taskGroup = taskGroupRepository.findById(taskGroupId)
                .orElseThrow(ResourceNotFoundException::new);

        if (!taskGroup.getMovingPlan().getId().equals(movingPlanId)) {
            throw new ResourceNotFoundException();
        }

        return TaskResponseDto.from(taskRepository.save(requestDto.toEntity(movingPlan, taskGroup)));
    }
}
