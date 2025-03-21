package com.example.p24zip.domain.taskGroup.service;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.taskGroup.dto.request.TaskGroupMemoUpdateRequestDto;
import com.example.p24zip.domain.taskGroup.dto.request.TaskGroupRequestDto;
import com.example.p24zip.domain.taskGroup.dto.response.TaskGroupMemoUpdateResponseDto;
import com.example.p24zip.domain.taskGroup.dto.response.TaskGroupResponseDto;
import com.example.p24zip.domain.taskGroup.entity.TaskGroup;
import com.example.p24zip.domain.taskGroup.repository.TaskGroupRepository;
import com.example.p24zip.global.exception.CustomException;
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
    public TaskGroupResponseDto createTaskGroup(TaskGroupRequestDto requestDto, Long movingPlanId){

        MovingPlan movingPlan = movingPlanRepository.findById(movingPlanId)
            .orElseThrow(ResourceNotFoundException::new);

        TaskGroup newTaskGroup = taskGroupRepository.save(requestDto.toEntity(movingPlan));

        return TaskGroupResponseDto.from(newTaskGroup);
    }

    // 체크 그룹 제목 수정
    @Transactional
    public TaskGroupResponseDto updateTaskGroupTitle(TaskGroupRequestDto requestDto, Long taskGroupId, Long movingPlanId){

        TaskGroup taskGroup = taskGroupRepository.findById(taskGroupId)
            .orElseThrow(ResourceNotFoundException::new);

        // 체크 그룹의 이사 플랜 아이디와 입력 받은 이사 플랜 아이디 값이 다른 경우
        if(!taskGroup.getMovingPlan().getId().equals(movingPlanId)){
            throw new CustomException("UNMATCHED_ID", "체크 그룹을 작성한 이사 플랜에서 수정 가능합니다.");
        }

        TaskGroup newTaskGroup = taskGroup.updateTitle(requestDto);

        return TaskGroupResponseDto.from(newTaskGroup);
    }

    // 체크 그룹 메모 수정
    @Transactional
    public TaskGroupMemoUpdateResponseDto updateTaskGroupMemo(TaskGroupMemoUpdateRequestDto requestDto, Long taskGroupId, Long movingPlanId){

        TaskGroup taskGroup = taskGroupRepository.findById(taskGroupId)
            .orElseThrow(ResourceNotFoundException::new);

        // 체크 그룹의 이사 플랜 아이디와 입력 받은 이사 플랜 아이디 값이 다른 경우
        if(!taskGroup.getMovingPlan().getId().equals(movingPlanId)){
            throw new CustomException("UNMATCHED_ID", "체크 그룹을 작성한 이사 플랜에서 수정 가능합니다.");
        }

        TaskGroup newTaskGroup = taskGroup.updateMemo(requestDto);

        return TaskGroupMemoUpdateResponseDto.from(newTaskGroup);
    }

    // 체크 그룹 삭제
    @Transactional
    public void deleteTaskGroup(Long taskGroupId, Long movingPlanId){

        TaskGroup taskGroup = taskGroupRepository.findById(taskGroupId)
            .orElseThrow(ResourceNotFoundException::new);

        // 체크 그룹의 이사 플랜 아이디와 입력 받은 이사 플랜 아이디 값이 다른 경우
        if(!taskGroup.getMovingPlan().getId().equals(movingPlanId)){
            throw new CustomException("UNMATCHED_ID", "체크 그룹을 작성한 이사 플랜에서 삭제 가능합니다.");
        }

        taskGroupRepository.delete(taskGroup);
    }
}
