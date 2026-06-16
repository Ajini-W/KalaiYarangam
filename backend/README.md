# KalaiArangam Backend

NestJS API for the KalaiArangam multi-tenant ERP platform. Structure mirrors the frontend: feature modules live under `src/app/`.

## Stack

- NestJS 11
- Prisma + PostgreSQL
- JWT auth
- Swagger at `/docs`

## Getting started

```bash
cd backend
cp .env.example .env
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm start:dev
```

API base URL: `http://localhost:4000/api/v1`

## Project layout

```
src/
  main.ts              # Bootstrap
  app.module.ts        # Root module
  config/              # Env validation
  common/              # Guards, filters, pipes
  database/            # Prisma service
  app/
    health/            # Health check
    v1/                # Versioned API routes
      auth/
      leads/
      events/
      training/
      rental/
```

## Key endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/register` | Register tenant + owner |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Current user |
| GET/POST | `/api/v1/leads` | CRM leads |
| GET/POST | `/api/v1/events` | Events |
| GET/POST | `/api/v1/training/batches` | Training batches |
| GET/POST | `/api/v1/training/students` | Students |
| GET/POST | `/api/v1/rental/inventory` | Rental inventory |
| GET/POST | `/api/v1/rental/bookings` | Rental bookings |
