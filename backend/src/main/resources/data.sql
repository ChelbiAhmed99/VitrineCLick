-- Initial Data for H2
-- Roles (matching Role model)
INSERT INTO roles (name) SELECT 'ROLE_CLIENT' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_CLIENT');
INSERT INTO roles (name) SELECT 'ROLE_ADMIN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

-- Users (Password is 'password123' BCrypt encoded)
-- We use MERGE or conditional insert to avoid duplicates if app restarts with persistent mem
-- Actually H2 in-mem clears on restart, but good practice.
INSERT INTO users (username, email, password, full_name) 
SELECT 'admin', 'admin@vitrineclick.com', '$2a$10$MgAjCJIvHBZ2h79fdYo1B.H7raLG4/WwfIiiCW7tDc0NInglXn8zi', 'Administrateur Système'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, email, password, full_name) 
SELECT 'user', 'user@vitrineclick.com', '$2a$10$MgAjCJIvHBZ2h79fdYo1B.H7raLG4/WwfIiiCW7tDc0NInglXn8zi', 'Utilisateur Test'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user');

-- Assign roles
-- Admin: user_id=1, role_id=2 (ROLE_ADMIN)
-- User: user_id=2, role_id=1 (ROLE_CLIENT)
INSERT INTO user_roles (user_id, role_id) 
SELECT 1, 2 WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 1 AND role_id = 2);

INSERT INTO user_roles (user_id, role_id) 
SELECT 2, 1 WHERE NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = 2 AND role_id = 1);

-- Sample Templates
INSERT INTO templates (code, name, category, description) 
SELECT 'restaurant-deluxe', 'Restaurant Deluxe', 'Restaurant', 'Template élégant pour gastronomie'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'restaurant-deluxe');

INSERT INTO templates (code, name, category, description) 
SELECT 'tech-saas', 'Tech SaaS', 'Tech', 'Design moderne pour startups'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'tech-saas');
