--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-03-08 11:19:37

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
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16451)
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
-- TOC entry 223 (class 1259 OID 16469)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16468)
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
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 222
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- TOC entry 218 (class 1259 OID 16418)
-- Name: ticket_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ticket_statuses (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.ticket_statuses OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16417)
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
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 217
-- Name: ticket_statuses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ticket_statuses_id_seq OWNED BY public.ticket_statuses.id;


--
-- TOC entry 220 (class 1259 OID 16427)
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
    CONSTRAINT tickets_priority_check CHECK (((priority >= 1) AND (priority <= 5)))
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16426)
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
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 219
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- TOC entry 224 (class 1259 OID 16477)
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
-- TOC entry 216 (class 1259 OID 16400)
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
-- TOC entry 215 (class 1259 OID 16399)
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
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4672 (class 2604 OID 16472)
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- TOC entry 4663 (class 2604 OID 16421)
-- Name: ticket_statuses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_statuses ALTER COLUMN id SET DEFAULT nextval('public.ticket_statuses_id_seq'::regclass);


--
-- TOC entry 4664 (class 2604 OID 16430)
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- TOC entry 4657 (class 2604 OID 16403)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4850 (class 0 OID 16451)
-- Dependencies: 221
-- Data for Name: assigned_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4852 (class 0 OID 16469)
-- Dependencies: 223
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4847 (class 0 OID 16418)
-- Dependencies: 218
-- Data for Name: ticket_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ticket_statuses VALUES (1, 'Новая');
INSERT INTO public.ticket_statuses VALUES (2, 'В обработке');
INSERT INTO public.ticket_statuses VALUES (3, 'Выполнена');
INSERT INTO public.ticket_statuses VALUES (4, 'Отменена');


--
-- TOC entry 4849 (class 0 OID 16427)
-- Dependencies: 220
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4853 (class 0 OID 16477)
-- Dependencies: 224
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4845 (class 0 OID 16400)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (1, 'dekmaOFF', 'safonovkirill113@gmail.com', '$2b$10$Bm5vVqZYhVGXLHLG2dDTbu7uqe/H7yn4AlAGDiWPqP5nPAsBg0A9S', '/uploads/1741108238716-744725972.jpg', 'admin', true, 0, '2025-03-04 20:10:38.77356', '2025-03-04 20:10:38.77356');


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 222
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 1, false);


--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 217
-- Name: ticket_statuses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_statuses_id_seq', 4, true);


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 219
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 1, false);


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4688 (class 2606 OID 16457)
-- Name: assigned_tickets assigned_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tickets
    ADD CONSTRAINT assigned_tickets_pkey PRIMARY KEY (ticket_id, employee_id);


--
-- TOC entry 4690 (class 2606 OID 16476)
-- Name: skills skills_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_name_key UNIQUE (name);


--
-- TOC entry 4692 (class 2606 OID 16474)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- TOC entry 4682 (class 2606 OID 16425)
-- Name: ticket_statuses ticket_statuses_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_statuses
    ADD CONSTRAINT ticket_statuses_name_key UNIQUE (name);


--
-- TOC entry 4684 (class 2606 OID 16423)
-- Name: ticket_statuses ticket_statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ticket_statuses
    ADD CONSTRAINT ticket_statuses_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16440)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 16482)
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (user_id, skill_id);


--
-- TOC entry 4676 (class 2606 OID 16416)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4678 (class 2606 OID 16412)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4680 (class 2606 OID 16414)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4697 (class 2606 OID 16463)
-- Name: assigned_tickets assigned_tickets_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tickets
    ADD CONSTRAINT assigned_tickets_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4698 (class 2606 OID 16458)
-- Name: assigned_tickets assigned_tickets_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_tickets
    ADD CONSTRAINT assigned_tickets_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE;


--
-- TOC entry 4695 (class 2606 OID 16441)
-- Name: tickets tickets_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4696 (class 2606 OID 16446)
-- Name: tickets tickets_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.ticket_statuses(id);


--
-- TOC entry 4699 (class 2606 OID 16488)
-- Name: user_skills user_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id) ON DELETE CASCADE;


--
-- TOC entry 4700 (class 2606 OID 16483)
-- Name: user_skills user_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-03-08 11:19:37

--
-- PostgreSQL database dump complete
--

