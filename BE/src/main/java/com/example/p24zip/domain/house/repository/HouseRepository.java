package com.example.p24zip.domain.house.repository;

import com.example.p24zip.domain.house.entity.House;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseRepository  extends JpaRepository<House, Long> {

}
