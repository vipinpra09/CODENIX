package com.codenix.backend.service;

import com.codenix.backend.dto.McqRequest;
import com.codenix.backend.entity.Mcq;
import com.codenix.backend.entity.McqStatus;
import com.codenix.backend.repository.McqRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminMcqServiceTest {

    @Mock
    private McqRepository mcqRepository;

    @InjectMocks
    private AdminMcqService adminMcqService;

    private McqRequest validRequest() {
        McqRequest request = new McqRequest();
        request.setQuestion("Which data type stores decimals?");
        request.setOptionA("int");
        request.setOptionB("char");
        request.setOptionC("float");
        request.setOptionD("void");
        request.setCorrectAnswer(2);
        request.setTopic("Variables");
        request.setDifficulty("EASY");
        request.setExplanation("float stores decimal values");
        request.setXp(10);
        request.setStatus("DRAFT");
        return request;
    }

    @Test
    void createShouldMapAllFields() {
        when(mcqRepository.save(any(Mcq.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var dto = adminMcqService.create(validRequest());

        assertEquals("Which data type stores decimals?", dto.getQuestion());
        assertEquals("float", dto.getOptionC());
        assertEquals(2, dto.getCorrectAnswer());
        assertEquals("EASY", dto.getDifficulty());
        assertEquals("DRAFT", dto.getStatus());
        assertEquals(10, dto.getXp());
    }

    @Test
    void updateStatusShouldPersistStatus() {
        Mcq mcq = new Mcq();
        mcq.setId(1L);
        mcq.setQuestion("Q");
        mcq.setOptionA("a");
        mcq.setOptionB("b");
        mcq.setOptionC("c");
        mcq.setOptionD("d");
        mcq.setCorrectAnswer(0);
        mcq.setTopic("t");
        mcq.setDifficulty(com.codenix.backend.entity.Difficulty.EASY);
        mcq.setXp(10);
        when(mcqRepository.findById(1L)).thenReturn(Optional.of(mcq));
        when(mcqRepository.save(any(Mcq.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var dto = adminMcqService.updateStatus(1L, "PUBLISHED");

        assertEquals(McqStatus.PUBLISHED, mcq.getStatus());
        assertEquals("PUBLISHED", dto.getStatus());
    }

    @Test
    void invalidStatusShouldBeRejected() {
        Mcq mcq = new Mcq();
        when(mcqRepository.findById(1L)).thenReturn(Optional.of(mcq));

        assertThrows(ResponseStatusException.class, () -> adminMcqService.updateStatus(1L, "INVALID"));
    }

    @Test
    void missingMcqShouldThrowNotFound() {
        when(mcqRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> adminMcqService.update(99L, validRequest()));
    }
}
