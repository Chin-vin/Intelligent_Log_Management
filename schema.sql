CREATE TABLE users (
    user_id        BIGSERIAL PRIMARY KEY,

    email          VARCHAR(255) UNIQUE NOT NULL,
    username       VARCHAR(100) UNIQUE,

    is_active      BOOLEAN DEFAULT TRUE,
    is_deleted     BOOLEAN DEFAULT FALSE,

    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE user_profiles (
    profile_id        BIGSERIAL PRIMARY KEY,
    user_id           BIGINT UNIQUE
                      REFERENCES users(user_id)
                      ON DELETE CASCADE,

    first_name        VARCHAR(100) NOT NULL,
    last_name         VARCHAR(100),
   

    phone_number      VARCHAR(20),


    profile_image_url TEXT,

    

    job_title         VARCHAR(150),

    updated_at        TIMESTAMPTZ DEFAULT NOW()
);




CREATE TABLE user_credentials (
    credential_id          BIGSERIAL PRIMARY KEY,
    user_id                BIGINT UNIQUE
                            REFERENCES users(user_id)
                            ON DELETE CASCADE,

    password_hash          TEXT NOT NULL,
    password_algo          VARCHAR(50) NOT NULL,

    failed_attempts        INTEGER DEFAULT 0,
    last_failed_at         TIMESTAMPTZ,

    is_locked              BOOLEAN DEFAULT FALSE,
    locked_until           TIMESTAMPTZ,

    password_changed_at    TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE login_history (
    login_id        BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES users(user_id),

    login_time      TIMESTAMP DEFAULT NOW(),
    login_ip        INET,
    user_agent      TEXT,

    success         BOOLEAN,
    failure_reason  VARCHAR(100)
);



CREATE TABLE roles (
    role_id     SMALLSERIAL PRIMARY KEY,
    role_name   VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);



CREATE TABLE permissions (
    permission_id   SMALLSERIAL PRIMARY KEY,
    permission_key  VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT
);



CREATE TABLE role_permissions (
    role_id        SMALLINT REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id  SMALLINT REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);



CREATE TABLE user_roles (
    user_id     BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id     SMALLINT REFERENCES roles(role_id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);



CREATE TABLE teams (
    team_id     BIGSERIAL PRIMARY KEY,
    team_name   VARCHAR(150) UNIQUE NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE user_teams (
    user_id      BIGINT REFERENCES users(user_id) ON DELETE CASCADE,
    team_id      BIGINT REFERENCES teams(team_id) ON DELETE CASCADE,
    joined_at    TIMESTAMPTZ DEFAULT NOW(),
    /*leaved_at TIMESTAMPTZ DEFAULT NOW()*/
    PRIMARY KEY (user_id, team_id)
);
select * from user_teams;

CREATE TABLE departments (
    department_id    BIGSERIAL PRIMARY KEY,
    department_name  VARCHAR(150) UNIQUE NOT NULL,
    description      TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE department_teams (
    department_id  BIGINT
                   REFERENCES departments(department_id)
                   ON DELETE CASCADE,

    team_id        BIGINT
                   REFERENCES teams(team_id)
                   ON DELETE CASCADE,

    assigned_at    TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (department_id, team_id)
);



CREATE TABLE log_categories (
    category_id   SMALLSERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE file_formats (
    format_id    SMALLSERIAL PRIMARY KEY,
    format_name  VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE storage_types (
    storage_type_id SMALLSERIAL PRIMARY KEY,
    storage_name    VARCHAR(30) UNIQUE   -- LOCAL, OBJECT
); 
CREATE TABLE team_upload_policies (
    policy_id     BIGSERIAL PRIMARY KEY,
    team_id       BIGINT REFERENCES teams(team_id) ON DELETE CASCADE,
    -- category_id   SMALLINT REFERENCES log_categories(category_id),
    format_id     SMALLINT REFERENCES file_formats(format_id),
    is_allowed    BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (team_id, category_id, format_id)
);
CREATE TABLE audit_trail (
    audit_id     BIGSERIAL PRIMARY KEY,
    user_id      BIGINT REFERENCES users(user_id),
    action_type  VARCHAR(50) NOT NULL,
    entity_type  VARCHAR(50),
    entity_id    BIGINT,
    action_time  TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE upload_statuses (
    status_id     SMALLSERIAL PRIMARY KEY,
    status_code   VARCHAR(30) UNIQUE NOT NULL,
    description   TEXT
);



CREATE TABLE log_sources (
    source_id   SMALLSERIAL PRIMARY KEY,
    source_name VARCHAR(50) UNIQUE
);


CREATE TABLE raw_files (
    file_id           BIGSERIAL PRIMARY KEY,

    team_id           BIGINT
                      REFERENCES teams(team_id),

    uploaded_by       BIGINT
                      REFERENCES users(user_id),

    original_name     VARCHAR(255) NOT NULL,

    file_size_bytes   BIGINT NOT NULL,
    checksum          VARCHAR(64) UNIQUE NOT NULL,

    format_id         SMALLINT
                      REFERENCES file_formats(format_id),
                      
    source_id      SMALLINT REFERENCES log_sources(source_id) ON DELETE CASCADE,
    
    storage_type_id    SMALLINT REFERENCES storage_types(storage_type_id),
    storage_path       TEXT NOT NULL,
    status_id         SMALLINT
                      REFERENCES upload_statuses(status_id),

    uploaded_at       TIMESTAMPTZ DEFAULT NOW(),
   is_deleted BOOLEAN DEFAULT FALSE,
deleted_at TIMESTAMP NULL
);

CREATE TABLE log_severities (
    severity_id    SMALLSERIAL PRIMARY KEY,
    severity_code  VARCHAR(10) UNIQUE NOT NULL,
    severity_level INTEGER NOT NULL,
    description    TEXT
);



CREATE TABLE environments (
    environment_id    SMALLSERIAL PRIMARY KEY,
    environment_code  VARCHAR(20) UNIQUE NOT NULL,
    description       TEXT
);



CREATE TABLE log_entries (
    log_id          BIGSERIAL PRIMARY KEY,

    file_id         BIGINT
                    REFERENCES raw_files(file_id)
                    ON DELETE CASCADE,

    log_timestamp   TIMESTAMPTZ NOT NULL,

    severity_id     SMALLINT
                    REFERENCES log_severities(severity_id),

    category_id     SMALLINT
                    REFERENCES log_categories(category_id),

    environment_id  SMALLINT
                    REFERENCES environments(environment_id),

    service_name    VARCHAR(150),
    host_name       VARCHAR(150),

    message         TEXT NOT NULL,
    raw_log         TEXT,

    created_at      TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE archives (
    archive_id     BIGSERIAL PRIMARY KEY,
    file_id        BIGINT REFERENCES raw_files(file_id),
    archived_on    TIMESTAMPTZ DEFAULT NOW(),
    total_records  INTEGER
);

CREATE TABLE audit_logs (
    audit_id      BIGSERIAL PRIMARY KEY,

    table_name    VARCHAR(100) NOT NULL,
    record_id     BIGINT NOT NULL,

    action_type   VARCHAR(20) NOT NULL
                  CHECK (action_type IN ('INSERT', 'UPDATE', 'DELETE')),

    old_data      JSONB,
    new_data      JSONB,

    changed_by    BIGINT REFERENCES users(user_id),
    changed_at    TIMESTAMPTZ DEFAULT NOW()
);




