@startuml
class message {
#id INT AUTO_INCREMENT
-sender INT REF(user.id)
-recipient INT REF(user.id)
date TIMESTAMP
content VARCHAR(255)
isRead BIT
}

class user {
#id INT AUTO_INCREMENT
-status INT REF(status.id)
nickname VARCHAR(40)
picture VARCHAR(255)
fname VARCHAR(40)
lname VARCHAR(40)
password VARCHAR(255)
image VARCHAR(255)
motd VARCHAR(255)
}

class status {
#id INT AUTO_INCREMENT
name INT
color INT
}

message "1" -- "0.._" user
status "0.._" -- "1" user
@enduml
