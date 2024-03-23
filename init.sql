-- Creating table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('teacher', 'student'))
);

-- Creating table quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (author_id) REFERENCES users (id)
);

-- Creating table questions with an additional field for open-ended questions
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER,
    text TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('open', 'choice', 'multiple_choice')),
    expected_answer TEXT, -- This field can store the expected answer for open-ended questions
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id)
);

-- Creating table options
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    is_correct BOOLEAN,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

-- Creating table quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score INTEGER,
    total_questions INTEGER,
    correct_answers INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Creating table answers (to store the answers given by the users)
CREATE TABLE IF NOT EXISTS user_answers (
    id SERIAL PRIMARY KEY,
    quiz_attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    option_id INTEGER, -- This can be null for open-ended questions
    text TEXT, -- Used for open-ended answers or to store why the user chose a specific option
    is_correct BOOLEAN, -- This can be updated after a teacher reviews the answer for open-ended questions
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts (id),
    FOREIGN KEY (question_id) REFERENCES questions (id),
    FOREIGN KEY (option_id) REFERENCES options (id)
);
-- Inserting sample users
--INSERT INTO users (name, email, role, created_at, updated_at) VALUES
--('Alice Teacher', 'alice@example.com', 'teacher', NOW(), NOW()),
--('Bob Student', 'bob@example.com', 'student', NOW(), NOW());

-- Inserting sample quizzes
--INSERT INTO quizzes (title, author_id, created_at, updated_at) VALUES
--('Capital Cities Quiz', 1, NOW(), NOW()),
--('Programming Languages Quiz', 1, NOW(), NOW());

-- Inserting sample questions
--INSERT INTO questions (quiz_id, text, created_at, updated_at) VALUES
--(1, 'What is the capital of France?', NOW(), NOW()),
--(1, 'What is the capital of Germany?', NOW(), NOW()),
--(2, 'Which language runs in a web browser?', NOW(), NOW()),
--(2, 'What is the main language used for Android app development?', NOW(), NOW());

-- Inserting sample options
--INSERT INTO options (question_id, text, is_correct, created_at, updated_at) VALUES
--(1, 'Paris', TRUE, NOW(), NOW()),
--(1, 'London', FALSE, NOW(), NOW()),
--(1, 'Rome', FALSE, NOW(), NOW()),
--(2, 'Berlin', TRUE, NOW(), NOW()),
--(2, 'Madrid', FALSE, NOW(), NOW()),
--(2, 'Lisbon', FALSE, NOW(), NOW()),
--(3, 'JavaScript', TRUE, NOW(), NOW()),
--(3, 'C++', FALSE, NOW(), NOW()),
--(3, 'Python', FALSE, NOW(), NOW()),
--(4, 'Java', TRUE, NOW(), NOW()),
--(4, 'C#', FALSE, NOW(), NOW()),
--(4, 'Swift', FALSE, NOW(), NOW());

-- Inserting sample quiz_attempts
-- Note: Normally, the score, total_questions, and correct_answers would be determined after a quiz is taken.
-- These are just samples.
--INSERT INTO quiz_attempts (quiz_id, user_id, score, total_questions, correct_answers, created_at) VALUES
--(1, 2, 2, 2, 2, NOW()), -- Bob Student got 2 out of 2 correct on the Capital Cities Quiz
--(2, 2, 1, 2, 1, NOW()); -- Bob Student got 1 out of 2 correct on the Programming Languages Quiz

-- Inserting sample user_answers
-- Assuming quiz_attempt_id 1 relates to Bob's attempt at the Capital Cities Quiz
-- and quiz_attempt_id 2 relates to Bob's attempt at the Programming Languages Quiz
--INSERT INTO user_answers (quiz_attempt_id, question_id, option_id, is_correct) VALUES
--(1, 1, (SELECT id FROM options WHERE question_id = 1 AND is_correct = TRUE), TRUE), -- Bob answered 'Paris' for the first question correctly
--(1, 2, (SELECT id FROM options WHERE question_id = 2 AND is_correct = TRUE), TRUE), -- Bob answered 'Berlin' for the second question correctly
--(2, 3, (SELECT id FROM options WHERE question_id = 3 AND is_correct = TRUE), TRUE), -- Bob answered 'JavaScript' for the third question correctly
--(2, 4, (SELECT id FROM options WHERE question_id = 4 AND is_correct = FALSE), FALSE); -- Bob answered incorrectly for the fourth question
