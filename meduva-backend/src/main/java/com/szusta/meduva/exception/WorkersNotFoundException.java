package com.szusta.meduva.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class WorkersNotFoundException extends RuntimeException {

    public static final long serialVersionUID = 1L;

    public WorkersNotFoundException(String message) {
        super(message);
    }
}
