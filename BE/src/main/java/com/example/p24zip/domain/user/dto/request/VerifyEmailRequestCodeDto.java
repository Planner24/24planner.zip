package com.example.p24zip.domain.user.dto.request;

import com.example.p24zip.domain.user.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VerifyEmailRequestCodeDto {

    @NotNull
    String username;

    @NotNull
    String code;


}
