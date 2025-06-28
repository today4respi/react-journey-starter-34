
-- Drop table if it exists (for clean recreation)
DROP TABLE IF EXISTS active_sessions;

-- Active sessions table for tracking current users on the website
CREATE TABLE IF NOT EXISTS active_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    page_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_active_sessions_last_activity ON active_sessions(last_activity);

-- Auto cleanup event (runs every 5 minutes to remove sessions older than 10 minutes)
DELIMITER $$
CREATE EVENT IF NOT EXISTS cleanup_old_sessions
ON SCHEDULE EVERY 5 MINUTE
DO
BEGIN
    DELETE FROM active_sessions 
    WHERE last_activity < NOW() - INTERVAL 10 MINUTE;
END$$
DELIMITER ;

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;
