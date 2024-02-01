CREATE SCHEMA IF NOT EXISTS messagerie;

SET SCHEMA 'messagerie';

-- SQLINES LICENSE FOR EVALUATION USE ONLY
CREATE SEQUENCE message_seq;

CREATE TABLE IF NOT EXISTS message (
id INT DEFAULT NEXTVAL ('message_seq'),
sender INT,
recipient INT,
date TIMESTAMP(0),
content TEXT
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
socketrelay TEXT,
peerjsrelay TEXT,
password VARCHAR(255),
status VARCHAR(40),
PRIMARY KEY (id)
)  ;

ALTER TABLE message ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender) REFERENCES "user"(id);
ALTER TABLE message ADD CONSTRAINT fk_message_recipient FOREIGN KEY (recipient) REFERENCES "user"(id);

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

INSERT INTO status VALUES (nextval('status_seq'), 'online', '#00ff22');
INSERT INTO status VALUES (nextval('status_seq'), 'away', '#ffa200');
INSERT INTO status VALUES (nextval('status_seq'), 'busy', '#ff2e17');
INSERT INTO status VALUES (nextval('status_seq'), 'offline', '#000000');

-- Group chat groups
CREATE SEQUENCE group_seq;

CREATE TABLE IF NOT EXISTS group (
id INT DEFAULT NEXTVAL ('group_seq'),
owner INT,
name VARCHAR(50),
description VARCHAR(255),
PRIMARY KEY (id)
);

ALTER TABLE group ADD CONSTRAINT fk_group_owner FOREIGN KEY (owner) REFERENCES "user"(id);

CREATE SEQUENCE group_user_seq;

CREATE TABLE IF NOT EXISTS group_user (
group INT,
user INT,
PRIMARY KEY (group, user)
);

ALTER TABLE group_user ADD CONSTRAINT fk_group_user_group FOREIGN KEY (group) REFERENCES group(id);
ALTER TABLE group_user ADD CONSTRAINT fk_group_user_user FOREIGN KEY (user) REFERENCES "user"(id);

-- Servers

CREATE SEQUENCE server_seq;

CREATE TABLE IF NOT EXISTS server (
id INT DEFAULT NEXTVAL ('server_seq'),
name VARCHAR(50),
description VARCHAR(255),
owner INT,
PRIMARY KEY (id)
);

ALTER TABLE server ADD CONSTRAINT fk_server_owner FOREIGN KEY (owner) REFERENCES "user"(id);

CREATE SEQUENCE server_user_seq;

CREATE TABLE IF NOT EXISTS server_user (
server INT,
user INT,
PRIMARY KEY (server, user)
);

ALTER TABLE server_user ADD CONSTRAINT fk_server_user_server FOREIGN KEY (server) REFERENCES server(id);
ALTER TABLE server_user ADD CONSTRAINT fk_server_user_user FOREIGN KEY (user) REFERENCES "user"(id);

-- Channels

CREATE SEQUENCE channel_seq;

CREATE TABLE IF NOT EXISTS channel (
id INT DEFAULT NEXTVAL ('channel_seq'),
name VARCHAR(50),
description VARCHAR(255),
server INT,
PRIMARY KEY (id)
);

ALTER TABLE channel ADD CONSTRAINT fk_channel_server FOREIGN KEY (server) REFERENCES server(id);