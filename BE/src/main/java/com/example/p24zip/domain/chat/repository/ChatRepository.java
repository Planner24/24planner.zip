package com.example.p24zip.domain.chat.repository;

import com.example.p24zip.domain.chat.entity.Chat;
import com.example.p24zip.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
