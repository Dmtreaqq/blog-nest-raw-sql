CREATE TABLE IF NOT EXISTS users (
	id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
	login varchar(10) NOT NULL,
	password varchar(450) NOT NULL,
	email varchar(50) NOT NULL,
	is_confirmed boolean NOT NULL,
	created_at timestamptz NOT NULL default now(),
	confirmation_code varchar(40) default '0',
	confirmation_exp_date timestamptz default now(),
	recovery_code varchar(40) default '0',
	recovery_exp_date timestamptz default now()
);

CREATE TABLE IF NOT EXISTS users_device_sessions (
	id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
	user_id uuid NOT NULL,
	device_id uuid NOT NULL,
	ip varchar(100) NOT NULL,
	device_name varchar NOT NULL,
	issued_at integer NOT NULL,
	expiration_date integer NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blogs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(15) NOT NULL,
    description varchar(500) NOT NULL,
    website_url varchar(100) CHECK( website_url ~ '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$' ) NOT NULL,
    is_membership boolean NOT NULL,
    created_at timestamptz NOT NULL default now()
)

CREATE TABLE IF NOT EXISTS posts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title varchar NOT NULL,
    short_description varchar NOT NULL,
    "content" varchar NOT NULL,
    blog_name varchar NOT NULL,
	blog_id uuid NOT NULL,
    created_at timestamptz NOT NULL default now(),
	FOREIGN KEY (blog_id) REFERENCES blogs(id)
)

CREATE TABLE IF NOT EXISTS posts (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title varchar NOT NULL,
    short_description varchar NOT NULL,
    "content" varchar NOT NULL,
    blog_name varchar NOT NULL,
	blog_id uuid NOT NULL,
    created_at timestamptz NOT NULL default now(),
	FOREIGN KEY (blog_id) REFERENCES blogs(id)
)

CREATE TABLE IF NOT EXISTS comments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid NOT NULL,
    commentator_id uuid NOT NULL,
    content varchar NOT NULL,
    created_at timestamptz NOT NULL default now(),
	FOREIGN KEY (post_id) REFERENCES posts(id),
	FOREIGN KEY (commentator_id) REFERENCES users(id)
)

CREATE TABLE IF NOT EXISTS reactions (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    entity_id uuid NOT NULL,
    reaction_status varchar NOT NULL,
    entity_type varchar NOT NULL,
    created_at timestamptz NOT NULL default now(),
	FOREIGN KEY (user_id) REFERENCES users(id),
	UNIQUE (user_id, entity_id)
)

INSERT INTO users (id, email, login, password, is_confirmed, created_at)
VALUES
  ('422fe805-8fe5-4113-9f3e-f6df28fa9e6f', 'email2p@gg.om', 'loSer', 'hashed_password1', true, '2025-01-10T16:41:53.422Z'),
  ('d26bf0cd-1cb3-441b-945d-1c07b6833391', 'emai@gg.com', 'log01', 'hashed_password2', true, '2025-01-10T16:41:52.617Z'),
  ('f6bd843f-0669-43f1-90b1-9e5fc19b83a6', 'email2p@g.com', 'log02', 'hashed_password3', true, '2025-01-10T16:41:53.020Z'),
  ('5c37c72d-836d-46af-8ea7-dee59ab9ea94', 'emarrr1@gg.com', 'uer15', 'hashed_password4', true, '2025-01-10T16:41:53.825Z'),
  ('cbe869e6-838c-407d-a4b7-0b1ff1aef133', 'email1p@gg.cm', 'user01', 'hashed_password5', true, '2025-01-10T16:41:50.528Z'),
  ('7867a7dd-024f-4a9b-9cd2-3a3c6e7551ee', 'email1p@gg.com', 'user02', 'hashed_password6', true, '2025-01-10T16:41:50.928Z'),
  ('9065e55f-6671-478b-9597-e92f0415e3d8', 'email1p@gg.cou', 'user03', 'hashed_password7', true, '2025-01-10T16:41:51.729Z'),
  ('8a36be8c-c928-4ad5-b7a9-20de46060121', 'email1p@gg.coi', 'user05', 'hashed_password8', true, '2025-01-10T16:41:51.327Z'),
  ('03debede-4e45-4cd0-bfb7-781c1dbb1cdd', 'email3@gg.com', 'usr-1-01', 'hashed_password9', true, '2025-01-10T16:41:54.224Z');