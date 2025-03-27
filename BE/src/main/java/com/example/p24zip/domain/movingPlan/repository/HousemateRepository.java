package com.example.p24zip.domain.movingPlan.repository;

import com.example.p24zip.domain.movingPlan.entity.Housemate;
import com.example.p24zip.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HousemateRepository extends JpaRepository<Housemate, Long> {

    List<Housemate> findByUserOrderByMovingPlanCreatedAtDesc(User user);

}
