package com.codenix.backend.security;

import com.codenix.backend.entity.AppUser;
import com.codenix.backend.entity.Role;
import com.codenix.backend.repository.AppUserRepository;
import com.codenix.backend.repository.McqRepository;
import com.codenix.backend.repository.QuizRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:codenix;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.flyway.enabled=true",
        "spring.security.oauth2.client.registration.google.client-id=test-client-id",
        "spring.security.oauth2.client.registration.google.client-secret=test-client-secret"
})
class AdminSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private McqRepository mcqRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        appUserRepository.deleteAll();
        mcqRepository.deleteAll();
        quizRepository.deleteAll();
    }

    @Test
    void guestCannotAccessAdminApi() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void studentCannotAccessAdminApi() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard").with(user("student@example.com").roles("STUDENT")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminCanAccessAdminApi() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard").with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk());
    }

    @Test
    void storedRoleMatchesEntityField() {
        AppUser user = new AppUser();
        user.setGoogleId("g-1");
        user.setEmail("student@example.com");
        user.setName("Student");
        user.setRole(Role.STUDENT);
        AppUser saved = appUserRepository.save(user);

        AppUser loaded = appUserRepository.findById(saved.getId()).orElseThrow();
        assertEquals(Role.STUDENT, loaded.getRole());
    }

    @Test
    void adminCanCreateAndPublishMcq() throws Exception {
        String created = mockMvc.perform(post("/api/admin/mcqs")
                        .with(user("admin@example.com").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mcqJson("Which data type stores decimals?")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode node = objectMapper.readTree(created);
        assertEquals("Which data type stores decimals?", node.get("question").asText());
        long mcqId = node.get("id").asLong();

        mockMvc.perform(patch("/api/admin/mcqs/{id}/publish", mcqId)
                        .with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PUBLISHED"));

        mockMvc.perform(get("/api/admin/dashboard").with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMcqs").value(1))
                .andExpect(jsonPath("$.publishedMcqs").value(1));
    }

    @Test
    void publishedMcqIsServedToStudentsButDraftIsNot() throws Exception {
        long draftId = createMcq("Draft question");
        long publishedId = createMcq("Published question");

        mockMvc.perform(patch("/api/admin/mcqs/{id}/publish", publishedId)
                        .with(user("admin@example.com").roles("ADMIN")))
                .andExpect(status().isOk());

        // Public quiz endpoint (students) must only contain the published MCQ.
        mockMvc.perform(get("/api/quizzes/{topic}", "Variables"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(String.valueOf(publishedId)))
                .andExpect(jsonPath("$[0].correct").value(2));

        // Submitting a draft (unpublished) question scores 0 with 0 questions.
        mockMvc.perform(post("/api/quizzes/{quizId}/submit", draftId)
                        .with(user("student@example.com").roles("STUDENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"selectedAnswers\":[2]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(0))
                .andExpect(jsonPath("$.totalQuestions").value(0));
    }

    private long createMcq(String question) throws Exception {
        String json = mockMvc.perform(post("/api/admin/mcqs")
                        .with(user("admin@example.com").roles("ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mcqJson(question)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("id").asLong();
    }

    private String mcqJson(String question) {
        return """
                {
                  "question": "%s",
                  "optionA": "int",
                  "optionB": "char",
                  "optionC": "float",
                  "optionD": "void",
                  "correctAnswer": 2,
                  "topic": "Variables",
                  "difficulty": "EASY",
                  "explanation": "float stores decimals",
                  "xp": 10,
                  "status": "DRAFT"
                }
                """.formatted(question);
    }
}
