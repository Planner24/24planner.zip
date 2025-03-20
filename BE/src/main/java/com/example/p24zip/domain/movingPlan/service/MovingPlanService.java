package com.example.p24zip.domain.movingPlan.service;

import com.example.p24zip.domain.movingPlan.dto.request.MovingPlanRequestDto;
import com.example.p24zip.domain.movingPlan.dto.response.MovingPlanResponseDto;
import com.example.p24zip.domain.movingPlan.repository.MovingPlanRepository;
import com.example.p24zip.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MovingPlanService {

    private final MovingPlanRepository movingPlanRepository;

    @Transactional
    public MovingPlanResponseDto createMovingPlan(MovingPlanRequestDto requestDto, User user) {
        return MovingPlanResponseDto.from(movingPlanRepository.save(requestDto.toEntity(user)));
    }

    public List<MovingPlanResponseDto> readMovingPlans(User user) {
        return movingPlanRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(MovingPlanResponseDto::from)
                .toList();
    }
}
