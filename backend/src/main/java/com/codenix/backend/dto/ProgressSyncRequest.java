package com.codenix.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressSyncRequest {
    @Valid
    @NotNull
    private GuestProgressDto guestProgress;
}
