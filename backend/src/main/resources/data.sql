-- Initial Data for H2
INSERT INTO roles (name) SELECT 'ROLE_CLIENT' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_CLIENT');
INSERT INTO roles (name) SELECT 'ROLE_ADMIN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

-- Password is 'password123' BCrypt encoded
INSERT INTO users (username, email, password, full_name) 
SELECT 'admin', 'admin@vitrineclick.com', '$2a$10$MgAjCJIvHBZ2h79fdYo1B.H7raLG4/WwfIiiCW7tDc0NInglXn8zi', 'Administrateur Système'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, email, password, full_name) 
SELECT 'user', 'user@vitrineclick.com', '$2a$10$MgAjCJIvHBZ2h79fdYo1B.H7raLG4/WwfIiiCW7tDc0NInglXn8zi', 'Utilisateur Test'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'user');

-- Assign roles
INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN'
AND NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = u.id AND role_id = r.id);

INSERT INTO user_roles (user_id, role_id) 
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'user' AND r.name = 'ROLE_CLIENT'
AND NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = u.id AND role_id = r.id);

-- Sample Templates
INSERT INTO templates (code, name, category, description) 
SELECT 'restaurant-deluxe', 'Restaurant Deluxe', 'Restaurant', 'Template élégant pour gastronomie'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'restaurant-deluxe');

INSERT INTO templates (code, name, category, description) 
SELECT 'tech-saas', 'Tech SaaS', 'Tech', 'Design moderne pour startups'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE code = 'tech-saas');
