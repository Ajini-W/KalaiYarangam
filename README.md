# Kalai Arangam

Welcome to the **Kalai Arangam** repository. This project consists of a Next.js frontend and a NestJS backend.

---

## Repository Structure

```text
kalai_arangam/
├── frontend/   # Next.js Application
└── backend/    # NestJS Application
```

---

## Frontend Setup

The frontend is built using **Next.js** and **TailwindCSS**.

### 1. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the `frontend` root directory:
```bash
cp .env.example .env
```

#### Example `.env` Configuration:
```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend API URL (NestJS API prefix)
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Database Connection (if directly accessed by frontend/middleware)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kalai_arangam?schema=public

# Secrets and Cache
JWT_SECRET=change-me-to-a-secret-with-at-least-32-characters
REDIS_URL=redis://localhost:6379

```

### 3. Run the Development Server
```bash
pnpm dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
To build the Next.js application:
```bash
pnpm build
```
To run the production server locally:
```bash
pnpm start
```

--- 

## Backend Setup

The backend is built with **NestJS**, using **Prisma** as the ORM.

### 1. Installation
Navigate to the backend directory and install dependencies:
```bash
cd backend
pnpm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` root directory:
```bash
cp .env.example .env
```

Ensure your `.env` is configured with the correct database connection:
```env
NODE_ENV=development
PORT=4000
APP_URL=http://localhost:3000
API_PREFIX=api/v1

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kalai_arangam?schema=public
JWT_SECRET=change-me-to-a-secret-with-at-least-32-characters
JWT_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

### 3. Prisma Client & Database Setup
Generate the Prisma Client and run database updates:
```bash
# Generate the Prisma Client
pnpm db:generate

# Push schema changes to the database
pnpm db:push

# Or run Prisma migrations
pnpm db:migrate
```

### 4. Run the Development Server
```bash
pnpm start:dev
```
The server will start on port `4000` (e.g. API base at [http://localhost:4000/api/v1](http://localhost:4000/api/v1)).

### 5. Build for Production
To compile the NestJS application:
```bash
pnpm build
```
To run the compiled production build:
```bash
pnpm start:prod
```
