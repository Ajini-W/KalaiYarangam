# PVD Product Vision Document

### Product Name

**KalaiArangam**

### Product Category

Multi-Tenant SaaS ERP Platform for Training Institutes, Rental Businesses, and Event Management Companies.

---

# 1. Product Vision

KalaiArangam is a cloud-based business management platform designed specifically for training academies, rental businesses, and event management organizations. The platform provides an integrated ecosystem that enables organizations to manage enquiries, customers, operations, scheduling, inventory, finances, communication, and reporting from a single system.

The vision is to become the leading vertical SaaS platform for the performing arts, education, rental, and event industries by offering industry-specific workflows rather than generic business software.

KalaiArangam empowers business owners to digitize operations, improve customer engagement, streamline team collaboration, and make data-driven decisions while reducing administrative overhead.

---

# 2. Mission Statement

To provide affordable, scalable, and industry-focused business management software that helps small and medium-sized organizations operate with the efficiency of enterprise systems.

---

# 3. Target Industries

## Training & Coaching Businesses

- Dance Academies
- Bharatanatyam Schools
- Music Academies
- Swimming Classes
- Martial Arts Centers
- Karate Academies
- Silambam Training Centers
- Yoga Studios
- Zumba Centers
- Spoken English Institutes
- Tuition Centers
- Coding Academies
- Robotics Training Centers
- Computer Training Institutes
- Chess Academies
- Drawing & Painting Schools
- Photography Institutes
- Driving Schools
- Tailoring & Fashion Training Institutes
- Beautician Training Centers

---

## Rental Businesses

- Costume Rental Shops
- Stage Rental Providers
- Shamiana Rental Businesses
- Chair & Table Rental Services
- Sound & Lighting Rental Companies
- Generator Rental Providers
- LED Wall Rental Companies
- Camera Rental Services
- Drone Rental Services
- Furniture Rental Businesses
- Wedding Decoration Rental Providers
- Bridal Jewellery Rental Stores
- Wedding Vehicle Rental Companies

---

## Event & Wedding Businesses

- Event Production Companies
- Wedding Planners
- Corporate Event Organizers
- Birthday Event Organizers
- Photography & Videography Companies
- Catering Services
- DJ & Orchestra Services
- Stage Decoration Companies
- Live Streaming Providers
- Celebrity Management Agencies
- Bridal Services
- Event Logistics Providers

---

# 4. Core Product Pillars

### Industry-Focused Workflows

Each business type receives purpose-built workflows instead of generic CRM functionality.

### Multi-Tenant SaaS Architecture

Each business operates in an isolated environment while sharing the same platform infrastructure.

### Modular Subscription Model

Businesses subscribe only to the modules they require.

### Self-Service Onboarding

Business owners can create an account, configure their organization, and start using the platform immediately without technical assistance.

### Mobile-First Operations

All operational activities should be executable from mobile devices.

### Automation-Driven Management

Automated reminders, notifications, billing alerts, attendance tracking, and operational workflows reduce manual effort.

---

# 5. Core User Roles

## Platform Roles

### Super Admin

Responsible for platform governance, subscriptions, tenant management, billing, feature controls, and analytics.

### Business Owner

Owns a tenant organization and has complete access to all purchased modules.

### Branch Manager

Manages branch-specific operations for organizations operating multiple locations.

### Staff / Team Member

Performs day-to-day operational activities based on assigned permissions.

### Trainer / Instructor

Handles classes, attendance, assessments, and student management.

### Client / Customer

Views bookings, invoices, contracts, schedules, and communication.

### Student

Accesses classes, attendance records, fee details, certificates, and progress reports.

---

# 6. Product Modules

## Module 1 - Class & Training Management

Purpose:

Manage the complete lifecycle of students from enquiry to certification.

Core Features:

- Enquiry Management
- Lead Pipeline Management
- Follow-up Tracking
- Batch Creation
- Class Scheduling
- Student Registration
- Enrollment Management
- Fee Structure Management
- Payment Collection
- Due Tracking
- Attendance Management
- Performance Tracking
- Progress Reports
- Certification Management
- Student History
- Renewal Management
- Automated Notifications
- Reporting & Analytics

---

## Module 2 - Rental Management

Purpose:

Manage inventory-based rental operations.

Core Features:

- Inventory Management
- Availability Calendar
- Rental Catalog
- Public Booking Portal
- Customer Enquiries
- Quotation Management
- Booking Management
- Rental Agreements
- Security Deposits
- Payment Collection
- Dispatch Management
- Return Processing
- Damage Assessment
- Penalty Management
- Maintenance Lifecycle
- QR/Barcode Tracking
- Rental Analytics
- Automated Notifications

---

## Module 3 - Event Management

Purpose:

Manage end-to-end event execution workflows.

Core Features:

- Lead & Enquiry Management
- Proposal Management
- Quotation Approval
- Event Planning
- Team Assignment
- Work Breakdown Structure (WBS)
- Timeline & Milestone Management
- Vendor Management
- Budget Tracking
- Task Management
- Client Approval Workflows
- Event Execution Tracking
- Final Billing
- Event Closure Reports
- Profitability Analytics
- Automated Notifications

---

# 7. Revenue Model

## Free Trial

- 15-Day Full Feature Access
- No Feature Restrictions
- Self-Service Signup

## Subscription Model

Customers subscribe to one or more modules:

### Module Pricing

- Training Management
- Rental Management
- Event Management

Each module can be purchased independently.

### Billing Cycles

| Duration  | Discount |
| --------- | -------- |
| Monthly   | 0%       |
| 6 Months  | 10%      |
| 12 Months | 20%      |

---

# 8. SaaS Business Model

### Self-Service Registration

Business owners can:

- Create organization
- Configure branding
- Select modules
- Invite team members
- Start operations immediately

### Multi-Tenant Architecture

Each organization receives:

- Isolated business data
- Dedicated users
- Independent configuration
- Module-level subscriptions

---

# Success Definition

KalaiArangam succeeds when a business owner can manage leads, operations, inventory, bookings, payments, teams, customers, and reporting from a single unified platform without requiring multiple disconnected software systems.

# PRD - Product Requirements Document

Version: 1.0

Product Type: Multi-Tenant SaaS ERP

Target Release: MVP

---

# 1. Purpose

This document defines the functional requirements, business rules, user permissions, module scope, and delivery boundaries of the KalaiArangam ERP platform.

The system enables Training Institutes, Rental Businesses, and Event Management Companies to manage their operations through a modular SaaS platform.

---

# 2. Product Scope

The platform provides:

1. Class & Training Management
2. Rental Management
3. Event Management
4. Tenant Management
5. Subscription & Billing
6. Notification System
7. Reporting & Analytics
8. User & Role Management

The platform is delivered as a multi-tenant SaaS application where each business operates independently.

---

# 3. User Roles

## Platform Roles

### Super Admin

Responsibilities:

- Manage tenants
- Manage subscriptions
- Manage plans
- Monitor system health
- View platform analytics
- Support team usage
- Configure modules

Access:

- All tenants
- All modules
- Platform configuration

---

### Business Owner

Responsibilities:

- Manage business operations
- Purchase modules
- Manage users
- Configure business settings

Access:

- Full tenant access
- Subscription management
- Financial reports

---

### Branch Manager

Responsibilities:

- Manage assigned branch
- Monitor staff
- Review branch reports

Restrictions:

- Cannot modify subscriptions
- Cannot access other branches

---

### Staff / Trainer / Instructor

Responsibilities:

- Operational activities
- Daily record management
- Manage classes
- Attendance
- Student progress

Restrictions:

- No billing access
- No tenant settings access
- Class-related access

---

### Student

Responsibilities:

- View own information

Access:

- Attendance
- Fees
- Certificates
- Notifications

---

### Client

Responsibilities:

- View bookings
- View invoices
- View quotations

Restrictions:

- Read-only access

---

# 4. Permission Model

| Feature              | Super Admin | Owner | Branch Manager | Staff / Trainer | Student | Client |
| -------------------- | ----------- | ----- | -------------- | --------------- | ------- | ------ |
| Tenant Setup         | Yes         | No    | No             | No              | No      | No     |
| User Management      | Yes         | Yes   | Limited        | No              | No      | No     |
| Class Management     | Yes         | Yes   | Yes            | Yes             | View    | No     |
| Rental Management    | Yes         | Yes   | Yes            | Yes             | No      | View   |
| Event Management     | Yes         | Yes   | Yes            | Yes             | No      | View   |
| Financial Reports    | Yes         | Yes   | Branch Only    | No              | No      | No     |
| Subscription Billing | Yes         | Yes   | No             | No              | No      | No     |
| Analytics            | Yes         | Yes   | Branch Only    | Limited         | No      | No     |

---

# 5. Module Requirements

---

# MODULE 1

# Class & Training Management

## Objective

Manage student lifecycle from enquiry to certification.

---

## Features

### Lead Management

- Lead Capture
- Lead Assignment
- Lead Status Tracking
- Follow-up Tracking
- Conversion Tracking

### Batch Management

- Batch Creation
- Schedule Management
- Capacity Management
- Waitlist Management

### Student Management

- Registration
- Enrollment
- Student Profile
- Multi-Course Tracking

### Fee Management

- Fee Plans
- Installments
- Due Tracking
- Online Payments
- Offline Payments
- Refund Processing

### Attendance

- Attendance Marking
- Attendance Reports
- Attendance Alerts

### Progress Tracking

- Trainer Notes
- Assessment Records
- Performance Tracking

### Certification

- Completion Verification
- Certificate Generation
- Certificate Download

### Communication

- WhatsApp
- Email
- SMS
- In-App Notifications

### Reports

- Revenue Reports
- Attendance Reports
- Enrollment Reports
- Conversion Reports

---

## Business Rules

1. Student must belong to at least one batch.
2. Enrollment requires active fee plan.
3. Certificate can only be issued after completion.
4. Batch capacity cannot be exceeded.
5. Attendance cannot be marked for inactive students.

---

# MODULE 2

# Rental Management

## Objective

Manage inventory rental lifecycle.

---

## Features

### Inventory

- Item Creation
- Categories
- Availability Tracking
- Asset Condition Tracking

### Catalogue

- Public Catalogue
- Search
- Availability Display

### Booking

- Enquiry
- Quotation
- Booking Confirmation
- Contract Generation

### Payment

- Advance Payment
- Full Payment
- Deposit Collection

### Rental Operations

- Dispatch
- Pickup
- Rental Tracking
- Return Processing

### Asset Inspection

- Damage Inspection
- Photo Upload
- Penalty Calculation

### Maintenance

- Repair Tracking
- Maintenance History
- Retirement Tracking

### Communication

- Booking Notifications
- Return Reminders
- Payment Reminders

### Reports

- Utilization Reports
- Revenue Reports
- Damage Reports
- Inventory Reports

---

## Business Rules

1. Item cannot be booked if unavailable.
2. Deposit required if configured.
3. Return inspection mandatory.
4. Damage penalty added automatically.
5. Booking cannot overlap existing booking.

---

# MODULE 3

# Event Management

## Objective

Manage complete event execution lifecycle.

---

## Features

### CRM

- Client Enquiries
- Lead Tracking
- Opportunity Tracking

### Event Planning

- Event Creation
- Budget Creation
- Team Assignment
- Timeline Management

### Quotations

- Proposal Creation
- Quote Approval
- Client Acceptance

### Task Management

- Work Breakdown Structure
- Task Assignment
- Milestone Tracking

### Finance

- Budget Tracking
- Actual Cost Tracking
- Profitability Analysis

### Event Execution

- Checklist Management
- Progress Updates
- Status Tracking

### Closure

- Final Billing
- Closure Report
- Client Feedback

### Reports

- Event Revenue
- Profitability
- Team Performance

---

## Business Rules

1. Event cannot start without approval.
2. Budget must be approved before execution.
3. Tasks require assigned owner.
4. Final billing required before closure.

---

# 6. SaaS Requirements

## Tenant Management

Features:

- Self Registration
- Tenant Creation
- Tenant Branding
- Module Selection
- User Invitations

Business Rules:

- Every tenant is isolated.
- Tenant data cannot be shared.
- Subscription controls module access.

---

# 7. Subscription & Billing

## Trial

- 15 Days
- Full Features
- No Restrictions

## Plans

### Monthly

No Discount

### 6 Months

10% Discount

### 12 Months

20% Discount

Business Rules:

- Expired subscription disables access.
- Trial automatically expires.
- Payment required for renewal.

---

# 8. Notification System

Channels:

- WhatsApp
- Email
- SMS
- In-App

Supported Events:

- New Lead
- Enrollment
- Fee Due
- Booking Confirmation
- Rental Return Reminder
- Event Status Update
- Certificate Issued

---

# 9. Reporting & Analytics

Available Reports:

- Revenue
- Attendance
- Lead Conversion
- Booking Utilization
- Event Profitability
- User Activity

Export Formats:

- PDF
- Excel
- CSV

---

# 10. Success Criteria

The platform is considered successful when a business owner can:

1. Capture and convert leads.
2. Manage operations from a single dashboard.
3. Collect payments digitally.
4. Track customers, students, rentals, and events.
5. Generate operational reports.
6. Operate without requiring multiple software systems.

# FBS Feature Breakdown Specification

## Modules

### Class / Training Management

**Enquiry / Lead Capture, Class / Batch Creation, Enrollment / Registration, Fee Setup, Fee Collection, Attendance Tracking, Progress Tracking, Certificate / Completion, Reports**

| Feature                  | Inputs                                                     | Outputs                                             | UI                                               | API                                       | Rules                                                  | Edge Cases                                               |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| Enquiry                  | Name, Phone, Email, Course, Source, Notes                  | Lead record + ID, status NEW                        | Lead form, list, filters, duplicate warning      | POST /leads, GET /leads, PUT /leads/{id}  | Phone required, unique, valid format                   | Duplicate lead → merge/reject                            |
| Follow-up                | Lead ID, status, notes, follow-up date                     | Updated lead + follow-up log                        | Status dropdown, timeline, scheduler             | PATCH /leads/{id}/status, POST /followups | No past follow-up date, conversion requires enrollment | Multiple follow-ups, restricted status change            |
| Class Creation           | Class name, course, trainer, schedule, capacity, branch    | Batch ID created                                    | Schedule builder, capacity view, conflict alerts | POST /batches, GET /batches               | Capacity > 0, no trainer overlap                       | Trainer inactive / schedule clash → block                |
| Enrollment               | Student/Lead ID, Batch ID, Fee plan                        | Enrollment record                                   | Lead → student → enroll flow                     | POST /enrollments                         | Batch not full, no duplicate enrollment                | Auto lead conversion, capacity overflow                  |
| Fee Plan                 | Batch/course, total fee, installments, discount, due dates | Fee plan + payment schedule                         | Installment builder, preview table               | POST /fee-plans                           | Installments sum = total, sequential due dates         | Discount > total blocked, recalculation required         |
| Fee Collection           | Enrollment ID, amount, mode, reference                     | Payment record + updated balance                    | Payment entry, receipt, balance view             | POST /payments                            | Cannot exceed balance (unless allowed)                 | Partial payment, failed transaction ignored              |
| Attendance Tracking      | Batch ID, Student ID, date, status                         | Attendance record + percentage                      | Daily grid, bulk marking                         | POST /attendance, GET /attendance         | One record per student per session                     | Backdated admin-only, duplicate ignored                  |
| Progress Tracking        | Student ID, batch ID, module status, remarks               | Progress % updated                                  | Progress bar, checklist, trainer notes           | POST /progress                            | Max 100%, trainer-only update                          | Deleted module preserved in history                      |
| Certificate / Completion | Student ID, batch ID, template, completion status          | PDF certificate                                     | Generate, preview, download                      | POST /certificates                        | Attendance threshold + full fee required               | Admin override, versioned certificate                    |
| Reports                  | Date range, branch, course, filters                        | Attendance, revenue, enrollment, conversion reports | Dashboard charts, export PDF/Excel               | GET /reports/\*                           | Date range required, max limit enforced                | Large dataset async/paginated, empty structured response |

---

### Rental Management

Item / Inventory Setup, Catalogue Listing (Public), Customer Enquiry, Booking / Reservation, Pricing / Quote Management, Payment Collection (Advance/Deposit), Dispatch / Pickup Management, Rental Tracking, Return Processing, Damage / Penalty Handling, Rental History, Reports

| Feature                              | Inputs                                                      | Outputs                                       | UI                                       | API                                      | Rules                                   | Edge Cases                                    |
| ------------------------------------ | ----------------------------------------------------------- | --------------------------------------------- | ---------------------------------------- | ---------------------------------------- | --------------------------------------- | --------------------------------------------- |
| Item / Inventory Setup               | Item name, category, SKU, quantity, condition, rental price | Inventory item record                         | Admin item form, stock list, status tags | POST /items, GET /items, PUT /items/{id} | SKU unique, quantity ≥ 0                | Negative stock blocked, inactive items hidden |
| Catalogue Listing (Public)           | Item data, filters (category, availability, price)          | Public item listing                           | Public catalog page, search, filters     | GET /catalogue                           | Only available items shown              | Out-of-stock items auto-hidden                |
| Customer Enquiry                     | Name, contact, item interest, dates                         | Enquiry record                                | Enquiry form, inquiry inbox              | POST /enquiries                          | Contact required, valid item reference  | Duplicate enquiries flagged                   |
| Booking / Reservation                | Customer ID, item ID, rental period, quantity               | Reservation record                            | Booking calendar, availability checker   | POST /bookings                           | Cannot exceed available stock           | Overlapping bookings blocked                  |
| Pricing / Quote Management           | Item, duration, quantity, discount                          | Quote estimate                                | Quote generator UI                       | POST /quotes                             | Pricing rules applied consistently      | Expired quotes invalid                        |
| Payment Collection (Advance/Deposit) | Booking ID, amount, mode, reference                         | Payment record, booking status updated        | Payment screen, receipt view             | POST /payments                           | Advance required before confirmation    | Partial payment allowed, failed tx ignored    |
| Dispatch / Pickup Management         | Booking ID, item condition, handover details                | Dispatch record                               | Dispatch checklist UI                    | POST /dispatch                           | Item must be available & paid           | Missing items block dispatch                  |
| Rental Tracking                      | Booking ID, status, due date                                | Live rental status                            | Rental dashboard, timeline view          | GET /rentals, PATCH /rentals/{id}        | Status lifecycle enforced               | Late rentals flagged automatically            |
| Return Processing                    | Booking ID, return condition, returned quantity             | Return record, stock update                   | Return check-in UI                       | POST /returns                            | Must match active booking               | Partial return allowed                        |
| Damage / Penalty Handling            | Return condition, damage notes, penalty rules               | Penalty invoice                               | Damage assessment form                   | POST /penalties                          | Damage charges mandatory if applicable  | Disputed damage flagged                       |
| Rental History                       | Customer ID / Item ID                                       | Historical rental logs                        | History timeline view                    | GET /history                             | Immutable records                       | Soft-deleted bookings retained                |
| Reports                              | Date range, item/category filters                           | Revenue, utilization, damage, booking reports | Dashboard charts, export tools           | GET /reports/\*                          | Date range required, max limit enforced | Large datasets paginated/async                |

---

### Events Management

Client Enquiry, Event Creation, Proposal / Quotation, Event Confirmation, Team Assignment, Task Management, Timeline / Scheduling, Progress Tracking, Finance Tracking (Budget vs Actual), Vendor / Resource Management, Event Execution, Closure / Billing, Reports

| Feature               | Inputs                                        | Outputs                      | UI                          | API                        | Rules                                   | Edge Cases                         |
| --------------------- | --------------------------------------------- | ---------------------------- | --------------------------- | -------------------------- | --------------------------------------- | ---------------------------------- |
| Client Enquiry        | Name, contact, event type, date, requirements | Enquiry record               | Enquiry form, inquiry inbox | POST /event-enquiries      | Contact required, valid event reference | Duplicate enquiry flagged          |
| Event Creation        | Event details, venue, date, scope             | Event record + ID            | Event builder form          | POST /events               | Mandatory date & client mapping         | Missing venue/date blocks creation |
| Proposal / Quotation  | Event scope, resources, pricing rules         | Quote document               | Quote generator UI          | POST /event-quotes         | Pricing consistency enforced            | Expired quote invalid              |
| Event Confirmation    | Quote ID, client approval                     | Confirmed event status       | Confirmation panel          | PATCH /events/{id}/confirm | Only approved quotes allowed            | Rejection resets to draft          |
| Team Assignment       | Event ID, staff list, roles                   | Assigned team structure      | Team allocation UI          | POST /event-teams          | Role must be valid                      | Over-allocation flagged            |
| Task Management       | Event ID, task list, deadlines                | Task board                   | Kanban/task tracker         | POST /event-tasks          | Task must belong to event               | Missing assignee blocked           |
| Timeline / Scheduling | Event ID, milestones, time slots              | Event timeline               | Gantt/timeline view         | POST /event-timeline       | No overlapping critical tasks           | Schedule conflict alerts           |
| Progress Tracking     | Tasks, completion status, updates             | Progress percentage          | Progress dashboard          | PATCH /event-progress      | Task completion required for progress   | Skipped tasks flagged              |
| Finance Tracking      | Budget, actual spend, category costs          | Budget vs actual report      | Finance dashboard           | POST /event-finance        | Budget limits enforced                  | Overspend alerts                   |
| Event Execution       | Checklists, real-time updates                 | Execution status log         | Live event dashboard        | PATCH /event-execution     | All critical tasks must be complete     | Emergency override allowed         |
| Closure / Billing     | Final costs, adjustments, invoices            | Final invoice + closed event | Billing screen              | POST /event-close          | All payments cleared required           | Pending dues block closure         |
| Reports               | Date range, event type, status filters        | Event analytics report       | Reports dashboard           | GET /event-reports         | Date range required                     | Large datasets paginated/async     |

### Additional Common Features (Cross-Module) - Points

- Authentication & Authorization (RBAC across all modules)
- User Management (profiles, staff, customers)
- Role-based Approval Workflows (multi-step approvals)
- Branch / Multi-location Management
- Master Data Management (centralized reference data)
- Unified Workflow / Status Engine (standard lifecycle states)
- Notification System (SMS, email, in-app alerts)
- Payment Gateway Integration (unified across modules)
- Audit Logging & Activity Tracking (immutable logs)
- Calendar & Scheduling Engine (shared timeline system)
- Data Export / Import (Excel, CSV, PDF)
- Settings & Configuration Management (system-wide controls)
