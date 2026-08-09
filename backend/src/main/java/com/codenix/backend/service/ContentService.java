package com.codenix.backend.service;

import com.codenix.backend.entity.Difficulty;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ContentService {

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

    private final List<Map<String, Object>> quizzes = List.of(
            Map.of("id", "q1", "topic", "basics", "question", "Entry function in C?", "options", List.of("main", "start", "run", "init"), "correct", 0),
            Map.of("id", "q2", "topic", "basics", "question", "Valid format for integer in printf?", "options", List.of("%f", "%d", "%c", "%s"), "correct", 1)
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
        return quizzes.stream().filter(item -> item.get("topic").equals(topic)).toList();
    }

    public List<Integer> quizAnswerKey(String quizId) {
        return quizzes.stream()
                .filter(item -> item.get("id").equals(quizId))
                .map(item -> (Integer) item.get("correct"))
                .toList();
    }
}
