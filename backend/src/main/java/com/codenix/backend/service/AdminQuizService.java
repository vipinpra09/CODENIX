package com.codenix.backend.service;

import com.codenix.backend.dto.McqDto;
import com.codenix.backend.dto.QuizDto;
import com.codenix.backend.dto.QuizRequest;
import com.codenix.backend.entity.Difficulty;
import com.codenix.backend.entity.Mcq;
import com.codenix.backend.entity.McqStatus;
import com.codenix.backend.entity.Quiz;
import com.codenix.backend.entity.QuizQuestion;
import com.codenix.backend.repository.McqRepository;
import com.codenix.backend.repository.QuizQuestionRepository;
import com.codenix.backend.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminQuizService {

    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final McqRepository mcqRepository;

    @Transactional(readOnly = true)
    public Page<QuizDto> listQuizzes(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(Math.max(size, 1), 100), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Quiz> quizzes = (search == null || search.isBlank())
                ? quizRepository.findAll(pageable)
                : quizRepository.findByTitleContainingIgnoreCase(search.trim(), pageable);
        Map<Long, Long> counts = quizRepository.countQuestionsByQuiz().stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));
        return quizzes.map(quiz -> toListItemDto(quiz, counts.getOrDefault(quiz.getId(), 0L)));
    }

    @Transactional(readOnly = true)
    public QuizDto get(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        return toDto(quiz);
    }

    @Transactional
    public QuizDto create(QuizRequest request) {
        Quiz quiz = new Quiz();
        apply(quiz, request);
        quiz = quizRepository.save(quiz);
        if (request.getMcqIds() != null) {
            int position = 0;
            for (Long mcqId : request.getMcqIds()) {
                addQuestion(quiz, mcqId, position++);
            }
        }
        return toDto(quiz);
    }

    @Transactional
    public QuizDto update(Long id, QuizRequest request) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        apply(quiz, request);
        return toDto(quizRepository.save(quiz));
    }

    @Transactional
    public void delete(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        quizRepository.delete(quiz);
    }

    @Transactional
    public QuizDto updateStatus(Long id, String status) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        quiz.setStatus(parseStatus(status));
        return toDto(quizRepository.save(quiz));
    }

    @Transactional
    public QuizDto addQuestion(Long quizId, Long mcqId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        if (quizQuestionRepository.findByQuizIdAndMcqId(quizId, mcqId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "MCQ already in quiz");
        }
        addQuestion(quiz, mcqId, (int) quizQuestionRepository.countByQuizId(quizId));
        return toDto(quiz);
    }

    @Transactional
    public QuizDto removeQuestion(Long quizId, Long mcqId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found"));
        if (quizQuestionRepository.findByQuizIdAndMcqId(quizId, mcqId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "MCQ not in quiz");
        }
        quizQuestionRepository.deleteByQuizIdAndMcqId(quizId, mcqId);
        return toDto(quiz);
    }

    private void addQuestion(Quiz quiz, Long mcqId, int position) {
        Mcq mcq = mcqRepository.findById(mcqId)
                .orElseThrow(() -> new IllegalArgumentException("MCQ not found"));
        QuizQuestion quizQuestion = new QuizQuestion();
        quizQuestion.setQuiz(quiz);
        quizQuestion.setMcq(mcq);
        quizQuestion.setPosition(position);
        quizQuestionRepository.save(quizQuestion);
    }

    private void apply(Quiz quiz, QuizRequest request) {
        quiz.setTitle(request.getTitle().trim());
        quiz.setDescription(request.getDescription() == null ? null : request.getDescription().trim());
        quiz.setTopic(request.getTopic().trim());
        quiz.setDifficulty(parseDifficulty(request.getDifficulty()));
        quiz.setPassingPercentage(request.getPassingPercentage());
        quiz.setXp(request.getXp());
        quiz.setStatus(parseStatus(request.getStatus()));
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

    private QuizDto toDto(Quiz quiz) {
        List<McqDto> questions = quizQuestionRepository.findByQuizIdOrderByPosition(quiz.getId()).stream()
                .map(qq -> toMcqDto(qq.getMcq()))
                .toList();
        return QuizDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .topic(quiz.getTopic())
                .difficulty(quiz.getDifficulty().name())
                .passingPercentage(quiz.getPassingPercentage())
                .xp(quiz.getXp())
                .status(quiz.getStatus().name())
                .questionCount(questions.size())
                .questions(questions)
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }

    private QuizDto toListItemDto(Quiz quiz, long questionCount) {
        return QuizDto.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .topic(quiz.getTopic())
                .difficulty(quiz.getDifficulty().name())
                .passingPercentage(quiz.getPassingPercentage())
                .xp(quiz.getXp())
                .status(quiz.getStatus().name())
                .questionCount((int) questionCount)
                .questions(List.of())
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }

    private McqDto toMcqDto(Mcq mcq) {
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
                .build();
    }
}
