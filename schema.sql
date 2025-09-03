-- Active: 1756812242299@@127.0.0.1@5432@expense_tracker
START TRANSACTION; -- Create the tables and views
CREATE TABLE users(
    user_id       SERIAL PRIMARY KEY,
    full_name     TEXT NOT NULL,
    email         TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    refresh_token TEXT,
    expires_at    TIMESTAMP,
    created_at    TIMESTAMP DEFAULT now()
);

CREATE TABLE transactions(
    transaction_id   SERIAL PRIMARY KEY,
    owner_id         INT REFERENCES users(user_id),
    transaction_name TEXT,
    transaction_amount NUMERIC(12,2) NOT NULL,
    transaction_detail TEXT,
    created_at       TIMESTAMP DEFAULT now(),
    deleted_at       TIMESTAMP NULL
);

CREATE TABLE goals(
    goal_id       SERIAL PRIMARY KEY,
    owner_id      INT REFERENCES users(user_id),
    goal_name     TEXT NOT NULL,
    total_amount  NUMERIC(12,2) NOT NULL,
    saving_freq   TEXT CHECK (saving_freq IN ('daily','weekly','monthly')),  -- example constraint
    current_saved NUMERIC(12,2) DEFAULT 0, -- how much has been saved so far
    progress_percent NUMERIC(5,2) GENERATED ALWAYS AS(
        CASE WHEN total_amount = 0 THEN 0
             ELSE ROUND((current_saved / total_amount) * 100,2) 
        END
    ) STORED,
    goal_deadline TIMESTAMP,
    created_at    TIMESTAMP DEFAULT now(),
    deleted_at    TIMESTAMP NULL
);

CREATE TABLE goal_saving_log(
    log_id       SERIAL PRIMARY KEY,
    goal_id      INT REFERENCES goals(goal_id),
    amount_saved NUMERIC(12,2) NOT NULL, -- amount saved in this entry
    saved_at     TIMESTAMP DEFAULT now(),
    note         TEXT
);

CREATE VIEW monthly_summary AS
SELECT 
    owner_id,
    EXTRACT(YEAR FROM created_at) AS year,
    EXTRACT(MONTH FROM created_at) AS month,
    SUM(transaction_amount) AS total_spent
FROM transactions
WHERE deleted_at IS NULL
GROUP BY owner_id, year, month;

COMMIT;