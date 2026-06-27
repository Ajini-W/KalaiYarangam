# Training Structure — API & Schema Documentation

> **Branch:** `feat/training-structure`
> **Scope:** Six new backend modules plus Prisma schema extensions for training management (waitlist, documents, files).

---

## Table of Contents

1. [Schema Changes](#1-schema-changes)
2. [Trainers Module](#2-trainers-module)
3. [Batches Module](#3-batches-module)
4. [Schedules Module](#4-schedules-module)
5. [Waitlists Module](#5-waitlists-module)
6. [Documents Module](#6-documents-module)
7. [Files Module](#7-files-module)
8. [Module Tree](#8-module-tree)
9. [Bruno Collection](#9-bruno-collection)

---

## 1. Schema Changes

### 1a. EnrollmentStatus Enum — Extended

**File:** `prisma/schema.prisma` (also `prisma/parts/01_config_enums.part`)

```prisma
enum EnrollmentStatus {
  ACTIVE
  COMPLETED
  DROPPED
  SUSPENDED
  TRANSFERRED
  WAITING      // NEW — student on waitlist
  WITHDRAWN    // NEW — student voluntarily removed from waitlist
}
```

### 1b. Enrollment Model — New Fields

**File:** `prisma/schema.prisma` (also `prisma/parts/04_student_lead_course.part`)

| Field | Type | Attributes | Purpose |
|---|---|---|---|
| `waitlistPosition` | `Int?` | `@map("waitlist_position")` | Queue position for WAITING enrollments |
| `promotedAt` | `DateTime?` | `@map("promoted_at")` | Timestamp when moved from WAITING → ACTIVE |

### 1c. TrainingDocument Model — New

**File:** `prisma/schema.prisma` (also `prisma/parts/05_batch_fee.part`)

Stores student-related documents (ID proof, medical, consent, certificates, etc.).

| Field | Type | Purpose |
|---|---|---|
| `id` | `String @id @default(uuid())` | Primary key |
| `tenantId` | `String` | Tenant scope (FK → Tenant) |
| `studentId` | `String?` | Optional FK → Student |
| `name` | `String @db.VarChar(200)` | Document display name |
| `type` | `String @db.VarChar(50)` | `ID_PROOF`, `MEDICAL`, `CONSENT`, `CERTIFICATE`, `OTHER` |
| `fileUrl` | `String @db.VarChar(500)` | URL to stored file |
| `fileSize` | `Int?` | Size in bytes |
| `mimeType` | `String?` | MIME type |
| `status` | `String @default("PENDING")` | `PENDING`, `VERIFIED`, `REJECTED`, `ARCHIVED` |
| `verifiedBy` | `String?` | Who verified (FK → User) |
| `verifiedAt` | `DateTime?` | When verified |
| `notes` | `String?` | Staff notes |
| `isArchived` | `Boolean @default(false)` | Soft-delete flag |

Relations: `tenant Tenant`, `student Student?`

### 1d. TrainingFile Model — New

**File:** `prisma/schema.prisma` (also `prisma/parts/05_batch_fee.part`)

Generic file storage for training materials.

| Field | Type | Purpose |
|---|---|---|
| `id` | `String @id @default(uuid())` | Primary key |
| `tenantId` | `String` | Tenant scope (FK → Tenant) |
| `originalName` | `String` | Original filename |
| `storagePath` | `String` | Unique name on disk |
| `mimeType` | `String` | MIME type |
| `size` | `Int` | Size in bytes |
| `category` | `String?` | Optional category label |
| `uploadedBy` | `String` | FK → User who uploaded |
| `isArchived` | `Boolean @default(false)` | Soft-delete flag |

Relation: `tenant Tenant`

### 1e. Migration

```bash
cd backend
npx prisma generate
```

---

## 2. Trainers Module

**Location:** `backend/src/app/v1/training/trainers/`

### Purpose

Manage trainer accounts (User records with `role: TRAINER`). Trainers are users scoped to a tenant with an additional `UserRoleMapping` entry. The module supports full CRUD, status toggle, archive/restore, and aggregated views of assigned batches, schedule, attendance, and workload.

### DTOs (`dto/trainers.dto.ts`)

| DTO | Fields | Purpose |
|---|---|---|
| `CreateTrainerDto` | `name`, `email`, `phone`, `password`, `specialties?`, `notes?` | Create a new trainer user |
| `UpdateTrainerDto` | `name?`, `email?`, `phone?`, `specialties?`, `notes?` | Partial update |
| `UpdateTrainerStatusDto` | `isActive: boolean` | Activate/deactivate |
| `QueryTrainerDto` | `page?`, `pageSize?`, `search?`, `status?`, `branchId?` | Paginated listing |

### Endpoints (`@Controller('training/trainers')`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create trainer (User with TRAINER role + UserRoleMapping) |
| `GET` | `/` | List trainers (paginated, filterable by search/status/branch) |
| `GET` | `/:id` | Get single trainer |
| `PATCH` | `/:id` | Update trainer fields |
| `PATCH` | `/:id/status` | Activate (`ACTIVE`) / deactivate (`INACTIVE`) |
| `POST` | `/:id/archive` | Soft-delete (status → `SUSPENDED`) |
| `POST` | `/:id/restore` | Restore (status → `ACTIVE`) |
| `GET` | `/:id/batches` | List assigned batches via `BatchTrainer` |
| `GET` | `/:id/schedule` | Upcoming `ClassSession` records |
| `GET` | `/:id/attendance` | `AttendanceSession` records marked by this trainer |
| `GET` | `/:id/workload` | Counts: `batchCount`, `upcomingSessions`, `totalStudents` |

### Key Business Logic

- **Create:** Hashes password via `bcrypt`, creates `User` with `role: TRAINER`, creates `UserRoleMapping`.
- **Trainer identification:** `User` records with `tenantId` and `role: TRAINER`.
- **Archive vs status:** archive sets `SUSPENDED`; status toggle uses `ACTIVE`/`INACTIVE`.
- All responses follow `{ message, data }` pattern; list endpoints use `paginate()`.

---

## 3. Batches Module

**Location:** `backend/src/app/v1/training/batches/`

### Purpose

Manage training batches with full CRUD, status transitions, deep-copy duplication, trainer assignment, and sub-endpoints for enrolled students, schedules, attendance, progress, waitlist, and capacity analytics. Replaces the old `findBatches`/`createBatch` methods from `TrainingService`.

### DTOs (`dto/batches.dto.ts`)

| DTO | Fields | Purpose |
|---|---|---|
| `CreateBatchDto` | `name`, `code?`, `courseId?`, `branchId?`, `capacity?`, `startDate?`, `endDate?` | Create batch |
| `UpdateBatchDto` | `name?`, `code?`, `courseId?`, `branchId?`, `capacity?`, `startDate?`, `endDate?` | Partial update |
| `UpdateBatchStatusDto` | `status: BatchStatus` | Change status (`UPCOMING`, `ACTIVE`, `COMPLETED`, `CANCELLED`) |
| `AssignTrainerDto` | `trainerId`, `isPrimary?` | Assign/update trainer assignment |
| `QueryBatchDto` | `page?`, `pageSize?`, `search?`, `status?`, `courseId?`, `branchId?` | Paginated, filterable listing |
| `DuplicateBatchDto` | `name` | New name for duplicated batch |

### Endpoints (`@Controller('training/batches')`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create batch |
| `GET` | `/` | List batches (paginated, filterable) |
| `GET` | `/statistics` | Aggregated: `total`, `statusCounts`, `totalCapacity`, `totalEnrolled`, `enrollmentRate` |
| `GET` | `/:id` | Get batch with trainers, schedules, counts |
| `PATCH` | `/:id` | Update batch fields |
| `PATCH` | `/:id/status` | Change `BatchStatus` |
| `POST` | `/:id/archive` | Soft-delete (`isActive = false`) |
| `POST` | `/:id/restore` | Restore (`isActive = true`) |
| `POST` | `/:id/duplicate` | Deep copy with schedules (excludes enrollments) |
| `POST` | `/:id/assign-trainer` | Upsert `BatchTrainer` record |
| `GET` | `/:id/students` | Enrolled students with enrollment details |
| `GET` | `/:id/schedules` | `BatchSchedule` records |
| `GET` | `/:id/attendance` | `AttendanceSession` records |
| `GET` | `/:id/progress` | `StudentProgress` records |
| `GET` | `/:id/waitlist` | WAITING enrollments (ordered by position) |
| `GET` | `/:id/capacity` | `{ capacity, enrolled, available, waitlistCount }` |

### Key Business Logic

- **Duplicate:** reads source batch + its `schedules`, creates new batch with copied fields & schedule entries. Enrollments are **not** copied.
- **Assign trainer:** uses `batchTrainer.upsert` with unique composite key `batchId_trainerId`.
- **Statistics:** aggregates all batches in tenant; calculates enrollment rate as `(totalEnrolled / totalCapacity) * 100`.
- All tenant-scoped via `user.tenantId`.

### Refactoring

Removed `findBatches` and `createBatch` from:
- `training.controller.ts` (two route handlers)
- `training.service.ts` (two methods + unused import `CreateBatchDto`)

---

## 4. Schedules Module

**Location:** `backend/src/app/v1/training/schedules/`

### Purpose

Manage class sessions (`ClassSession` model). No schema changes required. Supports CRUD, cancellation, rescheduling, and three view modes: calendar (grouped by date), upcoming, and today.

### DTOs (`dto/schedules.dto.ts`)

| DTO | Fields | Purpose |
|---|---|---|
| `CreateScheduleDto` | `batchId`, `date`, `startTime`, `endTime`, `topic?`, `notes?` | Create class session |
| `UpdateScheduleDto` | `date?`, `startTime?`, `endTime?`, `topic?`, `notes?` | Partial update |
| `RescheduleDto` | `date?`, `startTime?`, `endTime?` | Change date/time only |
| `QueryScheduleDto` | `page?`, `pageSize?`, `batchId?`, `dateFrom?`, `dateTo?`, `status?` | Paginated, filterable listing |
| `CalendarQueryDto` | `month?`, `year?`, `batchId?` | Calendar view params |

### Endpoints (`@Controller('training/schedules')`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create class session |
| `GET` | `/` | List sessions (paginated, filterable) |
| `GET` | `/calendar` | Grouped by date key (`YYYY-MM-DD`) for a given month/year |
| `GET` | `/upcoming` | Sessions where `date >= today`, not cancelled, ordered asc |
| `GET` | `/today` | Sessions matching today's date |
| `GET` | `/:id` | Get session with batch info + attendance records |
| `PATCH` | `/:id` | Update session fields |
| `POST` | `/:id/cancel` | Set status to `CANCELLED` |
| `POST` | `/:id/reschedule` | Update date/time fields |

### Key Business Logic

- **Calendar:** month defaults to current, groups into `Record<"YYYY-MM-DD", ClassSession[]>`.
- **Upcoming:** excludes `CANCELLED` sessions; limited to 50 results.
- **Tenant scope:** all queries filter through `batch.tenantId`.
- Uses `ClassSession` model directly — no schema changes.

---

## 5. Waitlists Module

**Location:** `backend/src/app/v1/training/waitlists/`

### Purpose

Manage batch waitlists using the `Enrollment` model with `status: WAITING`. Supports adding students, promoting them to active enrollment, and withdrawing. Uses the `waitlistPosition` and `promotedAt` fields added in Session 1 schema changes.

### DTOs (`dto/waitlists.dto.ts`)

| DTO | Fields | Purpose |
|---|---|---|
| `AddToWaitlistDto` | `batchId`, `studentId`, `notes?` | Add student to waitlist |
| `UpdateWaitlistDto` | `remarks?` | Update notes |
| `QueryWaitlistDto` | `page?`, `pageSize?`, `batchId?`, `studentId?` | Paginated listing |

### Endpoints (`@Controller('training/waitlists')`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create WAITING enrollment; auto-calculates `waitlistPosition = max + 1` |
| `GET` | `/` | List WAITING enrollments (filterable by batch/student) |
| `GET` | `/:id` | Get single waitlist entry |
| `PATCH` | `/:id` | Update remarks |
| `POST` | `/:id/promote` | Status → ACTIVE, set `promotedAt`, increment `Batch.enrolled`, clear position |
| `POST` | `/:id/withdraw` | Status → WITHDRAWN, clear position |

### Key Business Logic

- **Position auto-calc:** `aggregate` on existing WAITING enrollments for the batch → `_max.waitlistPosition + 1`.
- **Promote:** runs in a `$transaction` to atomically update Enrollment + increment `Batch.enrolled`.
- **Duplicate prevention:** checks `unique(studentId, batchId)` constraint — returns `BadRequestException` if already enrolled.
- Operates on the existing `Enrollment` model — no schema additions beyond Session 1.

---

## 6. Documents Module

**Location:** `backend/src/app/v1/training/documents/`

### Purpose

Manage student documents (ID proof, medical, consent, certificates, etc.) using the `TrainingDocument` model. Supports CRUD, a verify/reject workflow, and archive/restore.

### DTOs (`dto/documents.dto.ts`)

| DTO | Fields | Purpose |
|---|---|---|
| `CreateDocumentDto` | `studentId`, `name`, `type`, `fileUrl`, `fileSize?`, `mimeType?`, `notes?` | Create document record |
| `UpdateDocumentDto` | `name?`, `notes?` | Partial update |
| `VerifyDocumentDto` | `status: 'VERIFIED' | 'REJECTED'`, `notes?` | Verify or reject |
| `QueryDocumentDto` | `page?`, `pageSize?`, `studentId?`, `type?`, `status?` | Paginated, filterable listing |

### Endpoints (`@Controller('training/documents')`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create document |
| `GET` | `/` | List (filterable by student/type/status) |
| `GET` | `/:id` | Get single document |
| `PATCH` | `/:id` | Update name/notes |
| `POST` | `/:id/verify` | Set status to VERIFIED or REJECTED; records `verifiedBy` + `verifiedAt` |
| `POST` | `/:id/archive` | Soft-delete (`isArchived = true`) |
| `POST` | `/:id/restore` | Restore (`isArchived = false`) |

### Key Business Logic

- **Verify flow:** sets `verifiedBy` to `user.id`, `verifiedAt` to `new Date()`. Blocks verification if document status is `ARCHIVED`.
- **Type field:** values are `ID_PROOF`, `MEDICAL`, `CONSENT`, `CERTIFICATE`, `OTHER` (stored as free string).
- Tenant-scoped via `tenantId` on `TrainingDocument`.

---

## 7. Files Module

**Location:** `backend/src/app/v1/training/files/`

### Purpose

Manage file metadata records for training materials using the `TrainingFile` model. Actual file upload is handled by a universal upload API (object storage bucket) — **not implemented in this sprint**. This module only stores file metadata (name, type, size, category). Once the universal upload API is built, the returned URL will be mapped to the `storagePath` field.

### DTOs (`dto/files.dto.ts`)

| DTO | Fields | Purpose |
|---|---|---|
| `CreateFileDto` | `originalName`, `mimeType?`, `size?`, `category?` | Create a file metadata record |
| `QueryFileDto` | `page?`, `pageSize?`, `category?` | Paginated listing |

### Endpoints (`@Controller('training/files')`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create file metadata record (stores `originalName` as `storagePath`; URL will be mapped later via universal upload API) |
| `GET` | `/` | List file records (filterable by category) |
| `GET` | `/:id` | Get single file record |
| `POST` | `/:id/archive` | Soft-delete (`isArchived = true`) |
| `POST` | `/:id/restore` | Restore (`isArchived = false`) |

### Key Business Logic

- **No file handling:** This module only stores metadata in the database. No multipart upload, no disk I/O, no file serving.
- **Placeholder:** `storagePath` is set to `originalName` as a placeholder. Once the universal upload API is implemented, `storagePath` will hold the object storage URL returned by that API.
- Tenant-scoped — records belong to the uploading user's tenant.

---

## 8. Module Tree

```
backend/src/app/v1/training/
├── training.module.ts          # Root — imports all sub-modules
├── training.controller.ts      # Tenant, Branch, Student, Settings, Branding, Onboarding
├── training.service.ts
├── training.dto.ts
│
├── trainers/
│   ├── trainers.module.ts
│   ├── trainers.controller.ts
│   ├── trainers.service.ts
│   └── dto/trainers.dto.ts
│
├── batches/
│   ├── batches.module.ts
│   ├── batches.controller.ts
│   ├── batches.service.ts
│   └── dto/batches.dto.ts
│
├── schedules/
│   ├── schedules.module.ts
│   ├── schedules.controller.ts
│   ├── schedules.service.ts
│   └── dto/schedules.dto.ts
│
├── waitlists/
│   ├── waitlists.module.ts
│   ├── waitlists.controller.ts
│   ├── waitlists.service.ts
│   └── dto/waitlists.dto.ts
│
├── documents/
│   ├── documents.module.ts
│   ├── documents.controller.ts
│   ├── documents.service.ts
│   └── dto/documents.dto.ts
│
└── files/
    ├── files.module.ts
    ├── files.controller.ts
    ├── files.service.ts
    └── dto/files.dto.ts
```

### Module Registration Order

In `training.module.ts`:

```typescript
@Module({
  imports: [
    JwtModule.register({ ... }),
    TrainersModule,
    BatchesModule,
    SchedulesModule,
    WaitlistsModule,
    DocumentsModule,
    FilesModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService],
})
```

---

## 9. Bruno Collection

**Location:** `KA-api-doc/training/`

54 `.bru` files across 6 subfolders:

| Folder | Files | Coverage |
|---|---|---|
| `trainers/` | 11 | Create, List, Get, Update, Update Status, Archive, Restore, Batches, Schedule, Attendance, Workload |
| `batches/` | 16 | Create, List, Statistics, Get, Update, Update Status, Archive, Restore, Duplicate, Assign Trainer, Students, Schedules, Attendance, Progress, Waitlist, Capacity |
| `schedules/` | 9 | Create, List, Calendar, Upcoming, Today, Get, Update, Cancel, Reschedule |
| `waitlists/` | 6 | Add, List, Get, Update, Promote, Withdraw |
| `documents/` | 7 | Create, List, Get, Update, Verify, Archive, Restore |
| `files/` | 5 | Create, List, Get, Archive, Restore |

Each file follows the standard Bruno format:
- `meta` block with `name`, `type: http`, `seq`
- HTTP verb block with `url: {{base-url}}/training/...`, `body`, `auth: inherit`
- `headers` block with `Authorization: Bearer {{token}}`
- `body:json` or `body:multipart-form` block for requests with payloads
- `script:post-response` block to capture returned IDs as Bruno variables
- `vars:pre-request` block with placeholder UUIDs for required path params
- `settings` block with `encodeUrl: true`

---

## Commit History

```
9c511b2 docs(bruno): add training structure API collection
010f03d feat(files): implement files API
c2834ab feat(documents): implement documents API
36caad5  feat(waitlists): implement waitlists API
c226d17  feat(schedules): implement schedules API
fa379d1  feat(batches): implement batches API (refactor)
56b1282  feat(batches): add batches module structure
ef48502  feat(trainers): implement trainers API
bf8517d  feat(db): extend enrollment for waitlist, add document and file models
```
