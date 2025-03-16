package com.example.p24zip.global.exception;

import lombok.Getter;

@Getter
public class ExistEmailException extends RuntimeException {

    private final String code;

    public ExistEmailException(String code, String message) {
        super(message);
        this.code = code;
    }

}
