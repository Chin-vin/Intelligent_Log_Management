--
-- PostgreSQL database dump
--

\restrict v7h4ohc8WWnHWEK2y6kDsSVFGHJm6c3csUtulyTSzPRVgrKTZhAakHtTS5fJM9L

-- Dumped from database version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.20 (Ubuntu 14.20-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: archives; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.archives (
    archive_id bigint NOT NULL,
    file_id bigint,
    archived_on timestamp with time zone DEFAULT now(),
    total_records integer
);


--
-- Name: archives_archive_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.archives_archive_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: archives_archive_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.archives_archive_id_seq OWNED BY public.archives.archive_id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    audit_id bigint NOT NULL,
    table_name character varying(100) NOT NULL,
    record_id bigint NOT NULL,
    action_type character varying(20) NOT NULL,
    old_data jsonb,
    new_data jsonb,
    changed_by bigint,
    changed_at timestamp with time zone DEFAULT now(),
    CONSTRAINT audit_logs_action_type_check CHECK (((action_type)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


--
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_audit_id_seq OWNED BY public.audit_logs.audit_id;


--
-- Name: audit_trail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_trail (
    audit_id bigint NOT NULL,
    user_id bigint,
    action_type character varying(50) NOT NULL,
    entity_type character varying(50),
    entity_id bigint,
    action_time timestamp with time zone DEFAULT now()
);


--
-- Name: audit_trail_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_trail_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_trail_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_trail_audit_id_seq OWNED BY public.audit_trail.audit_id;


--
-- Name: department_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_teams (
    department_id bigint NOT NULL,
    team_id bigint NOT NULL,
    assigned_at timestamp with time zone DEFAULT now()
);


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    department_id bigint NOT NULL,
    department_name character varying(150) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_department_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- Name: environments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.environments (
    environment_id smallint NOT NULL,
    environment_code character varying(20) NOT NULL,
    description text
);


--
-- Name: environments_environment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.environments_environment_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: environments_environment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.environments_environment_id_seq OWNED BY public.environments.environment_id;


--
-- Name: file_formats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_formats (
    format_id smallint NOT NULL,
    format_name character varying(20) NOT NULL
);


--
-- Name: file_formats_format_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.file_formats_format_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_formats_format_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.file_formats_format_id_seq OWNED BY public.file_formats.format_id;


--
-- Name: file_processing_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_processing_log (
    process_id bigint NOT NULL,
    file_id bigint,
    status character varying(30),
    error_message text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);


--
-- Name: file_processing_log_process_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.file_processing_log_process_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: file_processing_log_process_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.file_processing_log_process_id_seq OWNED BY public.file_processing_log.process_id;


--
-- Name: log_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_categories (
    category_id smallint NOT NULL,
    category_name character varying(50) NOT NULL
);


--
-- Name: log_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_categories_category_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_categories_category_id_seq OWNED BY public.log_categories.category_id;


--
-- Name: log_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_entries (
    log_id bigint NOT NULL,
    file_id bigint,
    log_timestamp timestamp with time zone NOT NULL,
    severity_id smallint,
    category_id smallint,
    environment_id smallint,
    service_name character varying(150),
    host_name character varying(150),
    message text NOT NULL,
    raw_log text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: log_entries_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_entries_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_entries_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_entries_log_id_seq OWNED BY public.log_entries.log_id;


--
-- Name: log_severities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_severities (
    severity_id smallint NOT NULL,
    severity_code character varying(10) NOT NULL,
    severity_level integer NOT NULL,
    description text
);


--
-- Name: log_severities_severity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_severities_severity_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_severities_severity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_severities_severity_id_seq OWNED BY public.log_severities.severity_id;


--
-- Name: log_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_sources (
    source_id smallint NOT NULL,
    source_name character varying(50)
);


--
-- Name: log_sources_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_sources_source_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_sources_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_sources_source_id_seq OWNED BY public.log_sources.source_id;


--
-- Name: login_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.login_history (
    login_id bigint NOT NULL,
    user_id bigint,
    login_time timestamp without time zone DEFAULT now(),
    login_ip inet,
    user_agent text,
    success boolean,
    failure_reason character varying(100)
);


--
-- Name: login_history_login_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.login_history_login_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: login_history_login_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.login_history_login_id_seq OWNED BY public.login_history.login_id;


--
-- Name: parsing_errors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parsing_errors (
    error_id bigint NOT NULL,
    file_id bigint,
    raw_line text,
    reason text,
    logged_at timestamp with time zone DEFAULT now()
);


--
-- Name: parsing_errors_error_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.parsing_errors_error_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: parsing_errors_error_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.parsing_errors_error_id_seq OWNED BY public.parsing_errors.error_id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    permission_id smallint NOT NULL,
    permission_key character varying(100) NOT NULL,
    description text
);


--
-- Name: permissions_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_permission_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_permission_id_seq OWNED BY public.permissions.permission_id;


--
-- Name: raw_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.raw_files (
    file_id bigint NOT NULL,
    team_id bigint,
    uploaded_by bigint,
    original_name character varying(255) NOT NULL,
    file_size_bytes bigint NOT NULL,
    checksum character varying(64) NOT NULL,
    format_id smallint,
    source_id smallint,
    storage_type_id smallint,
    storage_path text NOT NULL,
    status_id smallint,
    uploaded_at timestamp with time zone DEFAULT now(),
    is_deleted boolean DEFAULT false,
    deleted_at timestamp without time zone
);


--
-- Name: raw_files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.raw_files_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: raw_files_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.raw_files_file_id_seq OWNED BY public.raw_files.file_id;


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    role_id smallint NOT NULL,
    permission_id smallint NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    role_id smallint NOT NULL,
    role_name character varying(50) NOT NULL,
    description text
);


--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_role_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: storage_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.storage_types (
    storage_type_id smallint NOT NULL,
    storage_name character varying(30)
);


--
-- Name: storage_types_storage_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.storage_types_storage_type_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: storage_types_storage_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.storage_types_storage_type_id_seq OWNED BY public.storage_types.storage_type_id;


--
-- Name: team_upload_policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_upload_policies (
    policy_id bigint NOT NULL,
    team_id bigint,
    format_id smallint,
    is_allowed boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: team_upload_policies_policy_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_upload_policies_policy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_upload_policies_policy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_upload_policies_policy_id_seq OWNED BY public.team_upload_policies.policy_id;


--
-- Name: teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teams (
    team_id bigint NOT NULL,
    team_name character varying(150) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: teams_team_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teams_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teams_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teams_team_id_seq OWNED BY public.teams.team_id;


--
-- Name: upload_statuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upload_statuses (
    status_id smallint NOT NULL,
    status_code character varying(30) NOT NULL,
    description text
);


--
-- Name: upload_statuses_status_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.upload_statuses_status_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: upload_statuses_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.upload_statuses_status_id_seq OWNED BY public.upload_statuses.status_id;


--
-- Name: user_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_credentials (
    credential_id bigint NOT NULL,
    user_id bigint,
    password_hash text NOT NULL,
    password_algo character varying(50) NOT NULL,
    failed_attempts integer DEFAULT 0,
    last_failed_at timestamp with time zone,
    is_locked boolean DEFAULT false,
    locked_until timestamp with time zone,
    password_changed_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_credentials_credential_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_credentials_credential_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_credentials_credential_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_credentials_credential_id_seq OWNED BY public.user_credentials.credential_id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    profile_id bigint NOT NULL,
    user_id bigint,
    first_name character varying(100) NOT NULL,
    last_name character varying(100),
    phone_number character varying(20),
    profile_image_url text,
    job_title character varying(150),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_profiles_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_profiles_profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_profiles_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_profiles_profile_id_seq OWNED BY public.user_profiles.profile_id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    user_id bigint NOT NULL,
    role_id smallint NOT NULL,
    assigned_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_teams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_teams (
    user_id bigint NOT NULL,
    team_id bigint NOT NULL,
    joined_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(100),
    is_active boolean DEFAULT true,
    is_deleted boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: archives archive_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.archives ALTER COLUMN archive_id SET DEFAULT nextval('public.archives_archive_id_seq'::regclass);


--
-- Name: audit_logs audit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN audit_id SET DEFAULT nextval('public.audit_logs_audit_id_seq'::regclass);


--
-- Name: audit_trail audit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_trail ALTER COLUMN audit_id SET DEFAULT nextval('public.audit_trail_audit_id_seq'::regclass);


--
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- Name: environments environment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.environments ALTER COLUMN environment_id SET DEFAULT nextval('public.environments_environment_id_seq'::regclass);


--
-- Name: file_formats format_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_formats ALTER COLUMN format_id SET DEFAULT nextval('public.file_formats_format_id_seq'::regclass);


--
-- Name: file_processing_log process_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_processing_log ALTER COLUMN process_id SET DEFAULT nextval('public.file_processing_log_process_id_seq'::regclass);


--
-- Name: log_categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_categories ALTER COLUMN category_id SET DEFAULT nextval('public.log_categories_category_id_seq'::regclass);


--
-- Name: log_entries log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_entries ALTER COLUMN log_id SET DEFAULT nextval('public.log_entries_log_id_seq'::regclass);


--
-- Name: log_severities severity_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_severities ALTER COLUMN severity_id SET DEFAULT nextval('public.log_severities_severity_id_seq'::regclass);


--
-- Name: log_sources source_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_sources ALTER COLUMN source_id SET DEFAULT nextval('public.log_sources_source_id_seq'::regclass);


--
-- Name: login_history login_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_history ALTER COLUMN login_id SET DEFAULT nextval('public.login_history_login_id_seq'::regclass);


--
-- Name: parsing_errors error_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parsing_errors ALTER COLUMN error_id SET DEFAULT nextval('public.parsing_errors_error_id_seq'::regclass);


--
-- Name: permissions permission_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN permission_id SET DEFAULT nextval('public.permissions_permission_id_seq'::regclass);


--
-- Name: raw_files file_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files ALTER COLUMN file_id SET DEFAULT nextval('public.raw_files_file_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: storage_types storage_type_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.storage_types ALTER COLUMN storage_type_id SET DEFAULT nextval('public.storage_types_storage_type_id_seq'::regclass);


--
-- Name: team_upload_policies policy_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_upload_policies ALTER COLUMN policy_id SET DEFAULT nextval('public.team_upload_policies_policy_id_seq'::regclass);


--
-- Name: teams team_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams ALTER COLUMN team_id SET DEFAULT nextval('public.teams_team_id_seq'::regclass);


--
-- Name: upload_statuses status_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_statuses ALTER COLUMN status_id SET DEFAULT nextval('public.upload_statuses_status_id_seq'::regclass);


--
-- Name: user_credentials credential_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_credentials ALTER COLUMN credential_id SET DEFAULT nextval('public.user_credentials_credential_id_seq'::regclass);


--
-- Name: user_profiles profile_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN profile_id SET DEFAULT nextval('public.user_profiles_profile_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: archives; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.archives (archive_id, file_id, archived_on, total_records) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (audit_id, table_name, record_id, action_type, old_data, new_data, changed_by, changed_at) FROM stdin;
\.


--
-- Data for Name: audit_trail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_trail (audit_id, user_id, action_type, entity_type, entity_id, action_time) FROM stdin;
1	1	CREATE_USER	USER	19	2026-01-12 18:51:09.616505+05:30
2	17	UPLOAD_FILE	RAW_FILE	2	2026-01-13 06:13:03.422612+05:30
3	17	UPLOAD_FILE	RAW_FILE	3	2026-01-13 09:02:20.116196+05:30
4	17	UPLOAD_FILE	RAW_FILE	4	2026-01-13 09:14:03.770173+05:30
5	17	UPLOAD_FILE	RAW_FILE	5	2026-01-13 09:14:45.74835+05:30
6	17	UPLOAD_FILE	RAW_FILE	6	2026-01-13 09:19:44.818778+05:30
7	17	UPLOAD_FILE	RAW_FILE	7	2026-01-13 09:56:44.03481+05:30
8	17	UPLOAD_FILE	RAW_FILE	8	2026-01-13 10:01:57.057398+05:30
9	17	UPLOAD_FILE	RAW_FILE	9	2026-01-13 10:06:32.352272+05:30
10	17	UPLOAD_FILE	RAW_FILE	10	2026-01-13 10:08:36.609804+05:30
11	17	UPLOAD_FILE	RAW_FILE	11	2026-01-13 10:14:39.660495+05:30
12	17	UPLOAD_FILE	RAW_FILE	12	2026-01-13 10:16:16.885628+05:30
13	17	UPLOAD_FILE	RAW_FILE	13	2026-01-13 10:33:35.87563+05:30
14	17	UPLOAD_FILE	RAW_FILE	14	2026-01-13 10:39:28.676838+05:30
15	17	UPLOAD_FILE	RAW_FILE	15	2026-01-13 10:41:10.523128+05:30
16	17	UPLOAD_FILE	RAW_FILE	16	2026-01-13 10:42:25.486557+05:30
17	17	UPLOAD_FILE	RAW_FILE	17	2026-01-13 10:44:21.7314+05:30
18	17	UPLOAD_FILE	RAW_FILE	18	2026-01-13 11:03:17.023377+05:30
19	17	UPLOAD_FILE	RAW_FILE	19	2026-01-13 11:04:09.518472+05:30
20	17	UPLOAD_FILE	RAW_FILE	20	2026-01-13 11:07:45.344635+05:30
21	17	UPLOAD_FILE	RAW_FILE	21	2026-01-13 11:11:15.880996+05:30
22	1	CREATE_USER	USER	23	2026-01-13 16:51:22.632855+05:30
23	17	UPLOAD_FILE	RAW_FILE	22	2026-01-19 05:52:46.804722+05:30
24	17	CREATE_USER	USER	24	2026-01-19 15:20:24.986836+05:30
25	24	UPLOAD_FILE	RAW_FILE	23	2026-01-19 10:58:46.089689+05:30
26	17	DELETE_USER	USER	6	2026-01-19 13:12:01.984568+05:30
27	17	UPDATE_USER_STATUS	USER	6	2026-01-19 13:12:06.390287+05:30
28	17	DELETE_USER	USER	6	2026-01-19 13:12:09.174834+05:30
29	17	DELETE_USER	USER	1	2026-01-19 13:15:54.071767+05:30
30	17	DELETE_USER	USER	6	2026-01-19 13:15:59.870933+05:30
31	17	DELETE_USER	USER	6	2026-01-19 13:16:05.049867+05:30
32	24	DELETE_FILE	RAW_FILE	23	2026-01-20 10:59:36.751006+05:30
33	24	UPLOAD_FILE	RAW_FILE	24	2026-01-20 07:13:02.75272+05:30
34	24	UPLOAD_FILE	RAW_FILE	25	2026-01-20 07:22:58.88623+05:30
35	24	DELETE_FILE	RAW_FILE	25	2026-01-20 12:53:03.083269+05:30
36	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:02:06.570726+05:30
37	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:03:36.264995+05:30
38	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:03:39.202239+05:30
39	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:03:39.767021+05:30
40	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:04:02.800488+05:30
41	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:04:03.289933+05:30
42	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:04:27.944984+05:30
43	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:04:29.467612+05:30
44	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:04:30.091661+05:30
45	24	DELETE_FILE	RAW_FILE	25	2026-01-20 13:04:30.658096+05:30
46	17	UPDATE_USER_STATUS	USER	14	2026-01-20 07:53:52.05167+05:30
47	17	UPDATE_USER_STATUS	USER	14	2026-01-20 07:53:58.26762+05:30
48	17	UPDATE_USER_STATUS	USER	24	2026-01-20 07:54:08.58792+05:30
49	17	UPDATE_USER_STATUS	USER	14	2026-01-20 09:30:19.557289+05:30
50	17	UPDATE_USER_STATUS	USER	14	2026-01-20 09:30:21.488679+05:30
51	17	UPDATE_USER_STATUS	USER	14	2026-01-20 09:30:24.501308+05:30
52	17	UPDATE_USER_STATUS	USER	14	2026-01-20 09:37:37.408851+05:30
53	17	UPDATE_USER_STATUS	USER	24	2026-01-20 09:37:38.451237+05:30
54	17	UPDATE_USER_STATUS	USER	6	2026-01-20 09:37:40.214444+05:30
55	17	DELETE_USER	USER	6	2026-01-20 09:38:20.393449+05:30
56	17	DELETE_USER	USER	17	2026-01-20 09:42:28.561746+05:30
57	17	UPDATE_USER_STATUS	USER	2	2026-01-20 09:44:23.29674+05:30
58	17	UPDATE_USER_STATUS	USER	1	2026-01-20 09:44:30.213091+05:30
59	17	UPDATE_USER_STATUS	USER	2	2026-01-20 09:44:35.181963+05:30
60	17	DELETE_USER	USER	4	2026-01-20 09:45:01.160771+05:30
61	17	UPDATE_USER_STATUS	USER	4	2026-01-20 09:45:08.477633+05:30
62	17	UPDATE_USER_STATUS	USER	6	2026-01-20 09:45:10.684926+05:30
63	24	UPLOAD_FILE	RAW_FILE	26	2026-01-20 09:50:32.804008+05:30
64	24	DELETE_FILE	RAW_FILE	26	2026-01-20 15:20:51.904766+05:30
65	17	DELETE_USER	USER	3	2026-01-20 10:49:05.092719+05:30
66	17	CREATE_USER	USER	25	2026-01-20 16:23:52.300214+05:30
67	25	CREATE_USER	USER	27	2026-01-20 16:25:29.035093+05:30
68	17	DELETE_USER	USER	14	2026-01-20 11:25:05.952011+05:30
69	17	UPDATE_USER_STATUS	USER	3	2026-01-20 11:25:11.032146+05:30
70	17	CREATE_USER	USER	28	2026-01-20 17:00:16.211459+05:30
71	24	UPDATE_PROFILE	USER_PROFILE	13	2026-01-21 05:26:22.29792+05:30
72	17	DELETE_USER	USER	14	2026-01-21 07:27:28.629616+05:30
73	17	DELETE_USER	USER	28	2026-01-21 07:27:30.9542+05:30
74	17	UPDATE_USER_STATUS	USER	28	2026-01-21 07:27:35.017736+05:30
75	17	UPDATE_USER_STATUS	USER	28	2026-01-21 07:27:49.212756+05:30
76	17	UPDATE_USER_STATUS	USER	28	2026-01-21 07:27:50.43219+05:30
77	17	DELETE_USER	USER	14	2026-01-21 07:28:02.65473+05:30
78	17	UPDATE_PROFILE	USER_PROFILE	10	2026-01-21 07:34:28.459619+05:30
79	17	UPDATE_USER_STATUS	USER	14	2026-01-21 07:50:44.126829+05:30
80	17	UPDATE_USER	USER	14	2026-01-21 07:51:15.535216+05:30
81	17	UPDATE_USER	USER	14	2026-01-21 08:08:17.161604+05:30
82	17	UPDATE_USER_STATUS	USER	14	2026-01-21 09:20:46.746531+05:30
83	17	UPDATE_USER_STATUS	USER	14	2026-01-21 09:20:49.055973+05:30
84	17	UPDATE_USER_STATUS	USER	14	2026-01-21 09:20:50.46735+05:30
85	17	CREATE_USER	USER	31	2026-01-21 14:56:36.215048+05:30
86	24	DELETE_FILE	RAW_FILE	26	2026-01-21 16:29:07.741235+05:30
87	24	DELETE_FILE	RAW_FILE	26	2026-01-21 16:29:08.165161+05:30
88	24	DELETE_FILE	RAW_FILE	26	2026-01-21 16:29:08.537693+05:30
89	24	DELETE_FILE	RAW_FILE	26	2026-01-21 16:40:54.981465+05:30
90	24	UPLOAD_FILE	RAW_FILE	27	2026-01-21 13:04:12.515123+05:30
91	24	DELETE_FILE	RAW_FILE	27	2026-01-21 18:35:30.486825+05:30
92	17	UPDATE_USER_STATUS	USER	14	2026-01-22 04:53:04.434098+05:30
93	17	DELETE_USER	USER	14	2026-01-22 05:40:54.673395+05:30
94	17	UPDATE_USER_STATUS	USER	14	2026-01-22 05:40:56.907426+05:30
95	24	UPLOAD_FILE	RAW_FILE	28	2026-01-22 06:08:58.418539+05:30
96	24	UPLOAD_FILE	RAW_FILE	29	2026-01-22 06:11:48.644304+05:30
97	24	DELETE_FILE	RAW_FILE	29	2026-01-22 11:41:55.768169+05:30
98	17	UPDATE_USER_STATUS	USER	6	2026-01-22 06:46:30.487334+05:30
99	17	UPDATE_USER_STATUS	USER	6	2026-01-22 06:46:32.19371+05:30
100	17	DELETE_USER	USER	6	2026-01-22 06:46:34.076164+05:30
101	17	DELETE_USER	USER	6	2026-01-22 06:46:36.256402+05:30
102	17	UPDATE_USER_STATUS	USER	6	2026-01-22 06:46:38.507299+05:30
103	17	UPDATE_USER_STATUS	USER	14	2026-01-22 07:01:50.716901+05:30
104	17	DELETE_USER	USER	14	2026-01-22 07:26:52.237495+05:30
105	17	UPDATE_USER_STATUS	USER	14	2026-01-22 07:26:53.365896+05:30
106	17	DELETE_USER	USER	14	2026-01-22 07:27:22.893715+05:30
107	17	DELETE_USER	USER	14	2026-01-22 07:27:24.676541+05:30
108	17	DELETE_USER	USER	14	2026-01-22 07:27:31.780039+05:30
109	17	DELETE_USER	USER	14	2026-01-22 07:27:32.726923+05:30
110	17	DELETE_USER	USER	2	2026-01-22 07:29:43.643275+05:30
111	17	DELETE_USER	USER	16	2026-01-22 07:29:50.09291+05:30
112	17	RESTORE_USER	USER	14	2026-01-22 13:05:39.733406+05:30
113	17	UPDATE_USER_STATUS	USER	24	2026-01-22 07:36:58.723069+05:30
114	17	UPDATE_USER_STATUS	USER	14	2026-01-22 07:37:42.088786+05:30
115	17	UPDATE_USER_STATUS	USER	14	2026-01-22 07:37:43.0085+05:30
116	17	DELETE_USER	USER	14	2026-01-22 13:14:12.65196+05:30
117	17	RESTORE_USER	USER	16	2026-01-22 13:14:20.468306+05:30
118	17	RESTORE_USER	USER	4	2026-01-22 13:14:25.704162+05:30
119	17	RESTORE_USER	USER	28	2026-01-22 13:16:12.128517+05:30
120	17	RESTORE_USER	USER	6	2026-01-22 14:34:25.92735+05:30
121	17	RESTORE_USER	USER	1	2026-01-22 14:43:18.585596+05:30
122	17	RESTORE_USER	USER	2	2026-01-22 14:43:47.476927+05:30
123	17	RESTORE_USER	USER	14	2026-01-22 14:48:16.915877+05:30
124	17	RESTORE_USER	USER	3	2026-01-22 14:51:27.290424+05:30
125	17	UPDATE_USER_STATUS	USER	31	2026-01-22 09:23:54.882655+05:30
126	17	DELETE_USER	USER	27	2026-01-22 14:55:36.772526+05:30
127	17	DELETE_USER	USER	14	2026-01-22 15:02:52.311999+05:30
128	17	RESTORE_USER	USER	14	2026-01-22 15:07:53.917732+05:30
129	17	DELETE_USER	USER	23	2026-01-22 15:10:12.984434+05:30
130	17	DELETE_USER	USER	14	2026-01-22 15:22:22.379656+05:30
131	17	DELETE_USER	USER	17	2026-01-22 15:22:35.391476+05:30
132	17	RESTORE_USER	USER	14	2026-01-22 15:40:47.048831+05:30
133	17	UPDATE_USER_STATUS	USER	14	2026-01-22 10:38:46.579469+05:30
134	17	UPDATE_USER_STATUS	USER	14	2026-01-22 10:38:47.845777+05:30
135	17	RESTORE_USER	USER	27	2026-01-22 16:09:15.684156+05:30
136	17	DELETE_USER	USER	14	2026-01-22 16:11:28.048221+05:30
137	17	RESTORE_USER	USER	23	2026-01-22 16:11:33.572514+05:30
138	17	RESTORE_USER	USER	14	2026-01-22 16:19:20.616112+05:30
139	17	DELETE_USER	USER	31	2026-01-22 16:19:25.327737+05:30
140	17	RESTORE_USER	USER	31	2026-01-22 16:21:19.604058+05:30
141	17	DELETE_USER	USER	14	2026-01-22 16:22:19.139121+05:30
142	17	RESTORE_USER	USER	14	2026-01-22 16:27:53.209931+05:30
143	17	UPDATE_USER_STATUS	USER	14	2026-01-22 10:58:00.386476+05:30
144	17	UPDATE_USER_STATUS	USER	14	2026-01-22 10:58:22.569937+05:30
145	17	UPDATE_USER_STATUS	USER	24	2026-01-22 11:04:26.495506+05:30
146	17	UPDATE_USER_STATUS	USER	24	2026-01-22 11:11:41.811911+05:30
147	17	UPDATE_USER_STATUS	USER	24	2026-01-22 11:15:34.24611+05:30
148	17	UPDATE_USER_STATUS	USER	14	2026-01-22 11:18:04.431493+05:30
149	17	UPDATE_USER_STATUS	USER	14	2026-01-22 11:18:07.063316+05:30
150	17	DELETE_USER	USER	14	2026-01-22 16:48:09.165018+05:30
151	17	RESTORE_USER	USER	14	2026-01-22 16:48:14.832936+05:30
152	17	UPLOAD_FILE	RAW_FILE	30	2026-01-22 14:39:39.405269+05:30
153	17	DELETE_FILE	RAW_FILE	30	2026-01-23 10:30:37.164578+05:30
154	17	UPLOAD_FILE	RAW_FILE	31	2026-01-23 05:03:16.324379+05:30
155	17	DELETE_FILE	RAW_FILE	31	2026-01-23 10:33:23.032777+05:30
156	17	UPLOAD_FILE	RAW_FILE	32	2026-01-23 05:05:49.639748+05:30
157	17	DELETE_FILE	RAW_FILE	32	2026-01-23 10:36:52.550417+05:30
158	17	UPDATE_USER_STATUS	USER	31	2026-01-23 05:12:52.113168+05:30
159	17	UPDATE_USER_STATUS	USER	31	2026-01-23 05:12:54.883036+05:30
160	17	DELETE_USER	USER	31	2026-01-23 10:42:59.238639+05:30
161	17	RESTORE_USER	USER	31	2026-01-23 10:43:04.056768+05:30
162	24	UPLOAD_FILE	RAW_FILE	33	2026-01-23 07:13:29.695899+05:30
163	17	DELETE_USER	USER	14	2026-01-23 15:21:34.799489+05:30
164	17	RESTORE_USER	USER	14	2026-01-23 15:24:23.466311+05:30
165	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:06:23.731865+05:30
166	17	DELETE_USER	USER	14	2026-01-23 15:36:30.104221+05:30
167	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:07:03.353322+05:30
168	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:07:06.799851+05:30
169	17	RESTORE_USER	USER	14	2026-01-23 15:38:11.586449+05:30
170	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:08:18.93567+05:30
171	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:10:20.973006+05:30
172	17	DELETE_USER	USER	14	2026-01-23 15:40:31.394521+05:30
173	17	UPDATE_USER_STATUS	USER	16	2026-01-23 10:10:37.183825+05:30
174	17	UPDATE_USER_STATUS	USER	16	2026-01-23 10:10:41.925375+05:30
175	17	DELETE_USER	USER	16	2026-01-23 15:40:47.583375+05:30
176	17	RESTORE_USER	USER	16	2026-01-23 15:40:51.163782+05:30
177	17	RESTORE_USER	USER	14	2026-01-23 15:40:54.635353+05:30
178	17	UPDATE_USER_STATUS	USER	28	2026-01-23 10:11:27.347455+05:30
179	17	UPDATE_USER_STATUS	USER	28	2026-01-23 10:11:35.249905+05:30
180	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:14:05.709654+05:30
181	17	UPDATE_USER_STATUS	USER	14	2026-01-23 10:14:41.790467+05:30
182	17	DELETE_USER	USER	14	2026-01-23 15:44:46.249438+05:30
183	17	RESTORE_USER	USER	14	2026-01-23 15:44:49.27658+05:30
184	17	SOFT_DELETE_FILE	RAW_FILE	27	2026-01-23 16:57:08.305182+05:30
185	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 11:30:29.683311+05:30
186	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 11:34:39.957225+05:30
187	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 11:35:57.279233+05:30
188	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 06:14:38.225118+05:30
189	17	RESTORE_FILE	RAW_FILE	33	2026-01-27 11:46:59.657713+05:30
190	17	RESTORE_FILE	RAW_FILE	33	2026-01-27 06:28:09.189041+05:30
191	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 06:29:30.45137+05:30
192	17	RESTORE_FILE	RAW_FILE	33	2026-01-27 06:29:38.350742+05:30
193	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 06:33:16.554485+05:30
194	17	RESTORE_FILE	RAW_FILE	33	2026-01-27 06:33:23.404985+05:30
195	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 06:40:53.768715+05:30
196	17	RESTORE_FILE	RAW_FILE	33	2026-01-27 06:41:02.951059+05:30
197	17	UPLOAD_FILE	RAW_FILE	34	2026-01-27 06:42:37.958295+05:30
198	17	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 06:47:03.379197+05:30
199	17	RESTORE_FILE	RAW_FILE	33	2026-01-27 06:47:12.299999+05:30
200	17	UPLOAD_FILE	RAW_FILE	35	2026-01-27 06:50:39.574807+05:30
201	17	UPDATE_USER_STATUS	USER	14	2026-01-27 07:30:19.121669+05:30
202	17	UPDATE_USER_STATUS	USER	14	2026-01-27 07:30:25.862708+05:30
203	17	UPLOAD_FILE	RAW_FILE	36	2026-01-27 09:46:16.561691+05:30
204	17	UPLOAD_FILE	RAW_FILE	37	2026-01-27 09:48:28.127598+05:30
205	17	UPDATE_USER_STATUS	USER	14	2026-01-27 10:06:29.951121+05:30
206	17	UPDATE_USER_STATUS	USER	14	2026-01-27 10:06:32.591136+05:30
207	17	SOFT_DELETE_FILE	RAW_FILE	36	2026-01-27 10:15:12.576236+05:30
208	24	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 10:22:56.052343+05:30
209	24	RESTORE_FILE	RAW_FILE	33	2026-01-27 10:46:02.483029+05:30
210	24	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 10:47:32.807913+05:30
211	24	RESTORE_FILE	RAW_FILE	33	2026-01-27 10:47:53.059099+05:30
212	24	RESTORE_FILE	RAW_FILE	36	2026-01-27 10:48:17.917374+05:30
213	24	SOFT_DELETE_FILE	RAW_FILE	36	2026-01-27 10:48:24.929261+05:30
214	24	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 10:51:21.935875+05:30
215	24	RESTORE_FILE	RAW_FILE	33	2026-01-27 11:14:18.631634+05:30
216	24	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 11:14:28.090244+05:30
217	24	RESTORE_FILE	RAW_FILE	33	2026-01-27 11:14:30.494511+05:30
218	24	SOFT_DELETE_FILE	RAW_FILE	33	2026-01-27 11:14:33.030414+05:30
219	24	UPLOAD_FILE	RAW_FILE	38	2026-01-27 12:41:34.430608+05:30
220	17	UPDATE_USER_STATUS	USER	28	2026-01-28 06:31:15.797006+05:30
221	17	RESTORE_FILE	RAW_FILE	36	2026-01-28 09:34:25.065608+05:30
222	24	UPLOAD_FILE	RAW_FILE	39	2026-01-28 12:16:35.840333+05:30
223	24	UPLOAD_FILE	RAW_FILE	40	2026-01-28 12:17:50.339008+05:30
224	24	UPLOAD_FILE	RAW_FILE	41	2026-01-28 12:18:39.170906+05:30
225	24	RESTORE_FILE	RAW_FILE	33	2026-01-28 12:26:57.352218+05:30
226	24	SOFT_DELETE_FILE	RAW_FILE	41	2026-01-28 12:33:56.136446+05:30
227	24	RESTORE_FILE	RAW_FILE	41	2026-01-28 12:45:40.31687+05:30
228	24	SOFT_DELETE_FILE	RAW_FILE	41	2026-01-28 12:47:17.315559+05:30
229	24	RESTORE_FILE	RAW_FILE	41	2026-01-28 12:49:04.196845+05:30
230	24	SOFT_DELETE_FILE	RAW_FILE	41	2026-01-28 12:49:10.949463+05:30
231	24	RESTORE_FILE	RAW_FILE	41	2026-01-28 12:50:23.424348+05:30
232	24	SOFT_DELETE_FILE	RAW_FILE	41	2026-01-28 12:50:29.698523+05:30
233	24	RESTORE_FILE	RAW_FILE	41	2026-01-28 12:50:33.548189+05:30
234	24	UPLOAD_FILE	RAW_FILE	42	2026-01-28 12:52:28.186123+05:30
235	24	UPLOAD_FILE	RAW_FILE	43	2026-01-28 12:52:51.919962+05:30
236	24	SOFT_DELETE_FILE	RAW_FILE	43	2026-01-28 12:52:59.851485+05:30
237	24	RESTORE_FILE	RAW_FILE	43	2026-01-28 12:53:03.017828+05:30
238	24	SOFT_DELETE_FILE	RAW_FILE	43	2026-01-28 12:53:09.899879+05:30
239	24	RESTORE_FILE	RAW_FILE	43	2026-01-28 12:53:15.238679+05:30
240	24	SOFT_DELETE_FILE	RAW_FILE	43	2026-01-29 04:46:22.147149+05:30
241	24	RESTORE_FILE	RAW_FILE	43	2026-01-29 04:46:25.025752+05:30
242	24	UPLOAD_FILE	RAW_FILE	44	2026-01-29 05:14:46.602029+05:30
243	17	UPDATE_USER_STATUS	USER	28	2026-01-29 06:46:40.799164+05:30
244	17	UPLOAD_FILE	RAW_FILE	45	2026-01-29 07:37:09.601594+05:30
245	17	SOFT_DELETE_FILE	RAW_FILE	45	2026-01-29 07:43:02.266347+05:30
246	17	RESTORE_FILE	RAW_FILE	45	2026-01-29 09:07:06.663979+05:30
247	17	UPDATE_USER_STATUS	USER	31	2026-01-29 09:07:50.310607+05:30
248	17	UPDATE_USER_STATUS	USER	31	2026-01-29 09:58:15.205315+05:30
249	17	UPDATE_USER_STATUS	USER	14	2026-01-29 11:01:03.704735+05:30
250	17	DELETE_USER	USER	6	2026-01-29 16:31:28.432637+05:30
251	17	UPDATE_USER_STATUS	USER	14	2026-01-29 11:01:36.199276+05:30
252	24	UPLOAD_FILE	RAW_FILE	46	2026-02-02 05:40:48.862138+05:30
253	24	SOFT_DELETE_FILE	RAW_FILE	44	2026-02-05 11:09:42.326412+05:30
254	17	UPDATE_USER_STATUS	USER	14	2026-02-06 12:44:22.122266+05:30
255	17	UPDATE_USER_STATUS	USER	14	2026-02-06 12:53:09.336261+05:30
256	24	RESTORE_FILE	RAW_FILE	44	2026-02-06 12:55:49.316219+05:30
257	17	UPLOAD_FILE	RAW_FILE	47	2026-02-06 13:32:57.446631+05:30
258	17	SOFT_DELETE_FILE	RAW_FILE	45	2026-02-09 10:11:20.117121+05:30
259	17	RESTORE_FILE	RAW_FILE	45	2026-02-09 10:27:58.369448+05:30
260	17	UPDATE_USER	USER	14	2026-02-09 11:27:49.596123+05:30
261	17	UPDATE_USER_STATUS	USER	14	2026-02-09 11:28:02.261129+05:30
262	17	UPDATE_USER_STATUS	USER	14	2026-02-09 11:28:06.000425+05:30
263	17	UPDATE_USER	USER	14	2026-02-09 11:28:09.805002+05:30
264	17	UPDATE_USER	USER	14	2026-02-09 11:28:16.058945+05:30
265	17	UPDATE_USER	USER	14	2026-02-09 11:40:38.71659+05:30
266	17	RESTORE_USER	USER	6	2026-02-09 11:44:37.122223+05:30
267	17	UPDATE_USER	USER	24	2026-02-09 12:23:39.94187+05:30
268	24	UPLOAD_FILE	RAW_FILE	48	2026-02-09 13:15:34.893037+05:30
269	17	DELETE_USER	USER	27	2026-02-09 16:57:52.608408+05:30
270	17	RESTORE_USER	USER	27	2026-02-09 16:57:56.94726+05:30
271	17	UPDATE_PROFILE	USER_PROFILE	10	2026-02-10 11:03:45.27763+05:30
272	17	UPLOAD_FILE	RAW_FILE	49	2026-02-10 12:13:36.417128+05:30
273	17	UPDATE_USER_STATUS	USER	14	2026-02-10 12:38:39.691131+05:30
274	24	SOFT_DELETE_FILE	RAW_FILE	43	2026-02-10 13:32:11.562885+05:30
275	24	UPLOAD_FILE	RAW_FILE	50	2026-02-10 13:32:51.191173+05:30
276	17	UPDATE_USER_STATUS	USER	14	2026-02-10 13:49:57.327216+05:30
277	17	SOFT_DELETE_FILE	RAW_FILE	45	2026-02-10 16:58:15.753408+05:30
278	17	UPLOAD_FILE	RAW_FILE	51	2026-02-10 16:58:39.433146+05:30
279	17	UPLOAD_FILE	RAW_FILE	52	2026-02-10 17:00:45.831469+05:30
280	17	UPLOAD_FILE	RAW_FILE	53	2026-02-11 10:39:29.771221+05:30
281	17	UPLOAD_FILE	RAW_FILE	54	2026-02-11 12:53:43.504744+05:30
282	17	UPLOAD_FILE	RAW_FILE	55	2026-02-11 12:54:58.025599+05:30
283	17	UPLOAD_FILE	RAW_FILE	56	2026-02-11 12:59:27.147418+05:30
284	17	UPLOAD_FILE	RAW_FILE	57	2026-02-11 15:26:39.749155+05:30
285	17	UPLOAD_FILE	RAW_FILE	58	2026-02-11 15:27:06.092976+05:30
286	17	UPDATE_USER_STATUS	USER	14	2026-02-12 15:45:00.438345+05:30
287	17	UPLOAD_FILE	RAW_FILE	59	2026-02-16 10:45:54.208597+05:30
288	17	UPLOAD_FILE	RAW_FILE	60	2026-02-16 10:45:55.31072+05:30
289	17	UPLOAD_FILE	RAW_FILE	61	2026-02-16 10:56:59.233342+05:30
290	17	UPLOAD_FILE	RAW_FILE	62	2026-02-16 10:58:14.185125+05:30
291	17	UPLOAD_FILE	RAW_FILE	63	2026-02-16 10:58:14.731709+05:30
292	17	UPDATE_USER_STATUS	USER	14	2026-02-16 10:58:54.155182+05:30
293	17	UPDATE_USER_STATUS	USER	24	2026-02-16 11:12:20.95223+05:30
294	17	UPDATE_USER_STATUS	USER	24	2026-02-16 11:12:40.252971+05:30
295	17	UPDATE_USER_STATUS	USER	24	2026-02-16 11:36:58.989222+05:30
296	17	UPDATE_USER_STATUS	USER	24	2026-02-16 11:37:22.773747+05:30
297	17	UPLOAD_FILE	RAW_FILE	64	2026-02-16 12:30:21.62326+05:30
298	17	UPLOAD_FILE	RAW_FILE	65	2026-02-16 12:30:22.4756+05:30
299	17	UPLOAD_FILE	RAW_FILE	66	2026-02-16 12:32:47.902763+05:30
300	17	UPLOAD_FILE	RAW_FILE	67	2026-02-16 12:53:12.617347+05:30
\.


--
-- Data for Name: department_teams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.department_teams (department_id, team_id, assigned_at) FROM stdin;
1	1	2026-01-12 10:34:00.211033+05:30
3	2	2026-01-12 10:34:00.211033+05:30
2	3	2026-01-12 10:34:00.211033+05:30
3	4	2026-01-12 10:34:00.211033+05:30
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.departments (department_id, department_name, description, created_at) FROM stdin;
1	Engineering	Software development and maintenance	2026-01-12 10:34:00.211033+05:30
2	Security	Security operations and monitoring	2026-01-12 10:34:00.211033+05:30
3	IT Operations	Infrastructure and cloud operations	2026-01-12 10:34:00.211033+05:30
\.


--
-- Data for Name: environments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.environments (environment_id, environment_code, description) FROM stdin;
1	DEV	Development environment
2	QA	Quality assurance environment
3	STAGING	Pre-production environment
4	PROD	Production environment
\.


--
-- Data for Name: file_formats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.file_formats (format_id, format_name) FROM stdin;
1	TEXT
2	JSON
3	CSV
4	XML
\.


--
-- Data for Name: file_processing_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.file_processing_log (process_id, file_id, status, error_message, started_at, completed_at) FROM stdin;
45	55	PARSED	\N	2026-02-11 12:54:58.98541+05:30	2026-02-11 12:54:59.01279+05:30
47	58	PARSED	\N	2026-02-11 15:27:06.907328+05:30	2026-02-11 15:27:06.938264+05:30
48	62	PARSED	\N	2026-02-16 10:58:15.386261+05:30	2026-02-16 10:58:15.442612+05:30
49	63	PARSED	\N	2026-02-16 10:58:15.850719+05:30	2026-02-16 10:58:16.14753+05:30
50	66	PARSED	\N	2026-02-16 12:32:48.985831+05:30	2026-02-16 12:32:49.002291+05:30
51	67	PARSED	\N	2026-02-16 12:53:13.775939+05:30	2026-02-16 12:53:13.832378+05:30
\.


--
-- Data for Name: log_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.log_categories (category_id, category_name) FROM stdin;
1	APPLICATION
2	SECURITY
3	INFRASTRUCTURE
4	AUDIT
5	UNCATEGORIZED
\.


--
-- Data for Name: log_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.log_entries (log_id, file_id, log_timestamp, severity_id, category_id, environment_id, service_name, host_name, message, raw_log, created_at) FROM stdin;
659	66	2024-10-12 15:53:45+05:30	2	1	\N	monitor	\N	Heartbeat received	    ts=2024-10-12T10:23:45Z   level=INFO    msg="Heartbeat received" service=monitor	2026-02-16 12:32:48.99474+05:30
660	66	2024-10-12 15:53:47+05:30	5	1	\N	db-service	\N	Database connection lost	time:2024-10-12T10:23:47Z priority=CRITICAL text=(Database connection lost) app=db-service	2026-02-16 12:32:48.99474+05:30
661	66	2024-10-12 00:00:00+05:30	2	3	4	\N	\N	Disk	(date=2024-10-12 10:23:49) msg=Disk almost full env=prod	2026-02-16 12:32:48.99474+05:30
662	66	2024-10-12 15:53:52+05:30	2	1	\N	\N	web-1	User logged out	msg="User logged out" ts=2024-10-12T10:23:52Z host=web-1	2026-02-16 12:32:48.99474+05:30
663	66	2024-10-12 15:53:55+05:30	2	1	\N	\N	\N	Session expired	@timestamp=2024-10-12T10:23:55Z log="Session expired" severity=INFO	2026-02-16 12:32:48.99474+05:30
648	63	2026-01-15 12:29:58+05:30	2	1	4	api-gateway	api-01	API Gateway boot sequence started	{"timestamp": "2026-01-15T06:59:58Z", "severity": "INFO", "environment": "PROD", "host": "api-01", "service": "api-gateway", "message": "API Gateway boot sequence started", "version": "2.4.1", "region": "ap-south-1"}	2026-02-16 10:58:16.098616+05:30
649	63	2026-01-15 12:30:00+05:30	2	1	4	api-gateway	api-01	Listening on port 443	{"timestamp": "2026-01-15T07:00:00Z", "severity": "INFO", "environment": "PROD", "host": "api-01", "service": "api-gateway", "message": "Listening on port 443", "request_id": "boot-req-001"}	2026-02-16 10:58:16.098616+05:30
650	63	2026-01-15 12:30:02+05:30	2	2	4	auth-service	auth-01	JWT public keys loaded	{"timestamp": "2026-01-15T07:00:02Z", "severity": "INFO", "environment": "PROD", "host": "auth-01", "service": "auth-service", "message": "JWT public keys loaded", "key_count": 4}	2026-02-16 10:58:16.098616+05:30
651	63	2026-01-15 12:30:05+05:30	1	1	4	user-service	user-02	Fetching user profile	{"timestamp": "2026-01-15T07:00:05Z", "severity": "DEBUG", "environment": "PROD", "host": "user-02", "service": "user-service", "message": "Fetching user profile", "user_id": "U10293", "request_id": "req-acde129"}	2026-02-16 10:58:16.098616+05:30
652	63	2026-01-15 12:30:07+05:30	3	2	4	auth-service	auth-01	JWT expired	{"timestamp": "2026-01-15T07:00:07Z", "severity": "WARN", "environment": "PROD", "host": "auth-01", "service": "auth-service", "message": "JWT expired", "user_id": "U10293", "token_id": "jwt-77881"}	2026-02-16 10:58:16.098616+05:30
653	63	2026-01-15 12:30:10+05:30	4	1	4	payment-service	payment-01	Payment gateway timeout	{"timestamp": "2026-01-15T07:00:10Z", "severity": "ERROR", "environment": "PROD", "host": "payment-01", "service": "payment-service", "message": "Payment gateway timeout", "endpoint": "/v1/pay", "latency_ms": 5021, "request_id": "pay-req-991"}	2026-02-16 10:58:16.098616+05:30
654	63	2026-01-15 12:30:11+05:30	2	4	4	audit	audit-01	Payment failure recorded	{"timestamp": "2026-01-15T07:00:11Z", "severity": "INFO", "environment": "PROD", "host": "audit-01", "service": "audit", "message": "Payment failure recorded", "reference": "pay-req-991"}	2026-02-16 10:58:16.098616+05:30
655	63	2026-01-15 12:30:15+05:30	2	1	4	kubernetes	infra-01	Pod restarted	{"timestamp": "2026-01-15T07:00:15Z", "severity": "INFO", "environment": "PROD", "host": "infra-01", "service": "kubernetes", "message": "Pod restarted", "pod": "payment-01", "namespace": "prod"}	2026-02-16 10:58:16.098616+05:30
656	63	2026-01-15 12:30:20+05:30	1	1	4	metrics	monitor-01	Heartbeat	{"timestamp": "2026-01-15T07:00:20Z", "severity": "DEBUG", "environment": "PROD", "host": "monitor-01", "service": "metrics", "message": "Heartbeat", "cpu": 61, "memory": 72}	2026-02-16 10:58:16.098616+05:30
657	63	2026-01-15 12:31:00+05:30	5	1	4	os	kernel-02	Kernel panic - not syncing	{"timestamp": "2026-01-15T07:01:00Z", "severity": "FATAL", "environment": "PROD", "host": "kernel-02", "service": "os", "message": "Kernel panic - not syncing", "error_code": "KP-9001"}	2026-02-16 10:58:16.098616+05:30
658	63	2026-01-15 12:32:00+05:30	2	1	1	payment-service	dev-api-01	Developer tested retry logic	{"timestamp": "2026-01-15T07:02:00Z", "severity": "INFO", "environment": "DEV", "host": "dev-api-01", "service": "payment-service", "message": "Developer tested retry logic"}	2026-02-16 10:58:16.098616+05:30
\.


--
-- Data for Name: log_severities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.log_severities (severity_id, severity_code, severity_level, description) FROM stdin;
1	DEBUG	10	Debug-level information
2	INFO	20	Operational information
3	WARN	30	Warning conditions
4	ERROR	40	Error conditions
5	FATAL	50	System failure
\.


--
-- Data for Name: log_sources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.log_sources (source_id, source_name) FROM stdin;
1	APPLICATION
2	SERVER
3	DATABASE
4	CLOUD
5	SECURITY_DEVICE
6	KUBERNETES
\.


--
-- Data for Name: login_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.login_history (login_id, user_id, login_time, login_ip, user_agent, success, failure_reason) FROM stdin;
29	17	2026-01-13 15:26:36.37923	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
30	17	2026-01-13 15:31:47.060551	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
31	17	2026-01-13 16:03:30.374796	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
32	17	2026-01-13 16:09:18.875084	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
33	17	2026-01-13 16:33:07.7591	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
34	1	2026-01-13 16:50:24.375422	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
35	17	2026-01-14 14:53:33.618797	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
36	17	2026-01-14 15:42:14.434755	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:146.0) Gecko/20100101 Firefox/146.0	t	\N
37	17	2026-01-19 10:04:37.249613	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
38	17	2026-01-19 11:14:08.02171	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
39	17	2026-01-19 11:17:51.587603	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
40	17	2026-01-19 11:19:34.259846	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
41	17	2026-01-19 11:57:30.741594	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
42	17	2026-01-19 12:29:16.821512	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
43	17	2026-01-19 13:00:00.219979	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
44	17	2026-01-19 13:03:27.168865	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
45	17	2026-01-19 15:12:25.347257	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
46	24	2026-01-19 15:24:16.078844	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
47	17	2026-01-19 16:07:05.864234	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
48	17	2026-01-19 16:24:25.501731	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
49	24	2026-01-19 16:25:31.312514	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
50	17	2026-01-19 16:32:15.139789	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
51	17	2026-01-19 18:39:51.693188	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
52	24	2026-01-19 18:57:14.673714	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
53	24	2026-01-19 19:34:10.027984	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
54	24	2026-01-20 10:45:30.947271	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
55	24	2026-01-20 11:17:40.832395	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
56	24	2026-01-20 11:33:52.814103	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
57	17	2026-01-20 11:34:52.493547	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
58	17	2026-01-20 11:34:59.66119	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
59	24	2026-01-20 11:52:38.197053	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
60	24	2026-01-20 12:25:26.603054	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
61	24	2026-01-20 13:01:59.334938	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
62	17	2026-01-20 13:23:29.687523	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
63	17	2026-01-20 14:36:53.176782	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
64	17	2026-01-20 15:07:25.456626	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
65	17	2026-01-20 15:13:57.246311	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
66	24	2026-01-20 15:16:22.147578	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
67	24	2026-01-20 15:17:32.978515	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
68	17	2026-01-20 15:47:05.633398	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
69	17	2026-01-20 16:17:46.269631	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
70	25	2026-01-20 16:24:27.611884	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
71	27	2026-01-20 16:25:56.896071	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
72	17	2026-01-20 16:27:33.01028	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
73	17	2026-01-20 16:47:46.701419	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
74	17	2026-01-20 16:59:22.296943	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
75	28	2026-01-20 17:00:36.582943	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
76	17	2026-01-20 18:01:42.713909	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
77	17	2026-01-20 19:29:10.867283	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
78	24	2026-01-20 19:30:14.049227	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
79	17	2026-01-20 19:34:57.682988	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
80	17	2026-01-21 10:40:18.395143	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
81	24	2026-01-21 10:44:37.429225	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
82	24	2026-01-21 10:44:46.351159	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
83	17	2026-01-21 11:31:08.650162	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
84	17	2026-01-21 11:31:17.690587	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
85	17	2026-01-21 11:49:05.950632	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
86	17	2026-01-21 12:40:09.019191	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
87	17	2026-01-21 13:17:40.478596	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
88	24	2026-01-21 13:31:34.856984	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
89	17	2026-01-21 13:34:43.210828	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
90	17	2026-01-21 14:49:49.416511	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
91	31	2026-01-21 14:56:58.743563	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
92	31	2026-01-21 15:47:50.132763	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
93	17	2026-01-21 16:09:43.199827	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
94	17	2026-01-21 16:09:44.483577	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
95	17	2026-01-21 16:09:53.302453	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
96	24	2026-01-21 16:23:01.324868	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
97	24	2026-01-21 16:56:43.453652	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
98	17	2026-01-21 18:01:22.212087	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
99	24	2026-01-21 18:08:49.84434	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
100	17	2026-01-21 18:18:40.216372	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
101	24	2026-01-21 18:23:13.788287	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
102	17	2026-01-21 18:43:34.46314	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
103	24	2026-01-22 10:03:04.093432	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
104	17	2026-01-22 10:04:56.013419	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
105	17	2026-01-22 11:06:06.525203	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
106	17	2026-01-22 11:29:58.689283	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
107	24	2026-01-22 11:38:40.491897	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
108	17	2026-01-22 11:47:16.915554	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
109	24	2026-01-22 12:34:38.887483	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
110	17	2026-01-22 12:56:42.986003	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
111	17	2026-01-22 14:31:26.174724	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
112	17	2026-01-22 15:24:39.404095	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
113	17	2026-01-22 15:40:40.988333	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
114	\N	2026-01-22 16:33:56.236139	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
115	17	2026-01-22 16:34:14.149846	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
116	\N	2026-01-22 16:42:01.432432	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
117	\N	2026-01-22 16:44:35.406309	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
118	17	2026-01-22 16:44:51.52658	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
119	24	2026-01-22 16:45:55.918179	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
120	24	2026-01-22 16:46:13.106541	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
121	17	2026-01-22 16:47:25.036277	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
122	24	2026-01-22 16:54:26.99122	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
123	17	2026-01-22 19:19:22.524217	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
124	17	2026-01-22 19:40:09.532289	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
125	17	2026-01-23 10:14:14.826763	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
126	17	2026-01-23 11:36:40.561848	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
127	24	2026-01-23 11:54:33.573972	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
128	17	2026-01-23 12:11:28.166855	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
129	17	2026-01-23 12:11:48.998591	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
130	17	2026-01-23 12:12:02.307137	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
131	24	2026-01-23 12:43:21.713611	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
132	17	2026-01-23 12:49:26.001549	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
133	17	2026-01-23 12:54:24.598083	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
134	24	2026-01-23 13:00:51.997351	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
135	17	2026-01-23 13:10:11.545092	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
136	17	2026-01-23 14:31:53.932646	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
137	17	2026-01-23 15:34:06.647516	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
138	17	2026-01-23 15:34:18.979263	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
139	17	2026-01-23 16:42:38.167381	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
140	24	2026-01-23 16:51:32.419982	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
141	17	2026-01-23 16:55:25.284174	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
142	17	2026-01-27 10:17:05.752418	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
143	24	2026-01-27 11:27:45.587493	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
144	17	2026-01-27 11:30:01.881554	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
145	17	2026-01-27 12:04:33.5478	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
146	17	2026-01-27 13:06:18.940496	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
147	17	2026-01-27 14:20:33.973069	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
148	17	2026-01-27 14:20:48.025591	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
149	17	2026-01-27 15:33:13.425809	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
150	17	2026-01-27 15:33:29.751897	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
151	17	2026-01-27 15:34:12.125879	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
152	24	2026-01-27 15:48:16.030105	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
153	24	2026-01-27 17:55:52.46243	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
154	24	2026-01-27 17:55:52.462117	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
155	24	2026-01-27 17:55:52.461784	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
156	24	2026-01-27 17:55:52.462701	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
157	17	2026-01-27 18:13:04.952228	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
158	24	2026-01-27 18:14:23.023125	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
159	24	2026-01-27 19:18:31.62851	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
160	17	2026-01-28 10:34:00.948034	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
161	24	2026-01-28 11:07:50.299298	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
162	17	2026-01-28 11:14:31.425017	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
163	17	2026-01-28 11:17:01.294499	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
164	24	2026-01-28 11:17:50.578958	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
165	17	2026-01-28 11:24:21.610767	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
166	17	2026-01-28 11:52:28.051155	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
167	17	2026-01-28 11:52:35.105928	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
168	24	2026-01-28 12:02:27.785731	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
169	17	2026-01-28 15:00:56.111376	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
170	24	2026-01-28 15:49:38.375169	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
171	24	2026-01-28 17:39:31.833427	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
172	24	2026-01-28 20:00:56.786475	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
173	24	2026-01-29 10:16:12.987424	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
174	24	2026-01-29 10:19:40.673434	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
175	17	2026-01-29 11:05:54.48127	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
176	24	2026-01-29 12:03:53.842428	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
177	17	2026-01-29 12:07:36.788041	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
178	24	2026-01-29 12:39:32.282896	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
179	17	2026-01-29 12:53:48.003112	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
180	17	2026-01-29 14:36:36.611723	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
181	24	2026-01-29 14:52:58.609184	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
182	17	2026-01-29 15:02:13.883258	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
183	17	2026-01-29 16:30:54.300791	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
184	17	2026-01-29 18:31:06.069554	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
185	17	2026-01-30 10:30:21.902607	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
186	17	2026-01-30 12:13:31.447894	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
187	17	2026-01-30 15:37:04.367215	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
188	24	2026-01-30 16:25:55.918116	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
189	17	2026-02-02 09:54:15.230751	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
190	24	2026-02-02 11:08:53.701257	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
191	17	2026-02-02 15:08:52.55444	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
192	24	2026-02-02 19:01:30.377159	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
193	17	2026-02-03 10:40:24.380863	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
194	17	2026-02-03 13:23:37.41656	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
195	24	2026-02-04 11:17:08.527164	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
196	17	2026-02-04 13:00:18.8843	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
197	17	2026-02-05 16:28:15.080847	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
198	24	2026-02-05 16:30:03.587163	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
199	24	2026-02-06 14:53:41.367818	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
200	17	2026-02-06 18:06:20.227791	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
201	17	2026-02-06 18:21:19.225789	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
202	24	2026-02-06 18:25:20.319103	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
203	17	2026-02-06 18:25:56.735299	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
204	17	2026-02-09 10:10:54.156345	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
205	17	2026-02-09 11:11:41.610744	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
206	17	2026-02-09 12:14:22.205913	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
207	24	2026-02-09 12:23:53.356937	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
208	24	2026-02-09 13:23:57.088428	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
209	17	2026-02-09 14:32:37.183626	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
210	17	2026-02-09 14:32:37.697112	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
211	24	2026-02-09 14:37:54.172831	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
212	17	2026-02-09 15:01:33.501845	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
213	17	2026-02-09 16:22:47.014845	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
214	17	2026-02-09 18:39:52.05287	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
215	17	2026-02-10 10:10:47.566367	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
216	24	2026-02-10 11:11:15.165629	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
217	17	2026-02-10 11:12:40.345955	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
218	17	2026-02-10 12:13:20.995507	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
219	17	2026-02-10 13:24:00.686229	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
220	24	2026-02-10 13:26:28.354825	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
221	17	2026-02-10 13:46:20.754429	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
222	17	2026-02-10 14:50:29.354339	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
223	24	2026-02-10 15:50:41.39062	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
224	17	2026-02-10 16:05:27.464026	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
225	24	2026-02-10 16:06:17.543138	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
226	17	2026-02-10 16:06:38.192774	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
227	24	2026-02-10 17:12:47.122895	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
228	17	2026-02-10 18:55:45.038245	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
229	17	2026-02-11 10:12:34.590733	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
230	17	2026-02-11 11:45:10.611906	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
231	17	2026-02-11 12:48:04.693605	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
232	17	2026-02-11 12:50:11.278844	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
233	17	2026-02-11 12:50:55.761601	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
234	17	2026-02-11 14:41:06.553352	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
235	17	2026-02-11 15:43:47.071532	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
236	17	2026-02-11 16:59:00.135827	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
237	17	2026-02-11 19:20:37.023442	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
239	17	2026-02-12 15:44:44.028253	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
238	17	2026-02-12 15:44:44.350564	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
240	17	2026-02-12 15:44:44.669035	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
241	17	2026-02-12 15:44:44.914343	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
242	17	2026-02-12 18:37:33.95483	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
243	24	2026-02-12 18:38:19.755931	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
244	17	2026-02-12 18:38:45.071303	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
245	17	2026-02-13 10:36:50.127935	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
246	17	2026-02-16 10:37:46.416185	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
247	17	2026-02-16 11:36:29.302903	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	INVALID_CREDENTIALS
248	17	2026-02-16 11:36:36.222456	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
249	24	2026-02-16 11:37:05.780732	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	f	ACCOUNT_DISABLED
250	17	2026-02-16 11:37:10.451566	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
251	24	2026-02-16 12:09:08.445408	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
252	17	2026-02-16 12:09:13.381778	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
253	17	2026-02-16 12:40:43.277731	127.0.0.1	Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:147.0) Gecko/20100101 Firefox/147.0	t	\N
\.


--
-- Data for Name: parsing_errors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parsing_errors (error_id, file_id, raw_line, reason, logged_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (permission_id, permission_key, description) FROM stdin;
1	UPLOAD_LOG	Upload log files
2	VIEW_LOG	View log data
3	DELETE_LOG	Delete log files
4	VIEW_SECURITY_LOG	View security-related logs
5	MANAGE_USERS	Manage users and roles
6	ARCHIVE_LOG	Archive log files
\.


--
-- Data for Name: raw_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.raw_files (file_id, team_id, uploaded_by, original_name, file_size_bytes, checksum, format_id, source_id, storage_type_id, storage_path, status_id, uploaded_at, is_deleted, deleted_at) FROM stdin;
67	1	17	past_updated.txt	13445	1bd67eb0188aa78c9a298af64af992e9473fd1506f478d9fef822ea85ead7e6a	1	1	2	17_1_8c7619c94bc84c4fb325b148c9078174_past_updated.txt	3	2026-02-16 12:53:13.390352+05:30	f	\N
55	1	17	logs.txt	332	ae0b31d8bb314e5fc0107f81f96230ca6f1f3241ddf269dbb27ba318e499be8d	1	1	2	17_1_b9306aa35b33447786dbccff7bc11942_logs.txt	3	2026-02-11 12:54:58.479621+05:30	f	\N
58	1	17	mongo.txt	574	e0c0855323bbd218a30219666477eaaf23295a09f1767c39a44094a8f41233f9	1	2	2	17_1_ee4bcf914c46470d946c22d2b49f6ef7_mongo.txt	3	2026-02-11 15:27:06.49027+05:30	f	\N
62	1	17	centralized_aggregated.txt	3049	20409fc2f982edf4db58bc40a0e51de9fabb2099e74e1ff249e6700901c65a58	1	1	2	17_1_e9bbd5cc341a44cc890109a83469dbc9_centralized_aggregated.txt	3	2026-02-16 10:58:14.697722+05:30	f	\N
63	1	17	runtime_events.json	2882	7401e1137d6d5ad7144dd8b3ca7a90807dfb065a447cb46d176b398c16413769	2	1	2	17_1_7e6fc5d1b527406e9744e71d7c3d41ae_runtime_events.json	3	2026-02-16 10:58:14.935177+05:30	f	\N
66	1	17	mixed.txt	1194	8855ae43cb37fdc044e687c2a52aeb64173a233f71052f24b4e9abac991c4161	1	1	2	17_1_78641acf222649b984584f4d5562d89a_mixed.txt	3	2026-02-16 12:32:48.515265+05:30	f	\N
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (role_id, role_name, description) FROM stdin;
1	ADMIN	System administrator with full privileges
2	USER	Standard employee access
3	SECURITY_ANALYST	Security monitoring and incident response
4	AUDITOR	Compliance and audit review access
\.


--
-- Data for Name: storage_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.storage_types (storage_type_id, storage_name) FROM stdin;
1	LOCAL
2	OBJECT
\.


--
-- Data for Name: team_upload_policies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_upload_policies (policy_id, team_id, format_id, is_allowed, created_at) FROM stdin;
1	1	1	t	2026-01-12 10:34:00.211033+05:30
2	1	2	t	2026-01-12 10:34:00.211033+05:30
3	2	1	t	2026-01-12 10:34:00.211033+05:30
4	2	2	t	2026-01-12 10:34:00.211033+05:30
5	4	2	t	2026-01-12 10:34:00.211033+05:30
6	4	3	t	2026-01-12 10:34:00.211033+05:30
7	3	1	t	2026-01-12 10:34:00.211033+05:30
8	3	2	t	2026-01-12 10:34:00.211033+05:30
9	3	1	t	2026-01-12 10:34:00.211033+05:30
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teams (team_id, team_name, created_at) FROM stdin;
1	Backend Engineering	2026-01-12 10:34:00.211033+05:30
2	DevOps	2026-01-12 10:34:00.211033+05:30
3	Security Operations	2026-01-12 10:34:00.211033+05:30
4	Cloud Infrastructure	2026-01-12 10:34:00.211033+05:30
\.


--
-- Data for Name: upload_statuses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.upload_statuses (status_id, status_code, description) FROM stdin;
1	UPLOADED	File uploaded successfully
2	PROCESSING	File parsing in progress
3	PARSED	Log parsing completed
4	FAILED	File processing failed
5	ARCHIVED	Archived as per retention policy
6	SOFT_DELETED	Soft deleting file.
7	PERMANENTLY_DELETED	File permanently removed
\.


--
-- Data for Name: user_credentials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_credentials (credential_id, user_id, password_hash, password_algo, failed_attempts, last_failed_at, is_locked, locked_until, password_changed_at) FROM stdin;
2	2	hashed_password_alice	bcrypt	0	\N	f	\N	2026-01-12 10:34:00.211033+05:30
3	3	hashed_password_bob	bcrypt	0	\N	f	\N	2026-01-12 10:34:00.211033+05:30
4	4	hashed_password_charlie	bcrypt	0	\N	f	\N	2026-01-12 10:34:00.211033+05:30
12	14	$2b$12$/m2OYIo9G.ywFaHMi3WK8uWTvS/iQCthwBDHW1C4VXqh8Mffawh8y	bcrypt	0	\N	f	\N	\N
14	16	$2b$12$kKWE41ZDllVb7QXfxH8gh.8PdEfc24CGhMyD75KlSF8UtdJSIHxgC	bcrypt	2	2026-01-12 16:11:28.150697+05:30	f	\N	2026-01-12 16:11:28.146185+05:30
20	24	$2b$12$t55Yy/b9ckYfeZduuJzt7OCprCoKJd0hWpLq0AVmY0g.MVhGG58G2	bcrypt	0	\N	f	\N	2026-01-22 16:54:26.99122+05:30
1	1	$2b$12$G1LRUS8eb/Ei5v/W7gGy..SD9DV78oVyg3eB2dVD0lSwXA0FArg6y	bcrypt	0	\N	f	\N	2026-01-12 10:34:00.211033+05:30
19	23	$2b$12$razx.cSFG7zjX99Jptf7CeLOIpJLLD0PQWQEQEzYFm8fDazHhexdi	bcrypt	0	\N	f	\N	2026-01-13 16:51:22.325687+05:30
21	25	$2b$12$CIojIlkiXGWQLNF9/HsTYufA533FT2qBp0eWIaIDmVrqbXl4rw/gi	bcrypt	0	\N	f	\N	2026-01-20 16:23:51.981462+05:30
22	27	$2b$12$LPUI6GuhJOyjIRiS44BW0uMWX3Pth/udMFxWwymfE4RvtUEFtgSri	bcrypt	0	\N	f	\N	2026-01-20 16:25:28.746896+05:30
15	17	$2b$12$gRjFLoMxY7hZ6d43O9RC2.RvcwtizGiNR0Pwabfg2X1nvDFRi5Sae	bcrypt	0	\N	f	\N	2026-02-16 11:36:36.222456+05:30
23	28	$2b$12$w7NTAbTOuR5JGMLdqm./dOWRGrSLL7jxh7CnlasewtbAYySbC9dpW	bcrypt	0	\N	f	\N	2026-01-20 17:01:08.580729+05:30
24	31	$2b$12$R7ezpeOL5OiIK.D0kfFlNufxxJNb8WGOJ1/U4yheM94BaFIoEnKSO	bcrypt	1	2026-01-21 15:47:50.131695+05:30	f	\N	2026-01-21 15:47:50.132763+05:30
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_profiles (profile_id, user_id, first_name, last_name, phone_number, profile_image_url, job_title, updated_at) FROM stdin;
1	1	System	Administrator	9000000001	\N	Platform Administrator	2026-01-12 10:34:00.211033+05:30
2	2	Alice	Johnson	9000000002	\N	Backend Software Engineer	2026-01-12 10:34:00.211033+05:30
3	3	Bob	Miller	9000000003	\N	DevOps Engineer	2026-01-12 10:34:00.211033+05:30
4	4	Charlie	Khan	9000000004	\N	Security Analyst	2026-01-12 10:34:00.211033+05:30
9	16	strge	strge	1233455778	string	string	2026-01-12 15:52:12.000116+05:30
12	23	Vinitha	Chincholi	9640671291	string	string	2026-01-13 16:51:22.325687+05:30
14	25	Chincholi	Vishal	879575674873		backend engineer	2026-01-20 16:23:51.981462+05:30
15	27	Vishal	Chincholi	89675848		Backend engineer	2026-01-20 16:25:28.746896+05:30
16	28	Vinitha	Chincholi	765876859435		dfbhdrgrfn	2026-01-20 17:00:15.91716+05:30
13	24	Vinitha					2026-01-21 10:56:22.291266+05:30
17	31	Vinitha	Chincholi	96568875772		Frontend Engineer	2026-01-21 14:56:35.921472+05:30
7	14	Vinitha	Chincholi	967574697	string	Backend	2026-02-09 11:40:38.71659+05:30
10	17	Vinitha	strig	123456784	https://	string	2026-02-10 11:03:45.27763+05:30
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (user_id, role_id, assigned_at) FROM stdin;
1	1	2026-01-12 10:34:00.211033+05:30
2	2	2026-01-12 10:34:00.211033+05:30
3	2	2026-01-12 10:34:00.211033+05:30
4	3	2026-01-12 10:34:00.211033+05:30
16	1	2026-01-12 15:52:12.000116+05:30
17	1	2026-01-12 16:19:43.302852+05:30
23	1	2026-01-13 16:51:22.325687+05:30
25	1	2026-01-20 16:23:51.981462+05:30
25	2	2026-01-20 16:23:51.981462+05:30
27	2	2026-01-20 16:25:28.746896+05:30
28	2	2026-01-20 17:00:15.91716+05:30
31	2	2026-01-21 14:56:35.921472+05:30
14	1	2026-02-09 11:40:38.71659+05:30
24	2	2026-02-09 12:23:39.94187+05:30
\.


--
-- Data for Name: user_teams; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_teams (user_id, team_id, joined_at) FROM stdin;
2	1	2026-01-12 12:47:27.941165+05:30
3	2	2026-01-12 12:47:27.941165+05:30
4	3	2026-01-12 12:47:27.941165+05:30
16	1	2026-01-12 15:52:12.000116+05:30
17	1	2026-01-12 16:19:43.302852+05:30
23	1	2026-01-13 16:51:22.325687+05:30
25	1	2026-01-20 16:23:51.981462+05:30
25	4	2026-01-20 16:23:51.981462+05:30
27	2	2026-01-20 16:25:28.746896+05:30
27	3	2026-01-20 16:25:28.746896+05:30
28	2	2026-01-20 17:00:15.91716+05:30
28	4	2026-01-20 17:00:15.91716+05:30
28	1	2026-01-20 17:00:15.91716+05:30
31	2	2026-01-21 14:56:35.921472+05:30
31	3	2026-01-21 14:56:35.921472+05:30
14	1	2026-02-09 11:40:38.71659+05:30
14	2	2026-02-09 11:40:38.71659+05:30
24	1	2026-02-09 12:23:39.94187+05:30
24	2	2026-02-09 12:23:39.94187+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, email, username, is_active, is_deleted, created_at, updated_at) FROM stdin;
16	vinitha@techvedik.com	stinr	t	f	2026-01-12 15:52:12.000116+05:30	2026-01-23 15:40:51.159715+05:30
4	charlie.khan@acmetech.com	charlie.k	t	f	2026-01-12 10:34:00.211033+05:30	2026-01-22 13:14:25.700041+05:30
1	system@gmail.com	system	t	f	2026-01-12 10:34:00.211033+05:30	2026-01-22 14:43:18.580786+05:30
2	alice.johnson@acmetech.com	alice.j	t	f	2026-01-12 10:34:00.211033+05:30	2026-01-22 14:43:47.472209+05:30
3	bob.miller@acmetech.com	bob.m	t	f	2026-01-12 10:34:00.211033+05:30	2026-01-22 14:51:27.286038+05:30
28	sravinshal@gmail.com	Sravinshal	t	f	2026-01-20 17:00:15.91716+05:30	2026-01-29 12:16:40.792727+05:30
17	vinitha@example.com	Vinitha_12	t	f	2026-01-12 16:19:43.302852+05:30	2026-01-22 15:22:35.388516+05:30
25	Vishal@gmail.com	Vishal	t	f	2026-01-20 16:23:51.981462+05:30	2026-01-20 16:23:51.981462+05:30
31	chincholi@gmail.com	Charle	t	f	2026-01-21 14:56:35.921472+05:30	2026-01-29 15:28:15.198182+05:30
27	chincholivishal@gmail.com	Vishal_123	t	f	2026-01-20 16:25:28.746896+05:30	2026-02-09 16:57:56.942509+05:30
23	vinitha.chincholi@techvedika.com	vinithac	t	f	2026-01-13 16:51:22.325687+05:30	2026-01-22 16:11:33.569364+05:30
14	vinitha@techvedika.com	User_123	t	f	\N	2026-02-16 10:58:54.155182+05:30
24	chincholivinitha@gmail.com	Vinitha	t	f	2026-01-19 15:20:24.619863+05:30	2026-02-16 11:37:22.773747+05:30
\.


--
-- Name: archives_archive_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.archives_archive_id_seq', 1, false);


--
-- Name: audit_logs_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_audit_id_seq', 1, false);


--
-- Name: audit_trail_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_trail_audit_id_seq', 300, true);


--
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 3, true);


--
-- Name: environments_environment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.environments_environment_id_seq', 4, true);


--
-- Name: file_formats_format_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.file_formats_format_id_seq', 4, true);


--
-- Name: file_processing_log_process_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.file_processing_log_process_id_seq', 51, true);


--
-- Name: log_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.log_categories_category_id_seq', 5, true);


--
-- Name: log_entries_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.log_entries_log_id_seq', 663, true);


--
-- Name: log_severities_severity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.log_severities_severity_id_seq', 5, true);


--
-- Name: log_sources_source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.log_sources_source_id_seq', 6, true);


--
-- Name: login_history_login_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.login_history_login_id_seq', 253, true);


--
-- Name: parsing_errors_error_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.parsing_errors_error_id_seq', 1, false);


--
-- Name: permissions_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_permission_id_seq', 6, true);


--
-- Name: raw_files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.raw_files_file_id_seq', 67, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 4, true);


--
-- Name: storage_types_storage_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.storage_types_storage_type_id_seq', 2, true);


--
-- Name: team_upload_policies_policy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.team_upload_policies_policy_id_seq', 9, true);


--
-- Name: teams_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teams_team_id_seq', 4, true);


--
-- Name: upload_statuses_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.upload_statuses_status_id_seq', 7, true);


--
-- Name: user_credentials_credential_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_credentials_credential_id_seq', 24, true);


--
-- Name: user_profiles_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_profiles_profile_id_seq', 17, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 31, true);


--
-- Name: archives archives_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.archives
    ADD CONSTRAINT archives_pkey PRIMARY KEY (archive_id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (audit_id);


--
-- Name: audit_trail audit_trail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_trail
    ADD CONSTRAINT audit_trail_pkey PRIMARY KEY (audit_id);


--
-- Name: department_teams department_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_teams
    ADD CONSTRAINT department_teams_pkey PRIMARY KEY (department_id, team_id);


--
-- Name: departments departments_department_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_department_name_key UNIQUE (department_name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: environments environments_environment_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.environments
    ADD CONSTRAINT environments_environment_code_key UNIQUE (environment_code);


--
-- Name: environments environments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.environments
    ADD CONSTRAINT environments_pkey PRIMARY KEY (environment_id);


--
-- Name: file_formats file_formats_format_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_formats
    ADD CONSTRAINT file_formats_format_name_key UNIQUE (format_name);


--
-- Name: file_formats file_formats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_formats
    ADD CONSTRAINT file_formats_pkey PRIMARY KEY (format_id);


--
-- Name: file_processing_log file_processing_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_processing_log
    ADD CONSTRAINT file_processing_log_pkey PRIMARY KEY (process_id);


--
-- Name: log_categories log_categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_categories
    ADD CONSTRAINT log_categories_category_name_key UNIQUE (category_name);


--
-- Name: log_categories log_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_categories
    ADD CONSTRAINT log_categories_pkey PRIMARY KEY (category_id);


--
-- Name: log_entries log_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_entries
    ADD CONSTRAINT log_entries_pkey PRIMARY KEY (log_id);


--
-- Name: log_severities log_severities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_severities
    ADD CONSTRAINT log_severities_pkey PRIMARY KEY (severity_id);


--
-- Name: log_severities log_severities_severity_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_severities
    ADD CONSTRAINT log_severities_severity_code_key UNIQUE (severity_code);


--
-- Name: log_sources log_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_sources
    ADD CONSTRAINT log_sources_pkey PRIMARY KEY (source_id);


--
-- Name: log_sources log_sources_source_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_sources
    ADD CONSTRAINT log_sources_source_name_key UNIQUE (source_name);


--
-- Name: login_history login_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_pkey PRIMARY KEY (login_id);


--
-- Name: parsing_errors parsing_errors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parsing_errors
    ADD CONSTRAINT parsing_errors_pkey PRIMARY KEY (error_id);


--
-- Name: permissions permissions_permission_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permission_key_key UNIQUE (permission_key);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permission_id);


--
-- Name: raw_files raw_files_checksum_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_checksum_key UNIQUE (checksum);


--
-- Name: raw_files raw_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_pkey PRIMARY KEY (file_id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: storage_types storage_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.storage_types
    ADD CONSTRAINT storage_types_pkey PRIMARY KEY (storage_type_id);


--
-- Name: storage_types storage_types_storage_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.storage_types
    ADD CONSTRAINT storage_types_storage_name_key UNIQUE (storage_name);


--
-- Name: team_upload_policies team_upload_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_upload_policies
    ADD CONSTRAINT team_upload_policies_pkey PRIMARY KEY (policy_id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (team_id);


--
-- Name: teams teams_team_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_team_name_key UNIQUE (team_name);


--
-- Name: upload_statuses upload_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_statuses
    ADD CONSTRAINT upload_statuses_pkey PRIMARY KEY (status_id);


--
-- Name: upload_statuses upload_statuses_status_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_statuses
    ADD CONSTRAINT upload_statuses_status_code_key UNIQUE (status_code);


--
-- Name: user_credentials user_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_credentials
    ADD CONSTRAINT user_credentials_pkey PRIMARY KEY (credential_id);


--
-- Name: user_credentials user_credentials_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_credentials
    ADD CONSTRAINT user_credentials_user_id_key UNIQUE (user_id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (profile_id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: user_teams user_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_teams
    ADD CONSTRAINT user_teams_pkey PRIMARY KEY (user_id, team_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: uniq_active_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_active_email ON public.users USING btree (email) WHERE (is_deleted = false);


--
-- Name: uniq_active_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_active_username ON public.users USING btree (username) WHERE (is_deleted = false);


--
-- Name: archives archives_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.archives
    ADD CONSTRAINT archives_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.raw_files(file_id);


--
-- Name: audit_logs audit_logs_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(user_id);


--
-- Name: audit_trail audit_trail_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_trail
    ADD CONSTRAINT audit_trail_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: department_teams department_teams_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_teams
    ADD CONSTRAINT department_teams_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;


--
-- Name: department_teams department_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_teams
    ADD CONSTRAINT department_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id) ON DELETE CASCADE;


--
-- Name: file_processing_log file_processing_log_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_processing_log
    ADD CONSTRAINT file_processing_log_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.raw_files(file_id) ON DELETE CASCADE;


--
-- Name: log_entries log_entries_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_entries
    ADD CONSTRAINT log_entries_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.log_categories(category_id);


--
-- Name: log_entries log_entries_environment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_entries
    ADD CONSTRAINT log_entries_environment_id_fkey FOREIGN KEY (environment_id) REFERENCES public.environments(environment_id);


--
-- Name: log_entries log_entries_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_entries
    ADD CONSTRAINT log_entries_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.raw_files(file_id) ON DELETE CASCADE;


--
-- Name: log_entries log_entries_severity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_entries
    ADD CONSTRAINT log_entries_severity_id_fkey FOREIGN KEY (severity_id) REFERENCES public.log_severities(severity_id);


--
-- Name: login_history login_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.login_history
    ADD CONSTRAINT login_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: parsing_errors parsing_errors_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parsing_errors
    ADD CONSTRAINT parsing_errors_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.raw_files(file_id);


--
-- Name: raw_files raw_files_format_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.file_formats(format_id);


--
-- Name: raw_files raw_files_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.log_sources(source_id) ON DELETE CASCADE;


--
-- Name: raw_files raw_files_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.upload_statuses(status_id);


--
-- Name: raw_files raw_files_storage_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_storage_type_id_fkey FOREIGN KEY (storage_type_id) REFERENCES public.storage_types(storage_type_id);


--
-- Name: raw_files raw_files_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id);


--
-- Name: raw_files raw_files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.raw_files
    ADD CONSTRAINT raw_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(permission_id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: team_upload_policies team_upload_policies_format_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_upload_policies
    ADD CONSTRAINT team_upload_policies_format_id_fkey FOREIGN KEY (format_id) REFERENCES public.file_formats(format_id);


--
-- Name: team_upload_policies team_upload_policies_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_upload_policies
    ADD CONSTRAINT team_upload_policies_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id) ON DELETE CASCADE;


--
-- Name: user_credentials user_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_credentials
    ADD CONSTRAINT user_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_teams user_teams_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_teams
    ADD CONSTRAINT user_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(team_id) ON DELETE CASCADE;


--
-- Name: user_teams user_teams_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_teams
    ADD CONSTRAINT user_teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict v7h4ohc8WWnHWEK2y6kDsSVFGHJm6c3csUtulyTSzPRVgrKTZhAakHtTS5fJM9L

