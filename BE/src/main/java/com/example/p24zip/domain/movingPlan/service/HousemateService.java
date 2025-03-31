package com.example.p24zip.domain.movingPlan.service;

import com.example.p24zip.domain.movingPlan.entity.Housemate;
import com.example.p24zip.domain.movingPlan.repository.HousemateRepository;
import com.example.p24zip.global.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class HousemateService {

    private final HousemateRepository housemateRepository;

    @Transactional
    public void deleteHousemate(Long id) {
        Housemate housemate = housemateRepository.findById(id)
                .orElseThrow(ResourceNotFoundException::new);

        housemateRepository.delete(housemate);
    }
}
