# Dix-cordes
Dix-Cordes is my personal project, a communication platform inspired by Discord. It includes live chat and peer-to-peer live calls, and is built using Vue.js 3, PeerJS, Socket.IO, and PostgreSQL for the backend.
The goal of this project is to create a fast and efficient live chat experience that can be hosted locally.
Dix-Cordes strives to deliver users a seamless communication experience by integrating the benefits of real-time messaging and voice communication.

Check out the live demo [here](https://dixcordes.julianoouvrard.com/). Please note that the demo is reset every 24 hours.

## Features
- **Live Chat:** Engage in real-time conversations
- **Secure Communication:** Messages are securely stored using AES encryption
- **Enhanced Security:** A floating keyboard emerges when sending a message to prevent keylogger threats
- **Live Call (Peer-to-Peer):** Direct video communication with others through peer-to-peer live calls
- **Global Accessibility:** Dix-cordes features English and partially supports French, German, Spanish, Japanese, and Chinese

# You're on the "server" branch

This indicates that the current branch exclusively consists of backend code, and the client portion is not included here. Please switch to the "client" branch to access the client-related code.

## Getting Started
1. Clone the repository to your local machine:

```bash
git clone https://github.com/Zulivan/dix-cordes.git
```

2. Build and run the Docker containers:

```bash
docker-compose up --build
```

This command will build the app and start the containers for the Express.js servers (socketio and peerjs) and a PostgreSQL database server. 

3. Access the app at [http://localhost:9000]() .

- Pay attention to the environment variables such as `TOKEN_SECRET`, `DATABASE_URL`, and `AES_KEY`
