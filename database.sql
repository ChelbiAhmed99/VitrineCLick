-- Database: vitrineclick
CREATE DATABASE IF NOT EXISTS vitrineclick;
USE vitrineclick;

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255)
);

-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Table: templates
CREATE TABLE IF NOT EXISTS templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255),
    name VARCHAR(255),
    category VARCHAR(255),
    description VARCHAR(255),
    default_color_palette VARCHAR(255),
    default_typography VARCHAR(255)
);

-- Table: sites
CREATE TABLE IF NOT EXISTS sites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255),
    description TEXT,
    category VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(255),
    email VARCHAR(255),
    subdomain VARCHAR(255),
    logo_url VARCHAR(255),
    generation_status VARCHAR(255),
    generated_visuals TEXT,
    color_theme VARCHAR(255),
    typography VARCHAR(255),
    template_config TEXT,
    template_id BIGINT,
    published BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    theme_settings TEXT,
    visits BIGINT DEFAULT 0,
    ai_score DOUBLE DEFAULT 0.0,
    retention_time_seconds BIGINT DEFAULT 0,
    user_id BIGINT,
    FOREIGN KEY (template_id) REFERENCES templates(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    plan VARCHAR(255),
    status VARCHAR(255),
    start_date DATETIME,
    end_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Initial Data
INSERT INTO roles (name) VALUES ('ROLE_CLIENT');
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');

-- Password is 'password123' BCrypt encoded
INSERT INTO users (username, email, password, full_name) VALUES ('admin', 'admin@vitrineclick.com', '$2a$10$8.UnVuG9HHgffUDAlk8qn.6nQH22LujUXRWf9.n0T000000000000', 'Administrateur Système');
INSERT INTO users (username, email, password, full_name) VALUES ('user', 'user@vitrineclick.com', '$2a$10$8.UnVuG9HHgffUDAlk8qn.6nQH22LujUXRWf9.n0T000000000000', 'Utilisateur Test');

-- Assign roles (Admin: 1, User: 2)
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2); -- Admin has ROLE_ADMIN
INSERT INTO user_roles (user_id, role_id) VALUES (2, 1); -- User has ROLE_CLIENT
UPDATE user_roles SET role_id = 2 WHERE user_id = 1; -- Fix: 1 is Client, 2 is Admin based on insert order

-- Sample Templates
INSERT INTO templates (code, name, category, description) VALUES ('restaurant-deluxe', 'Restaurant Deluxe', 'Restaurant', 'Template élégant pour gastronomie');
INSERT INTO templates (code, name, category, description) VALUES ('tech-saas', 'Tech SaaS', 'Tech', 'Design moderne pour startups');
