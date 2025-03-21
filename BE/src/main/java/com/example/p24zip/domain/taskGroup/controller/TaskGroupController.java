package com.example.p24zip.domain.taskGroup.controller;

import com.example.p24zip.domain.taskGroup.dto.request.TaskGroupRequestDto;
import com.example.p24zip.domain.taskGroup.dto.response.TaskGroupResponseDto;
import com.example.p24zip.domain.taskGroup.service.TaskGroupService;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
}
