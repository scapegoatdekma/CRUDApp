--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-04-15 19:20:56

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

--
-- TOC entry 5 (class 2615 OID 32835)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 229 (class 1255 OID 41145)
-- Name: update_employee_profile_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_employee_profile_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_employee_profile_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 32836)
-- Name: assigned_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assigned_tickets (
    ticket_id integer NOT NULL,
    employee_id integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT now(),
    last_updated timestamp without time zone DEFAULT now()
);


ALTER TABLE public.assigned_tickets OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 41149)
-- Name: employee_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    "position" character varying(100) DEFAULT 'Сотрудник'::character varying NOT NULL,
    hire_date date DEFAULT CURRENT_DATE NOT NULL,
    salary numeric(10,2),
    rating integer DEFAULT 0,
    points integer DEFAULT 0,
    bio text,
    work_schedule jsonb DEFAULT '{"type": "full-time", "hours": 40}'::jsonb,
    emergency_contact jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT employee_profiles_points_check CHECK ((points >= 0)),
    CONSTRAINT employee_profiles_rating_check CHECK ((rating >= 0))
);


ALTER TABLE public.employee_profiles OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 41148)
-- Name: employee_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_profiles_id_seq OWNER TO postgres;

--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 227
-- Name: employee_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_profiles_id_seq OWNED BY public.employee_profiles.id;


--
-- TOC entry 216 (class 1259 OID 32841)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    text text NOT NULL,
    username character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id integer NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    attachments jsonb
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 32848)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 217
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 218 (class 1259 OID 32849)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 32852)
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO postgres;

--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 219
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- TOC entry 220 (class 1259 OID 32853)
-- Name: ticket_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_statuses (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.ticket_statuses OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 32856)
-- Name: ticket_statuses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ticket_statuses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ticket_statuses_id_seq OWNER TO postgres;

--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 221
-- Name: ticket_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_statuses_id_seq OWNED BY public.ticket_statuses.id;


--
-- TOC entry 222 (class 1259 OID 32857)
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    client_id integer,
    status_id integer DEFAULT 1,
    priority integer DEFAULT 3,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    chat_room_id uuid DEFAULT gen_random_uuid(),
    category character varying(255),
    attachments jsonb,
    CONSTRAINT tickets_priority_check CHECK (((priority >= 1) AND (priority <= 5)))
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32868)
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tickets_id_seq OWNER TO postgres;

--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 223
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- TOC entry 224 (class 1259 OID 32869)
-- Name: user_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_skills (
    user_id integer NOT NULL,
    skill_id integer NOT NULL,
    proficiency_level integer,
    CONSTRAINT user_skills_proficiency_level_check CHECK (((proficiency_level >= 1) AND (proficiency_level <= 5)))
);


ALTER TABLE public.user_skills OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 32873)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    avatar character varying(255),
    role character varying(20) DEFAULT 'client'::character varying NOT NULL,
    is_active boolean DEFAULT true,
    current_load integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 32883)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4687 (class 2604 OID 41152)
-- Name: employee_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profiles ALTER COLUMN id SET DEFAULT nextval('public.employee_profiles_id_seq'::regclass);


--
-- TOC entry 4670 (class 2604 OID 32884)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 4673 (class 2604 OID 32885)
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 32886)
-- Name: ticket_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_statuses ALTER COLUMN id SET DEFAULT nextval('public.ticket_statuses_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 32887)
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 32888)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4878 (class 0 OID 32836)
-- Dependencies: 215
-- Data for Name: assigned_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4891 (class 0 OID 41149)
-- Dependencies: 228
-- Data for Name: employee_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.employee_profiles VALUES (1, 1, 'Администратор', '2025-03-04', NULL, 0, 0, NULL, '{"type": "full-time", "hours": 40}', NULL, '2025-03-04 20:10:38.77356+03', '2025-03-04 20:10:38.77356+03');


--
-- TOC entry 4879 (class 0 OID 32841)
-- Dependencies: 216
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.messages VALUES (2, 'привет', 'dekmaOFF', '2025-03-25 13:01:24.598605', 1, '2025-03-25 13:01:24.598605', NULL);
INSERT INTO public.messages VALUES (5, 'ку1', 'хуесос', '2025-03-25 14:15:09.887044', 4, '2025-03-25 14:15:18.614838', NULL);
INSERT INTO public.messages VALUES (8, 'SDFGFSDAsadasd', 'dekmaOFF', '2025-03-29 12:59:44.798284', 1, '2025-03-29 13:01:35.526765', NULL);
INSERT INTO public.messages VALUES (9, 'ку', 'dekmaOFF', '2025-03-29 20:12:54.061937', 1, '2025-03-29 20:12:54.061937', NULL);
INSERT INTO public.messages VALUES (10, 'вава', 'dekmaOFF', '2025-03-29 20:12:58.965482', 1, '2025-03-29 20:12:58.965482', NULL);
INSERT INTO public.messages VALUES (13, 'sdfsd', 'dekmaOFF', '2025-03-31 17:25:50.85126', 1, '2025-03-31 17:25:50.85126', NULL);
INSERT INTO public.messages VALUES (14, 'фчявмычм', 'dekmaOFF', '2025-03-31 17:28:52.331819', 1, '2025-03-31 17:28:52.331819', NULL);
INSERT INTO public.messages VALUES (15, 'фывфыв', 'dekmaOFF', '2025-03-31 17:29:52.151609', 1, '2025-03-31 17:29:52.151609', NULL);
INSERT INTO public.messages VALUES (11, 'пивет!!sadasd', 'KLOADA', '2025-03-29 20:14:50.916763', 3, '2025-03-31 17:38:26.985993', NULL);
INSERT INTO public.messages VALUES (16, 'аыва111', 'KLOADA', '2025-03-31 17:40:29.937831', 3, '2025-03-31 17:40:37.161494', NULL);
INSERT INTO public.messages VALUES (17, '!!!!', 'KLOADA', '2025-03-31 17:40:39.025465', 3, '2025-03-31 17:40:39.025465', NULL);
INSERT INTO public.messages VALUES (18, 'пидор', 'KLOADA', '2025-03-31 17:40:43.729382', 3, '2025-03-31 17:40:43.729382', NULL);
INSERT INTO public.messages VALUES (19, 'сам ты пидор', 'хуесос', '2025-03-31 17:41:14.136848', 4, '2025-03-31 17:41:14.136848', NULL);
INSERT INTO public.messages VALUES (20, 'эщкеря', 'хуесос', '2025-03-31 17:49:29.259589', 4, '2025-03-31 17:49:29.259589', NULL);
INSERT INTO public.messages VALUES (21, 'ъзю', 'хуесос', '2025-03-31 17:54:43.795613', 4, '2025-03-31 17:54:43.795613', NULL);
INSERT INTO public.messages VALUES (22, 'dfgdfsgsd', 'хуесос', '2025-03-31 18:03:21.824481', 4, '2025-03-31 18:03:21.824481', NULL);
INSERT INTO public.messages VALUES (24, 'пивет!', 'KLOADA', '2025-04-02 19:43:25.473685', 3, '2025-04-02 19:43:25.473685', NULL);
INSERT INTO public.messages VALUES (25, 'пивет!!!!!!!!!!!!!!!!!!!!!!!!!!', 'KLOADA', '2025-04-02 19:51:42.360406', 3, '2025-04-02 19:51:42.360406', NULL);
INSERT INTO public.messages VALUES (26, 'ку', 'KLOADA', '2025-04-03 15:50:12.397816', 3, '2025-04-03 15:50:12.397816', NULL);
INSERT INTO public.messages VALUES (27, 'ПИВЕТ!"!!', 'KLOADA', '2025-04-07 05:02:12.717656', 3, '2025-04-07 05:02:12.717656', NULL);


--
-- TOC entry 4881 (class 0 OID 32849)
-- Dependencies: 218
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4883 (class 0 OID 32853)
-- Dependencies: 220
-- Data for Name: ticket_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ticket_statuses VALUES (1, 'Новая');
INSERT INTO public.ticket_statuses VALUES (2, 'В обработке');
INSERT INTO public.ticket_statuses VALUES (3, 'Выполнена');
INSERT INTO public.ticket_statuses VALUES (4, 'Отменена');


--
-- TOC entry 4885 (class 0 OID 32857)
-- Dependencies: 222
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tickets VALUES (66, 'Проблема с авторизацией', 'Пользователь не может войти в систему, ошибка 403', 1, 1, 2, '2025-03-28 20:47:12.525368', '2025-03-26 13:21:40.449955', '49ffba78-3120-4455-979c-b037853eda95', 'Техническая', NULL);
INSERT INTO public.tickets VALUES (67, 'Обновление информации', 'Необходимо обновить контактные данные клиента', 2, 2, 3, '2025-03-26 20:18:45.294936', '2025-03-27 09:21:13.32856', '6b6b4ba7-9b89-4fa0-bfbb-b88a4e8ca836', 'Данные', NULL);
INSERT INTO public.tickets VALUES (68, 'Ошибка в отчете', 'В финансовом отчете некорректные суммы', 2, 1, 1, '2025-03-25 04:52:08.66917', '2025-03-25 17:10:38.431491', '923fd679-a7ff-463a-baf4-9b1e5430ffa1', 'Финансы', NULL);
INSERT INTO public.tickets VALUES (69, 'Запрос на новые функции', 'Добавить возможность экспорта в Excel', 1, 3, 2, '2025-03-25 08:21:09.905116', '2025-03-24 07:24:31.277919', '69d7ae03-92a9-4684-9276-2eaab8e4ad04', 'Разработка', NULL);
INSERT INTO public.tickets VALUES (70, 'Проблема с печатью', 'Принтер не печатает документы', 2, 1, 2, '2025-03-25 23:16:50.080152', '2025-03-29 09:52:25.630381', '55bf4ae9-9f26-49e5-b909-d21f0e643564', 'Оборудование', NULL);
INSERT INTO public.tickets VALUES (71, 'Вопрос по оплате', 'Клиент не получил счет на оплату', 1, 2, 1, '2025-03-29 21:44:49.031026', '2025-03-25 16:14:56.054706', '77f1325d-114f-443d-a826-9d5edc4df09c', 'Финансы', NULL);
INSERT INTO public.tickets VALUES (72, 'Настройка доступа', 'Нужно предоставить доступ к CRM новому сотруднику', 1, 1, 3, '2025-03-28 15:16:59.227527', '2025-03-25 21:31:54.192533', '07db27bc-df74-44ac-8c63-c17871edded1', 'Безопасность', NULL);
INSERT INTO public.tickets VALUES (73, 'Ошибка в мобильном приложении', 'Приложение крашится при открытии профиля', 1, 1, 1, '2025-03-27 16:04:51.372662', '2025-03-28 23:08:15.447564', '901cb1f7-b41c-4f75-91c0-3fe5b2546a57', 'Мобильное', NULL);
INSERT INTO public.tickets VALUES (74, 'Обучение новому функционалу', 'Провести обучение по новому модулю', 2, 3, 2, '2025-03-28 21:11:08.377655', '2025-03-29 17:51:50.059739', 'b4fe3aed-c67c-420d-aa65-181370025007', 'Обучение', NULL);
INSERT INTO public.tickets VALUES (75, 'Проблема с интернетом', 'Нестабильное интернет-соединение в офисе', 1, 1, 2, '2025-03-30 17:06:53.961045', '2025-03-28 00:09:47.239936', '6947ceeb-6b8f-4d56-920e-88f634cf4231', 'Инфраструктура', NULL);
INSERT INTO public.tickets VALUES (76, 'пИДОРАСЫ', 'почините интернет суки', 3, 1, 2, '2025-04-07 05:09:44.438833', '2025-04-07 05:09:44.438833', '7db53b50-508c-4afe-b1ed-3816ce271a0b', 'Другое', '[{"name": "_2025-04-07_050941698.png", "path": "/uploads/1743991784409-_2025-04-07_050941698.png", "size": 500438, "type": "image/png"}]');


--
-- TOC entry 4887 (class 0 OID 32869)
-- Dependencies: 224
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4888 (class 0 OID 32873)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'dekmaOFF', 'safonovkirill113@gmail.com', '$2b$10$Bm5vVqZYhVGXLHLG2dDTbu7uqe/H7yn4AlAGDiWPqP5nPAsBg0A9S', '/uploads/1741108238716-744725972.jpg', 'admin', true, 0, '2025-03-04 20:10:38.77356', '2025-03-04 20:10:38.77356');
INSERT INTO public.users VALUES (2, 'KLOAD_', '123@example.com', '$2b$10$5m6zE18RFJOKMIbCBBOhEeKPdY5t4hCmmtSs1.FHC2GTdNmkXzYSe', '/default-avatar.png', 'client', true, 0, '2025-03-21 19:31:58.596787', '2025-03-21 19:31:58.596787');
INSERT INTO public.users VALUES (3, 'KLOADA', 'root@example.com', '$2b$10$BoO0UVUINa3E2vaTHgf5iu1e9zuaMSUBiqOeERIMUFXh5taeg86W.', '/uploads/avatars/1742574814995-v4c79a30s.jpg', 'client', true, 0, '2025-03-21 19:33:35.053088', '2025-03-21 19:33:35.053088');
INSERT INTO public.users VALUES (4, 'хуесос', 'dekma@gmail.com', '$2b$10$GdH9fLxP4aBdy5XDwoz6XuMyoChcSxpiYXYHoulLxrAc3jkOS78.G', '/uploads/avatars/1742901275763-kv1oxdkiv.jpg', 'client', true, 0, '2025-03-25 14:14:35.817789', '2025-03-25 14:14:35.817789');


--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 227
-- Name: employee_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_profiles_id_seq', 1, true);


--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 217
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 27, true);


--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 219
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 1, false);


--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 221
-- Name: ticket_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_statuses_id_seq', 4, true);


--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 223
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 76, true);


--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 4700 (class 2606 OID 32890)
-- Name: assigned_tickets assigned_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tickets
    ADD CONSTRAINT assigned_tickets_pkey PRIMARY KEY (ticket_id, employee_id);


--
-- TOC entry 4724 (class 2606 OID 41165)
-- Name: employee_profiles employee_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4726 (class 2606 OID 41167)
-- Name: employee_profiles employee_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_user_id_key UNIQUE (user_id);


--
-- TOC entry 4704 (class 2606 OID 32892)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4706 (class 2606 OID 32894)
-- Name: skills skills_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_name_key UNIQUE (name);


--
-- TOC entry 4708 (class 2606 OID 32896)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- TOC entry 4710 (class 2606 OID 32898)
-- Name: ticket_statuses ticket_statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_statuses
    ADD CONSTRAINT ticket_statuses_name_key UNIQUE (name);


--
-- TOC entry 4712 (class 2606 OID 32900)
-- Name: ticket_statuses ticket_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_statuses
    ADD CONSTRAINT ticket_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 4714 (class 2606 OID 32902)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- TOC entry 4716 (class 2606 OID 32904)
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (user_id, skill_id);


--
-- TOC entry 4718 (class 2606 OID 32906)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4720 (class 2606 OID 32908)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4722 (class 2606 OID 32910)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4701 (class 1259 OID 32911)
-- Name: idx_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at);


--
-- TOC entry 4702 (class 1259 OID 32912)
-- Name: idx_messages_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_user_id ON public.messages USING btree (user_id);


--
-- TOC entry 4727 (class 2606 OID 32913)
-- Name: assigned_tickets assigned_tickets_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tickets
    ADD CONSTRAINT assigned_tickets_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4728 (class 2606 OID 32918)
-- Name: assigned_tickets assigned_tickets_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tickets
    ADD CONSTRAINT assigned_tickets_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- TOC entry 4734 (class 2606 OID 41168)
-- Name: employee_profiles employee_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4729 (class 2606 OID 32923)
-- Name: messages fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4730 (class 2606 OID 32928)
-- Name: tickets tickets_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4731 (class 2606 OID 32933)
-- Name: tickets tickets_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.ticket_statuses(id);


--
-- TOC entry 4732 (class 2606 OID 32938)
-- Name: user_skills user_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- TOC entry 4733 (class 2606 OID 32943)
-- Name: user_skills user_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-04-15 19:20:56

--
-- PostgreSQL database dump complete
--

