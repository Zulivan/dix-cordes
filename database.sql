
CREATE TABLE IF NOT EXISTS message (
`id` INT AUTO_INCREMENT,
`sender` INT,
`recipient` INT,
`date` TIMESTAMP,
`content` VARCHAR(255),
`isRead` BIT,
PRIMARY KEY (id)
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS user (
`id` INT AUTO_INCREMENT,
`nickname` VARCHAR(40),
`fname` VARCHAR(40),
`lname` VARCHAR(40),
`password` VARCHAR(255),
`status` VARCHAR(40),
PRIMARY KEY (id)
)  ENGINE=INNODB;

ALTER TABLE message ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender) REFERENCES user(id);
ALTER TABLE message ADD CONSTRAINT fk_message_recipient FOREIGN KEY (recipient) REFERENCES user(id);

ALTER TABLE Customers ADD Email varchar(255);