package com.codenix.backend.service;

import com.codenix.backend.entity.Difficulty;
import com.codenix.backend.entity.Mcq;
import com.codenix.backend.entity.McqStatus;
import com.codenix.backend.repository.McqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final McqRepository mcqRepository;

    private final List<Map<String, Object>> lessons = List.of(
            Map.of("id", "intro-c", "title", "Introduction to C", "topic", "Basics"),
            Map.of("id", "program-structure", "title", "Structure of a C program", "topic", "Basics"),
            Map.of("id", "variables-types", "title", "Variables and data types", "topic", "Variables"),
            Map.of("id", "operators", "title", "Operators", "topic", "Operators"),
            Map.of("id", "conditionals", "title", "Conditionals", "topic", "Control Flow"),
            Map.of("id", "loops", "title", "Loops", "topic", "Control Flow"),
            Map.of("id", "functions", "title", "Functions", "topic", "Functions"),
            Map.of("id", "arrays", "title", "Arrays", "topic", "Arrays"),
            Map.of("id", "strings", "title", "Strings", "topic", "Strings"),
            Map.of("id", "pointers", "title", "Pointers", "topic", "Pointers"),
            Map.of("id", "structures", "title", "Structures", "topic", "Structures"),
            Map.of("id", "file-handling", "title", "File handling", "topic", "Files")
    );

    private final List<Map<String, Object>> problems = List.of(
            Map.of("id", "problem-1", "title", "Print Hello World", "difficulty", Difficulty.BEGINNER.name(), "topic", "Basics"),
            Map.of("id", "problem-2", "title", "Add Two Numbers", "difficulty", Difficulty.EASY.name(), "topic", "Operators"),
            Map.of("id", "problem-3", "title", "Largest of Three", "difficulty", Difficulty.EASY.name(), "topic", "Conditionals"),
            Map.of("id", "problem-4", "title", "Factorial", "difficulty", Difficulty.EASY.name(), "topic", "Loops"),
            Map.of("id", "problem-5", "title", "Palindrome", "difficulty", Difficulty.MEDIUM.name(), "topic", "Loops")
    );

    public List<Map<String, Object>> lessons() {
        return lessons;
    }

    public Optional<Map<String, Object>> lessonById(String id) {
        return lessons.stream().filter(item -> item.get("id").equals(id)).findFirst();
    }

    public List<Map<String, Object>> problems() {
        return problems;
    }

    public Optional<Map<String, Object>> problemById(String id) {
        return problems.stream().filter(item -> item.get("id").equals(id)).findFirst();
    }

    public List<Map<String, Object>> quizzesByTopic(String topic) {
        return mcqRepository.findByStatusAndTopicOrderById(McqStatus.PUBLISHED, topic).stream()
                .map(this::quizMap)
                .toList();
    }

    public List<Integer> quizAnswerKey(String quizId) {
        try {
            return mcqRepository.findById(Long.parseLong(quizId))
                    .filter(mcq -> mcq.getStatus() == McqStatus.PUBLISHED)
                    .map(mcq -> List.of(mcq.getCorrectAnswer()))
                    .orElseGet(List::of);
        } catch (NumberFormatException ex) {
            return List.of();
        }
    }

    private Map<String, Object> quizMap(Mcq mcq) {
        return Map.of(
                "id", String.valueOf(mcq.getId()),
                "topic", mcq.getTopic(),
                "question", mcq.getQuestion(),
                "options", List.of(mcq.getOptionA(), mcq.getOptionB(), mcq.getOptionC(), mcq.getOptionD()),
                "correct", mcq.getCorrectAnswer()
        );
    }
}
