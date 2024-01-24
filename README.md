- # Dixcordes App

This repository contains a Docker Compose configuration to run the Dix-cordes app, which includes an Express.js server and a PostgreSQL database server.
## Prerequisites

## Getting Started

Follow these steps to set up and run the Dixcordes app: 
1. Clone the repository to your local machine:

```bash
git clone <repository-url>
``` 
2. Navigate to the project's root directory:

```bash
cd <repository-directory>
``` 
3. Create a `.env` file in the project's root directory with the following content. Update the values as needed:

```dotenv
TOKEN_SECRET=AzeRtY2d2e2f2g2h2i2j2k2l2m2n2o2p2q2r2s2t2u2v2w2x2y2z
DATABASE_URL=postgres://dixcordes_user:dixcordes_password@postgres:5432/dixcordes_db?sslmode=disable
AES_KEY=EXAMPLE4pwIvnTu5rrM69ymw42YqiZ9Egg8UpSf5wFa6m4o9SmejXhGdtpUelkyK
``` 
4. Build and run the Docker containers:

```bash
docker-compose up --build
```

This command will build the app and start the containers for the Express.js server and PostgreSQL database. 
5. Access the app at [http://localhost:9000]() .
## Important Notes 
- Make sure to customize the values in the `.env` file according to your preferences. 
- Pay attention to the environment variables such as `TOKEN_SECRET`, `DATABASE_URL`, and `AES_KEY` in the `.env` file.
## Stopping the Application
