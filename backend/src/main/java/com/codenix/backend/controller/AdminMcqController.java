package com.codenix.backend.controller;

import com.codenix.backend.dto.McqDto;
import com.codenix.backend.dto.McqRequest;
import com.codenix.backend.service.AdminMcqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/mcqs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminMcqController {

    private final AdminMcqService adminMcqService;

    @GetMapping
    public Page<McqDto> listMcqs(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return adminMcqService.listMcqs(search, page, size);
    }

    @GetMapping("/{id}")
    public McqDto get(@PathVariable Long id) {
        return adminMcqService.get(id);
    }

    @PostMapping
    public McqDto create(@Valid @RequestBody McqRequest request) {
        return adminMcqService.create(request);
    }

    @PutMapping("/{id}")
    public McqDto update(@PathVariable Long id, @Valid @RequestBody McqRequest request) {
        return adminMcqService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        adminMcqService.delete(id);
    }

    @PatchMapping("/{id}/status")
    public McqDto updateStatus(@PathVariable Long id, @RequestBody McqRequest request) {
        return adminMcqService.updateStatus(id, request.getStatus());
    }

    @PatchMapping("/{id}/publish")
    public McqDto publish(@PathVariable Long id) {
        return adminMcqService.updateStatus(id, "PUBLISHED");
    }
}
