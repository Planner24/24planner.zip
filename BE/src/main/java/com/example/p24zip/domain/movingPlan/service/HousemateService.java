package com.example.p24zip.domain.movingPlan.service;

import com.example.p24zip.domain.movingPlan.entity.Housemate;
import com.example.p24zip.domain.movingPlan.repository.HousemateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.module.ResolutionException;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class HousemateService {

    private final HousemateRepository housemateRepository;

    @Transactional
    public void deleteHousemate(Long id) {
        Housemate housemate = housemateRepository.findById(id)
                .orElseThrow(ResolutionException::new);

        housemateRepository.delete(housemate);
    }
}
