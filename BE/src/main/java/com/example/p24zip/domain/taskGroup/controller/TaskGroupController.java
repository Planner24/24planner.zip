package com.example.p24zip.domain.taskGroup.controller;

import com.example.p24zip.domain.taskGroup.service.TaskGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/plans/{movingPlanId}/taskgroups")
public class TaskGroupController {

    private final TaskGroupService taskGroupService;

}
