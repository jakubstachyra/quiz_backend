-- Creating table questions
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Creating table options
CREATE TABLE IF NOT EXISTS options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    is_correct BOOLEAN, -- Zmień, jeśli niektóre pytania nie będą używać true/false
    sorting_order INTEGER, -- Zmienione z 'order' na 'sorting_order'
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (question_id) REFERENCES questions (id)
);

-- Creating table answers
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    user_id INTEGER,
    option_id INTEGER,
    text TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
    FOREIGN KEY (question_id) REFERENCES questions (id),
    FOREIGN KEY (option_id) REFERENCES options (id)
);

-- Filling sample data
INSERT INTO questions (text, type, created_at, updated_at) VALUES
('What is the capital of France?', 'single', NOW(), NOW()),
('Which of the following programming languages are object-oriented?', 'multiple', NOW(), NOW()),
('Arrange the following events in chronological order.', 'sorting', NOW(), NOW()),
('What is the famous phrase from Star Wars?', 'plain_text', NOW(), NOW());

INSERT INTO options (question_id, text, is_correct, sorting_order, created_at, updated_at) VALUES
(1, 'London', FALSE, NULL, NOW(), NOW()),
(1, 'Paris', TRUE, NULL, NOW(), NOW()),
(1, 'Rome', FALSE, NULL, NOW(), NOW()),
(1, 'Madrid', FALSE, NULL, NOW(), NOW()),
(2, 'Java', TRUE, NULL, NOW(), NOW()),
(2, 'C', FALSE, NULL, NOW(), NOW()),
(2, 'Python', TRUE, NULL, NOW(), NOW()),
(2, 'Ruby', TRUE, NULL, NOW(), NOW()),
(3, 'Declaration of Independence', NULL, 1, NOW(), NOW()),
(3, 'World War II', NULL, 2, NOW(), NOW()),
(3, 'First Moon Landing', NULL, 3, NOW(), NOW());
