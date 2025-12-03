-- Initial database setup
-- This runs once when the database is first created

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables will be handled by Alembic migrations
-- This file is for any initial data or extensions only

-- Set timezone
SET timezone = 'Europe/Vienna';

-- Initial setup complete
SELECT 'Database initialized successfully' AS status;

