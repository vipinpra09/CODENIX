package com.codenix.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiErrorDto {
    private String message;
    private int status;
    private String path;
}
