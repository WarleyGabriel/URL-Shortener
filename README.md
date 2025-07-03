# URL-Shortener

URL Shortener system

## Local Development with Docker

Prerequisites: Docker & Docker Compose installed.

In project root:

```bash
docker-compose up --build
```

This will start:

- PostgreSQL on port 5432
- PgAdmin on port 8080 (login admin@admin.com / admin)
- Backend API on port 4000
- Frontend on port 3000

## Usage

Once the services are running:

1. Open http://localhost:3000/ in your browser.
2. Enter the long URL you want to shorten in the input field.
3. Click the “Shorten” button.
4. Copy the generated short URL or click it directly to test the redirection.

## Project Overview

A simple URL shortening service built with Node.js, Express, PostgreSQL, and React.

## Tech Stack

- Backend: Node.js, Express, TypeScript, PostgreSQL
- Frontend: React, TypeScript, Create React App
- Orchestration: Docker, Docker Compose

## Environment Variables

In the `backend` folder, create a `.env` file with the following content:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
SHORTNER_PORT=4000
SHORTNER_BASE_URL=http://localhost:4000
```

### Database Initialization

If you are running PostgreSQL outside of Docker, import the schema:

```bash
psql -U $DB_USER -d $DB_NAME -f backend/scripts/init.sql
```

## Running Locally (with PostgreSQL in Docker)

1. Start PostgreSQL with Docker:

   ```bash
   docker-compose up postgres
   ```

2. Install dependencies:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. In `backend`, start the server:

   ```bash
   npm run dev
   ```

4. In `frontend`, start the app:
   ```bash
   npm start
   ```

## Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm test`

## Cleanup

Stop and remove Docker containers:

```bash
docker-compose down
```
