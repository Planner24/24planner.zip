package com.example.p24zip.domain.movingPlan.controller;

import com.example.p24zip.domain.movingPlan.service.HousemateService;
import com.example.p24zip.domain.user.entity.User;
import com.example.p24zip.global.response.ApiResponse;
import com.example.p24zip.global.validator.MovingPlanValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/plans/{movingPlanId}/housemates")
public class HousemateController {

    private final HousemateService housemateService;
    private final MovingPlanValidator movingPlanValidator;

    @DeleteMapping("/{housemateId}")
    public ResponseEntity<ApiResponse<Object>> deleteHousemate(
            @PathVariable Long movingPlanId,
            @PathVariable Long housemateId,
            @AuthenticationPrincipal User user) {

        movingPlanValidator.validateMovingPlanAccess(movingPlanId, user);

        housemateService.deleteHousemate(housemateId);

        return ResponseEntity.ok(ApiResponse.ok(
                "DELETED",
                "동거인 삭제에 성공했습니다.",
                null
        ));
    }
}
