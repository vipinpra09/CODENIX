package com.codenix.backend.service;

import com.codenix.backend.dto.McqDto;
import com.codenix.backend.dto.McqRequest;
import com.codenix.backend.entity.Difficulty;
import com.codenix.backend.entity.Mcq;
import com.codenix.backend.entity.McqStatus;
import com.codenix.backend.repository.McqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AdminMcqService {

    private final McqRepository mcqRepository;

    @Transactional(readOnly = true)
    public Page<McqDto> listMcqs(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(Math.max(size, 1), 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Mcq> mcqs = (search == null || search.isBlank())
                ? mcqRepository.findAll(pageable)
                : mcqRepository.findByQuestionContainingIgnoreCase(search.trim(), pageable);
        return mcqs.map(this::toDto);
    }

    @Transactional
    public McqDto create(McqRequest request) {
        Mcq mcq = new Mcq();
        apply(mcq, request);
        return toDto(mcqRepository.save(mcq));
    }

    @Transactional(readOnly = true)
    public McqDto get(Long id) {
        Mcq mcq = mcqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MCQ not found"));
        return toDto(mcq);
    }

    @Transactional
    public McqDto update(Long id, McqRequest request) {
        Mcq mcq = mcqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MCQ not found"));
        apply(mcq, request);
        return toDto(mcqRepository.save(mcq));
    }

    @Transactional
    public void delete(Long id) {
        Mcq mcq = mcqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MCQ not found"));
        mcqRepository.delete(mcq);
    }

    @Transactional
    public McqDto updateStatus(Long id, String status) {
        Mcq mcq = mcqRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("MCQ not found"));
        mcq.setStatus(parseStatus(status));
        return toDto(mcqRepository.save(mcq));
    }

    private void apply(Mcq mcq, McqRequest request) {
        mcq.setQuestion(request.getQuestion().trim());
        mcq.setOptionA(request.getOptionA().trim());
        mcq.setOptionB(request.getOptionB().trim());
        mcq.setOptionC(request.getOptionC().trim());
        mcq.setOptionD(request.getOptionD().trim());
        if (request.getCorrectAnswer() < 0 || request.getCorrectAnswer() > 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "correctAnswer must be between 0 and 3");
        }
        mcq.setCorrectAnswer(request.getCorrectAnswer());
        mcq.setTopic(request.getTopic().trim());
        mcq.setDifficulty(parseDifficulty(request.getDifficulty()));
        mcq.setExplanation(request.getExplanation() == null ? null : request.getExplanation().trim());
        mcq.setXp(request.getXp());
        mcq.setStatus(parseStatus(request.getStatus()));
    }

    private Difficulty parseDifficulty(String difficulty) {
        try {
            return Difficulty.valueOf(difficulty.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid difficulty");
        }
    }

    private McqStatus parseStatus(String status) {
        try {
            return McqStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }
    }

    private McqDto toDto(Mcq mcq) {
        return McqDto.builder()
                .id(mcq.getId())
                .question(mcq.getQuestion())
                .optionA(mcq.getOptionA())
                .optionB(mcq.getOptionB())
                .optionC(mcq.getOptionC())
                .optionD(mcq.getOptionD())
                .correctAnswer(mcq.getCorrectAnswer())
                .topic(mcq.getTopic())
                .difficulty(mcq.getDifficulty().name())
                .explanation(mcq.getExplanation())
                .xp(mcq.getXp())
                .status(mcq.getStatus().name())
                .createdAt(mcq.getCreatedAt())
                .updatedAt(mcq.getUpdatedAt())
                .build();
    }
}
