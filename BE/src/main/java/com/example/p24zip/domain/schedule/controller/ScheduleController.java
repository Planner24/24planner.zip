package com.example.p24zip.domain.schedule.controller;

import com.example.p24zip.domain.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plans/{movingPlanId}/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

}
