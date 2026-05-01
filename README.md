# Court Reporting Apps

A monorepo containing the frontend (Next.js) and backend (Express + Prisma) for the court reporting application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Start the database](#1-start-the-database)
  - [2. Configure environment variables](#2-configure-environment-variables)
  - [3. Install dependencies](#3-install-dependencies)
  - [4. Run database migrations and seed](#4-run-database-migrations-and-seed)
- [Running the project](#running-the-project)
- [Other commands](#other-commands)
- [Visual Walkthrough](OUTPUT.md)

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v11+
- [Docker](https://www.docker.com/) (for the local database)

## Setup

### 1. Start the database

```bash
docker compose -f local.yaml up -d
```

This starts a PostgreSQL instance on port `5432` and pgAdmin on port `5050`.

### 2. Configure environment variables

```bash
cp .env.example .env
```

The default `.env` works with the Docker setup out of the box:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/court_reporting?schema=public"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run database migrations and seed

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
```

## Running the project

```bash
npm run dev
```

This starts both the frontend and backend concurrently via Turborepo:

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8000 |
| pgAdmin  | http://localhost:5050 |

## Other commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `npm run build`          | Build all packages                             |
| `npm run start`          | Start all packages in production mode          |
| `npm run lint`           | Lint all packages                              |
| `npm run db:studio`      | Open Prisma Studio (database GUI)              |
| `npm run db:migrate`     | Run pending migrations (dev)                   |
| `npm run db:generate`    | Generate Prisma client from schema             |
| `npm run db:migrate:deploy` | Deploy migrations (production)              |
| `npm run db:reset`       | Reset the database and re-run all migrations   |
| `npm run db:seed`        | Seed the database with initial data            |
