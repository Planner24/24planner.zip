package com.example.p24zip.domain.taskGroup.service;

import com.example.p24zip.domain.taskGroup.repository.TaskGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskGroupService {

    private final TaskGroupRepository taskGroupRepository;
}
