# AGENTS.md

## Goal
- Integrate all backend Training Structure APIs with frontend UI and fix a 500 error on auth login

## Constraints & Preferences
- Must not modify backend unless strictly necessary
- Both frontend and backend must compile cleanly (zero TS errors)
- Frontend uses Next.js 16, React 19, Zustand, Axios, Tailwind v4

## Progress
### Done
- Audited all backend training endpoints (Trainers 11, Batches 16, Schedules 9, Waitlists 6, Documents 7, Files 5) vs frontend API service and pages
- Added missing `GET /training/files/:id/download` endpoint to backend Files controller/service
- Updated `services/training.ts`: fixed Trainer/Batch/ScheduleEvent types, fixed `assignTrainerToBatch`/`removeTrainerFromBatch` endpoint paths, fixed `updateTrainerStatus` payload, fixed `getTrainerWorkload` type, fixed `duplicateBatch` signature, added `getSchedule`, `getCalendar`, `createDocument`, `updateDocument`
- Enhanced **TrainersPage**: status toggle, restore, detail drawer with batches/schedule/workload tabs, password+specialties fields in form
- Enhanced **BatchesPage**: status dropdown, restore, detail modal with students/trainers/schedules/attendance/progress/waitlist/capacity tabs, assign-trainer modal, duplicate naming prompt
- Enhanced **SchedulesPage**: Today/Upcoming tabbed sections, reschedule modal, calendar view with event details
- Enhanced **WaitlistsPage**: Add-to-waitlist form modal, entry detail view
- Enhanced **DocumentsPage**: archive confirmation modal, restore functionality
- Enhanced **FilesPage**: archive confirmation modal, restore functionality
- Fixed login 500: moved `ThrottlerModule.forRoot()` from AuthModule to AppModule, removed duplicate `AuditService` from AuthModule providers (already global from SecurityModule), fixed PrismaService to use validated `env.DATABASE_URL` instead of raw `process.env.DATABASE_URL!`
- Created **Courses backend module**: `GET|POST /training/courses`, `GET /training/courses/stats`, `GET|PATCH /training/courses/:id`, `POST /training/courses/:id/archive|restore`
- Fixed frontend `buildQuery` to only send `sortDir` when `sortBy` is present (was sending `sortDir=asc` without `sortBy`, causing 400 because backend `forbidNonWhitelisted: true` rejects unknown params)
- Changed initial `sortDir` state from `"asc"` to `""` on trainers-page, batches-page, programs-page to prevent empty sort param
- Fixed `setTotal` to use `res.meta?.total` instead of `res.data?.length` (was always showing page 1 as total)
- Added `meta` field to `ApiResponse<T>` type in `frontend/src/services/types.ts`
- Relaxed `sortDir` type from `"asc" | "desc"` to `string` in Table component and `PaginationQuery`
- Fixed create course 400: removed `categoryId` (not in DTO), changed `duration` from string to number input with zod preprocess, fixed `handleSubmit` referencing undefined `payload` variable
- Fixed batch create 400: stripped `status` from payload (not in `CreateBatchDto`)
- Fixed batch stats 404: changed `/training/batches/stats` to `/training/batches/statistics` (mismatch with backend route)
- Added `sortBy`/`sortDir` to `QueryCourseDto` and service `findAll` (prevented GET 400 on sort)
- Added `BatchTrainer` type and trainers tab to batch detail modal (view assigned trainers per batch)
- Committed all changes as 7 meaningful commits
- Both frontend and backend compile with zero TypeScript errors
- Synced database schema via `prisma db push` — added `loginMethod`, `accessToken`, `refreshToken` columns that existed in `schema.prisma` but were missing from the actual database

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Moved `ThrottlerModule.forRoot()` to root `AppModule` because `@nestjs/throttler` v6 throws "already configured" when called in a feature module
- Removed `AuditService` from AuthModule providers because `SecurityModule` is `@Global()` and already exports it — duplicate provider caused two separate instances
- Fixed `PrismaService` to read `env.DATABASE_URL` (validated via Zod) instead of `process.env.DATABASE_URL!` to avoid silent `undefined` crashes
- Created courses backend module because it was entirely missing despite frontend depending on it

## Next Steps
- Test the remaining training APIs end-to-end through the frontend

## Critical Context
- Login was returning 500 with no error message — root cause was `ThrottlerModule.forRoot()` called inside a feature module
- Frontend `assignTrainerToBatch` was calling `POST /training/trainers/assign` but backend expects `POST /training/batches/:id/assign-trainer`
- Backend `CreateTrainerDto` requires `password` field; frontend create form now includes it
- Backend `UpdateTrainerStatusDto` uses `{ isActive: boolean }` not `{ status: string }`
- Backend `ValidationPipe` uses `forbidNonWhitelisted: true` — any query param not in DTO causes 400
- Frontend was sending `sortDir=asc` even when no sort was applied, causing 400 on every list load
- Courses (programs) module was missing entirely from backend until just now
- `prisma db push` was required to sync the database schema — columns added to `schema.prisma` directly (not via part files) were never migrated
- Frontend `getBatchStats` was calling `/training/batches/stats` but backend has `/training/batches/statistics` (silently broke `fetchMeta`)
- `CreateBatchDto` has no `status` field; frontend was sending it via form spread (400)
- `CreateCourseDto` has no `categoryId`; frontend was sending it via form spread (400)
- `Course.duration` is `Int?` in Prisma but frontend typed it as `string | null`
- `QueryCourseDto` had no `sortBy`/`sortDir`, would cause 400 on column sort
- All changes made on branch `feat/training-structure`
- Backend runs on port 4000, start with `npm run start:dev` from `backend/`

## Relevant Files
- `frontend/src/services/training.ts`: full training API service layer with fixes (buildQuery, types, endpoints)
- `frontend/src/services/types.ts`: added `meta` to `ApiResponse<T>`
- `frontend/src/components/ui/Table.tsx`: relaxed `sortDir` type to string
- `frontend/src/features/training/pages/*.tsx`: all 7 training pages enhanced
- `backend/src/app/v1/training/courses/`: new Courses module (controller, service, dto, module)
- `backend/src/app/v1/training/training.module.ts`: added CoursesModule import
- `backend/src/app/v1/training/files/files.controller.ts` + `files.service.ts`: added `GET :id/download`
- `backend/src/app.module.ts`: added `ThrottlerModule.forRoot()`
- `backend/src/app/v1/auth/auth.module.ts`: removed `ThrottlerModule.forRoot()` and duplicate `AuditService`
- `backend/src/database/prisma.service.ts`: use `env.DATABASE_URL` from validated config
