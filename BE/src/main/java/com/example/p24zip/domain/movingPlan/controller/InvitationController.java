package com.example.p24zip.domain.movingPlan.controller;

import com.example.p24zip.domain.movingPlan.dto.response.HousemateInvitationValidationResponseDto;
import com.example.p24zip.domain.movingPlan.service.HousemateService;
import com.example.p24zip.domain.movingPlan.service.InvitationService;
import com.example.p24zip.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/plans/invitations")
public class InvitationController {

    private final HousemateService housemateService;
    private final InvitationService invitationService;

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<HousemateInvitationValidationResponseDto>> validateInvitation(
            @RequestParam String token) {

        return ResponseEntity.ok(ApiResponse.ok(
                "OK",
                "유효한 초대 링크입니다.",
                invitationService.validateInvitationToken(token)
        ));
    }
}
