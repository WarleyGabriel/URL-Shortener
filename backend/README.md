# Backend

Simple URL Shortener API built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v20+)
- PostgreSQL

## Environment Variables

Create a `.env` file in this directory with:

```
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=url_shortener
SHORTNER_PORT=4000
SHORTNER_BASE_URL=http://localhost:4000
```

## Database Initialization

If running PostgreSQL manually, import the schema:

```
psql -U $DB_USER -d $DB_NAME -f scripts/init.sql
```

## Installation

Install dependencies:

```
npm install
```

## Running

Start the development server:

```
npm run dev
```

## Testing

Run tests:

```
npm test
```

## Linting

Run lint:

```
npm run lint
```

## Docker

See the root `README.md` for Docker-based setup instructions.
