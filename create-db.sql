CREATE SCHEMA IF NOT EXISTS messagerie;

SET SCHEMA 'messagerie';

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE SEQUENCE message_seq;

CREATE TABLE IF NOT EXISTS message (
id INT DEFAULT NEXTVAL ('message_seq'),
sender INT,
recipient INT,
date TIMESTAMP(0),
content VARCHAR(255),
isRead BOOLEAN,
PRIMARY KEY (id)
)  ;

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE SEQUENCE user_seq;

CREATE TABLE IF NOT EXISTS "user" (
id INT DEFAULT NEXTVAL ('user_seq'),
nickname VARCHAR(40),
fname VARCHAR(40),
lname VARCHAR(40),
image VARCHAR(255),
motd VARCHAR(255),
password VARCHAR(255),
status VARCHAR(40),
PRIMARY KEY (id)
)  ;

ALTER TABLE message ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender) REFERENCES "user"(id);
ALTER TABLE message ADD CONSTRAINT fk_message_recipient FOREIGN KEY (recipient) REFERENCES "user"(id);

-- status
set schema 'messagerie';

CREATE SEQUENCE status_seq;

CREATE TABLE IF NOT EXISTS status (
id INT DEFAULT NEXTVAL ('status_seq'),
name VARCHAR(40),
color VARCHAR(40),
PRIMARY KEY (id)
);

UPDATE messagerie.user SET status = NULL;

ALTER TABLE messagerie.user ALTER COLUMN status TYPE INT USING status::integer;
ALTER TABLE messagerie.user ADD CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES status(id);

INSERT INTO status VALUES (nextval('status_seq'), 'En ligne', '#00ff22');
INSERT INTO status VALUES (nextval('status_seq'), 'Absent', '#ffa200');
INSERT INTO status VALUES (nextval('status_seq'), 'Ne pas déranger', '#ff2e17');
INSERT INTO status VALUES (nextval('status_seq'), 'Hors-ligne', '#000000');