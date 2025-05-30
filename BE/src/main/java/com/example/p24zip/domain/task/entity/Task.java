package com.example.p24zip.domain.task.entity;

import com.example.p24zip.domain.movingPlan.entity.MovingPlan;
import com.example.p24zip.domain.task.dto.request.TaskCompleteRequestDto;
import com.example.p24zip.domain.task.dto.request.TaskRequestDto;
import com.example.p24zip.domain.taskGroup.entity.TaskGroup;
import com.example.p24zip.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Task extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String content;

    private Boolean isCompleted = false;

    @ManyToOne
    @JoinColumn(name="task_group_id")
    private TaskGroup taskGroup;

    @ManyToOne
    @JoinColumn(name="moving_plan_id")
    private MovingPlan movingPlan;

    @Builder
    public Task(String content, TaskGroup taskGroup, MovingPlan movingPlan) {
        this.content = content;
        this.taskGroup = taskGroup;
        this.movingPlan = movingPlan;
    }

    public Task update(TaskRequestDto requestDto) {
        this.content = requestDto.getContent();

        return this;
    }

    public Task updateIsCompleted(TaskCompleteRequestDto requestDto) {
        this.isCompleted = requestDto.getIsCompleted();

        return this;
    }
}
