package com.example.p24zip.domain.taskGroup.controller;

import com.example.p24zip.domain.schedule.dto.request.ScheduleRequestDto;
import com.example.p24zip.domain.schedule.dto.response.ScheduleResponseDto;
import com.example.p24zip.domain.taskGroup.dto.request.TaskGroupMemoUpdateRequestDto;
import com.example.p24zip.domain.taskGroup.dto.request.TaskGroupRequestDto;
import com.example.p24zip.domain.taskGroup.dto.response.TaskGroupMemoUpdateResponseDto;
import com.example.p24zip.domain.taskGroup.dto.response.TaskGroupResponseDto;
import com.example.p24zip.domain.taskGroup.service.TaskGroupService;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/plans/{movingPlanId}/taskgroups")
public class TaskGroupController {

    private final TaskGroupService taskGroupService;

    // 체크 그룹 생성
    @PostMapping
    public ResponseEntity<ApiResponse<TaskGroupResponseDto>> createTaskGroup(
        @RequestBody @Valid TaskGroupRequestDto requestDto,
        @PathVariable Long movingPlanId,
        @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(ApiResponse.ok(
            "CREATED",
            "체크 그룹 생성에 성공했습니다.",
            taskGroupService.createSchedule(requestDto, movingPlanId)
        ));
    }

    // 체크 그룹 제목 수정
    @PatchMapping("/{taskGroupId}/title")
    public ResponseEntity<ApiResponse<TaskGroupResponseDto>> updateTaskGroupTitle(
        @Valid @RequestBody TaskGroupRequestDto requestDto,
        @PathVariable Long taskGroupId,
        @PathVariable Long movingPlanId,
        @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(ApiResponse.ok(
            "UPDATED",
            "체크 그룹 제목 수정에 성공했습니다.",
            taskGroupService.updateTaskGroupTitle(requestDto, taskGroupId, movingPlanId)
        ));
    }

    // 체크 그룹 메모 수정
    @PatchMapping("/{taskGroupId}/memo")
    public ResponseEntity<ApiResponse<TaskGroupMemoUpdateResponseDto>> updateTaskGroupMemo(
        @Valid @RequestBody TaskGroupMemoUpdateRequestDto requestDto,
        @PathVariable Long taskGroupId,
        @PathVariable Long movingPlanId,
        @AuthenticationPrincipal User user
    ){
        return ResponseEntity.ok(ApiResponse.ok(
            "UPDATED",
            "체크 그룹 메모 수정에 성공했습니다.",
            taskGroupService.updateTaskGroupMemo(requestDto, taskGroupId, movingPlanId)
        ));
    }

    // 체크 그룹 삭제
    @DeleteMapping("/{taskGroupId}")
    public ResponseEntity<ApiResponse<Object>> deleteTaskGroup(
        @PathVariable Long taskGroupId,
        @PathVariable Long movingPlanId,
        @AuthenticationPrincipal User user
    ){
        taskGroupService.deleteTaskGroup(taskGroupId, movingPlanId);
        return ResponseEntity.ok(ApiResponse.ok(
            "DELETED",
            "체크 그룹 삭제에 성공했습니다.",
            null
        ));
    }
}
