INSERT INTO roles (role_name, description) VALUES
('ADMIN', 'System administrator with full privileges'),
('USER', 'Standard employee access'),
('SECURITY_ANALYST', 'Security monitoring and incident response'),
('AUDITOR', 'Compliance and audit review access');



INSERT INTO permissions (permission_key, description) VALUES
('UPLOAD_LOG', 'Upload log files'),
('VIEW_LOG', 'View log data'),
('DELETE_LOG', 'Delete log files'),
('VIEW_SECURITY_LOG', 'View security-related logs'),
('MANAGE_USERS', 'Manage users and roles'),
('ARCHIVE_LOG', 'Archive log files');

INSERT INTO log_categories (category_name) VALUES
('APPLICATION'),
('SECURITY'),
('INFRASTRUCTURE'),
('AUDIT'),
('UNCATEGORIZED');

INSERT INTO file_formats (format_name) VALUES
('TEXT'),
('JSON'),
('CSV'),
('XML');


INSERT INTO upload_statuses (status_code, description) VALUES
('UPLOADED', 'File uploaded successfully'),
('PROCESSING', 'File parsing in progress'),
('PARSED', 'Log parsing completed'),
('FAILED', 'File processing failed'),
('ARCHIVED', 'Archived as per retention policy');



INSERT INTO log_sources (source_name) VALUES
('APPLICATION'),
('SERVER'),
('DATABASE'),
('CLOUD'),
('SECURITY_DEVICE'),
('KUBERNETES');


INSERT INTO log_severities (severity_code, severity_level, description) VALUES
('DEBUG', 1, 'Debug-level information'),
('INFO', 2, 'Operational information'),
('WARN', 3, 'Warning conditions'),
('ERROR', 4, 'Error conditions'),
('FATAL', 5, 'System failure');

INSERT INTO environments (environment_code, description) VALUES
('DEV', 'Development environment'),
('QA', 'Quality assurance environment'),
('STAGING', 'Pre-production environment'),
('PROD', 'Production environment');

INSERT INTO departments (department_name, description) VALUES
('Engineering', 'Software development and maintenance'),
('Security', 'Security operations and monitoring'),
('IT Operations', 'Infrastructure and cloud operations');


INSERT INTO teams (team_name) VALUES
('Backend Engineering'),
('DevOps'),
('Security Operations'),
('Cloud Infrastructure');


INSERT INTO department_teams (department_id, team_id)
SELECT d.department_id, t.team_id
FROM departments d, teams t
WHERE
(d.department_name = 'Engineering' AND t.team_name = 'Backend Engineering')
OR
(d.department_name = 'IT Operations' AND t.team_name IN ('DevOps','Cloud Infrastructure'))
OR
(d.department_name = 'Security' AND t.team_name = 'Security Operations');


INSERT INTO users (email, username) VALUES
('admin@acmetech.com', 'sysadmin'),
('alice.johnson@acmetech.com', 'alice.j'),
('bob.miller@acmetech.com', 'bob.m'),
('charlie.khan@acmetech.com', 'charlie.k');


INSERT INTO user_profiles (user_id, first_name, last_name, phone_number, job_title) VALUES
(1, 'System', 'Administrator', '9000000001', 'Platform Administrator'),
(2, 'Alice', 'Johnson', '9000000002', 'Backend Software Engineer'),
(3, 'Bob', 'Miller', '9000000003', 'DevOps Engineer'),
(4, 'Charlie', 'Khan', '9000000004', 'Security Analyst');


INSERT INTO user_credentials (user_id, password_hash, password_algo) VALUES
(1, 'hashed_password_admin', 'bcrypt'),
(2, 'hashed_password_alice', 'bcrypt'),
(3, 'hashed_password_bob', 'bcrypt'),
(4, 'hashed_password_charlie', 'bcrypt');

INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE
(u.username = 'sysadmin' AND r.role_name = 'ADMIN')
OR
(u.username = 'alice.j' AND r.role_name = 'USER')
OR
(u.username = 'bob.m' AND r.role_name = 'USER')
OR
(u.username = 'charlie.k' AND r.role_name = 'SECURITY_ANALYST');

INSERT INTO user_teams (user_id, team_id)
SELECT u.user_id, t.team_id
FROM users u, teams t
WHERE
(u.username = 'alice.j' AND t.team_name = 'Backend Engineering')
OR
(u.username = 'bob.m' AND t.team_name = 'DevOps')
OR
(u.username = 'charlie.k' AND t.team_name = 'Security Operations');


-- Backend Engineering: Application logs (TEXT, JSON)
INSERT INTO team_upload_policies (team_id, category_id, format_id)
SELECT t.team_id, c.category_id, f.format_id
FROM teams t, log_categories c, file_formats f
WHERE t.team_name = 'Backend Engineering'
  AND c.category_name = 'APPLICATION'
  AND f.format_name IN ('TEXT','JSON');


-- DevOps: Infrastructure logs (TEXT, JSON)
INSERT INTO team_upload_policies (team_id, category_id, format_id)
SELECT t.team_id, c.category_id, f.format_id
FROM teams t, log_categories c, file_formats f
WHERE t.team_name = 'DevOps'
  AND c.category_name = 'INFRASTRUCTURE'
  AND f.format_name IN ('TEXT','JSON');


-- Cloud Infrastructure: Infrastructure logs (JSON, CSV)
INSERT INTO team_upload_policies (team_id, category_id, format_id)
SELECT t.team_id, c.category_id, f.format_id
FROM teams t, log_categories c, file_formats f
WHERE t.team_name = 'Cloud Infrastructure'
  AND c.category_name = 'INFRASTRUCTURE'
  AND f.format_name IN ('JSON','CSV');


-- Security Operations: Security logs (TEXT, JSON)
INSERT INTO team_upload_policies (team_id, category_id, format_id)
SELECT t.team_id, c.category_id, f.format_id
FROM teams t, log_categories c, file_formats f
WHERE t.team_name = 'Security Operations'
  AND c.category_name = 'SECURITY'
  AND f.format_name IN ('TEXT','JSON');


-- Security Operations: Audit logs (TEXT)
INSERT INTO team_upload_policies (team_id, category_id, format_id)
SELECT t.team_id, c.category_id, f.format_id
FROM teams t, log_categories c, file_formats f
WHERE t.team_name = 'Security Operations'
  AND c.category_name = 'AUDIT'
  AND f.format_name = 'TEXT';


INSERT INTO user_credentials (user_id, password_hash,password_algo, failed_attempts)
VALUES (-1, '$2b$12$dummyhashdummyhashdummyhash','bcrypt', 0);

INSERT INTO storage_types (storage_name) VALUES
('LOCAL'),
('OBJECT');

select * from users;
select * from user_credentials;
select * from AuditTrail;
select * from user_roles;
select * from audit_trail;
select * from login_history;
select * from log_entries;
select * from raw_files;
select * from file_processing_log;
select * from log_severities;
