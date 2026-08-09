CREATE TABLE mcqs (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
    topic VARCHAR(128) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    explanation TEXT,
    xp INTEGER NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mcqs_topic ON mcqs(topic);
CREATE INDEX idx_mcqs_status ON mcqs(status);

CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    topic VARCHAR(128) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    passing_percentage INTEGER NOT NULL DEFAULT 50,
    xp INTEGER NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_status ON quizzes(status);

CREATE TABLE quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    mcq_id BIGINT NOT NULL REFERENCES mcqs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_quiz_questions UNIQUE (quiz_id, mcq_id)
);

CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id);
