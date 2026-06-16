# KalaiArangam — UI/UX Design System

Version: 1.0 | Stack: Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript

---

## 1. Requirement Analysis

### User Roles & Access Summary

| Role | Portal | Key Capabilities |
|---|---|---|
| Super Admin | `/admin/*` | Tenant management, subscriptions, platform analytics |
| Business Owner | `/dashboard/*` | Full tenant access, billing, all modules |
| Branch Manager | `/dashboard/*` | Branch-scoped operations, staff, reports |
| Staff / Trainer | `/dashboard/*` | Day-to-day ops, classes, attendance |
| Student | `/portal/student/*` | Attendance, fees, certificates, schedule |
| Client | `/portal/client/*` | Bookings, invoices, quotations (read-only) |

### Feature → Screen Mapping

| Feature Area | Screens |
|---|---|
| Auth | Login, Register, Forgot Password, Reset Password, Verify OTP, Onboarding |
| Dashboard | Overview (role-aware), Analytics, Activity Feed |
| Leads / CRM | Lead List, Lead Detail, Follow-up Timeline, Conversion Flow |
| Training | Batch List, Batch Detail, Student List, Student Profile, Enrollment, Fee Plan, Attendance, Progress, Certificate |
| Rental | Inventory List, Item Detail, Catalogue (public), Booking List, Booking Detail, Dispatch, Return, Damage, Quotes |
| Events | Event List, Event Detail, Proposal, Team, Tasks (Kanban), Timeline, Finance, Execution, Closure |
| Payments | Payment List, Payment Entry, Receipt, Due Tracking |
| Notifications | Notification Center, Preferences |
| User Management | User List, User Detail, Role Assignment, Invite |
| Settings | Organisation, Branding, Modules, Billing, Integrations, Security |
| Reports | Revenue, Attendance, Enrollment, Utilization, Conversion, Event Profit |
| Error Pages | 403, 404, 500, Maintenance, Offline |
| Public | Landing, Rental Catalogue, Enquiry Form |

---

## 2. Design System

### 2.1 Color Palette

#### Brand Colors
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-brand-50` | `#f0f4ff` | `#0f1a3d` | Backgrounds |
| `--color-brand-100` | `#dce6fd` | `#1a2d5a` | Subtle fills |
| `--color-brand-500` | `#3b5bdb` | `#4c6ef5` | Primary actions |
| `--color-brand-600` | `#3451c7` | `#3b5bdb` | Hover state |
| `--color-brand-700` | `#2c44b0` | `#2f4fc4` | Active/pressed |

#### Semantic Colors
| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-success-*` | `#2f9e44` / `#ebfbee` | `#40c057` / `#0d2e18` | Success states |
| `--color-warning-*` | `#e67700` / `#fff9db` | `#fcc419` / `#2e1e00` | Warning states |
| `--color-danger-*` | `#c92a2a` / `#fff5f5` | `#ff6b6b` / `#2e0909` | Error/destructive |
| `--color-info-*` | `#1971c2` / `#e7f5ff` | `#4dabf7` / `#0a1f33` | Info states |

#### Neutral Colors (Surface System)
| Token | Light | Dark |
|---|---|---|
| `--color-surface` | `#ffffff` | `#0f0f0f` |
| `--color-surface-raised` | `#f8f9fa` | `#1a1a1a` |
| `--color-surface-overlay` | `#f1f3f5` | `#242424` |
| `--color-border` | `#dee2e6` | `#2e2e2e` |
| `--color-border-subtle` | `#e9ecef` | `#1f1f1f` |
| `--color-text-primary` | `#212529` | `#f1f3f5` |
| `--color-text-secondary` | `#495057` | `#adb5bd` |
| `--color-text-disabled` | `#adb5bd` | `#495057` |
| `--color-text-placeholder` | `#ced4da` | `#495057` |

### 2.2 Typography Scale

Font Family: **Inter** (primary) + system-ui fallback

| Scale | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `display-2xl` | 4.5rem | 1.1 | 700 | Hero headings |
| `display-xl` | 3.75rem | 1.1 | 700 | Page headers |
| `display-lg` | 3rem | 1.2 | 600 | Section titles |
| `h1` | 2.25rem | 1.3 | 600 | Page title |
| `h2` | 1.875rem | 1.3 | 600 | Card/Section header |
| `h3` | 1.5rem | 1.4 | 600 | Sub-section |
| `h4` | 1.25rem | 1.4 | 600 | Widget title |
| `body-lg` | 1.125rem | 1.6 | 400 | Lead text |
| `body` | 1rem | 1.6 | 400 | Body copy |
| `body-sm` | 0.875rem | 1.5 | 400 | Secondary text |
| `caption` | 0.75rem | 1.5 | 400 | Labels, hints |
| `overline` | 0.75rem | 1 | 600 | Category labels |
| `code` | 0.875rem | 1.6 | 400 | Code snippets |

### 2.3 Spacing System

Base unit: **4px (0.25rem)**

```
0.5 → 2px    1 → 4px     1.5 → 6px   2 → 8px
3 → 12px     4 → 16px    5 → 20px    6 → 24px
8 → 32px     10 → 40px   12 → 48px   16 → 64px
20 → 80px    24 → 96px   32 → 128px
```

### 2.4 Grid & Breakpoints

| Breakpoint | Min Width | Columns | Gutter | Container |
|---|---|---|---|---|
| `xs` | 0 | 4 | 16px | 100% |
| `sm` | 640px | 8 | 16px | 100% |
| `md` | 768px | 12 | 24px | 100% |
| `lg` | 1024px | 12 | 24px | 1024px |
| `xl` | 1280px | 12 | 32px | 1280px |
| `2xl` | 1536px | 12 | 32px | 1440px |

**Layout Regions:**
- Sidebar: 240px (expanded) / 64px (collapsed) / 0px (mobile)
- Topbar height: 56px (mobile) / 60px (desktop)
- Content area: `calc(100vw - sidebar - scrollbar)`
- Max content width: 1280px

### 2.5 Elevation / Shadow System

| Level | Token | Usage |
|---|---|---|
| 0 | `none` | Flat/embedded |
| 1 | `0 1px 3px rgba(0,0,0,.08)` | Cards, inputs |
| 2 | `0 4px 12px rgba(0,0,0,.1)` | Dropdowns, popovers |
| 3 | `0 8px 24px rgba(0,0,0,.12)` | Modals, drawers |
| 4 | `0 16px 48px rgba(0,0,0,.16)` | Full-screen overlays |

### 2.6 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 2px | Badges, tags |
| `radius-sm` | 4px | Buttons, inputs |
| `radius-md` | 8px | Cards, modals |
| `radius-lg` | 12px | Large cards |
| `radius-xl` | 16px | Sheets, drawers |
| `radius-2xl` | 24px | Onboarding cards |
| `radius-full` | 9999px | Pills, avatars |

### 2.7 Motion / Animation

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `duration-fast` | 100ms | ease-out | Micro interactions |
| `duration-base` | 150ms | ease-in-out | Button states |
| `duration-slow` | 250ms | ease-in-out | Panel transitions |
| `duration-drawer` | 300ms | cubic-bezier(.32,.72,0,1) | Sidebar/Sheet open |
| `duration-modal` | 200ms | ease-out | Modal fade/scale |

### 2.8 Iconography

Library: **Lucide React** (tree-shakeable, consistent stroke width 1.5)

Sizes: 16px (inline), 20px (button), 24px (navigation), 32px (feature icons), 48px (empty states)

### 2.9 Accessibility

- All interactive elements minimum 44×44px touch target
- Color contrast ≥ 4.5:1 for text (AA), ≥ 3:1 for UI components
- Focus ring: 2px solid `--color-brand-500`, 2px offset
- All icons with semantic meaning have `aria-label` or accompanying text
- Form fields always have associated `<label>`
- Error messages linked via `aria-describedby`
- Keyboard navigation supported for all interactions
- `prefers-reduced-motion` respected for animations

---

## 3. Component Library

### 3.1 Core Primitives (`src/components/ui/`)

#### Button
Variants: `primary` | `secondary` | `outline` | `ghost` | `danger` | `link`
Sizes: `xs` | `sm` | `md` | `lg`
States: default · hover · active · disabled · loading
Props: `variant`, `size`, `loading`, `disabled`, `leftIcon`, `rightIcon`, `asChild`

#### Badge
Variants: `default` | `success` | `warning` | `danger` | `info` | `outline`
Sizes: `sm` | `md`

#### Input
States: default · focus · error · disabled · readonly
Props: `label`, `error`, `hint`, `leftAddon`, `rightAddon`, `required`

#### Textarea
Auto-resize supported. Same states as Input.

#### Select
Native + custom dropdown. Supports `placeholder`, `multiple`, `searchable`.

#### Checkbox
States: unchecked · checked · indeterminate · disabled
Props: `label`, `description`

#### Radio / RadioGroup
Stacked and inline layouts.

#### Switch (Toggle)
Sizes: `sm` | `md`

#### DatePicker
Single date, range mode. Uses `date-fns` for formatting.

#### FileUpload
Drag-and-drop zone + file list. Supports `accept`, `multiple`, `maxSize`.

---

### 3.2 Feedback Components (`src/components/ui/`)

#### Toast (via Sonner)
Types: `success` | `error` | `warning` | `info` | `loading`
Position: `bottom-right` (desktop), `top-center` (mobile)

#### Alert
Types: `success` | `error` | `warning` | `info`
Variants: `subtle` | `solid` | `outline`
Dismissible with close button.

#### Spinner
Sizes: `xs`(16) · `sm`(20) · `md`(24) · `lg`(32) · `xl`(48)
Variants: `border` | `dots`

#### Skeleton
Block, text, avatar, card presets.

#### EmptyState
Props: `icon`, `title`, `description`, `action` (CTA button)
Variants: No data · No results · No permissions · First use

#### ErrorState
Props: `code` (403/404/500), `title`, `description`, `action`

---

### 3.3 Layout Components (`src/components/layout/`)

#### AppShell
Root layout wrapper. Composes Topbar + Sidebar + main content area.
Handles sidebar collapse state (Zustand), responsive breakpoint switching.

#### Topbar
- Left: hamburger (mobile), breadcrumb (desktop)
- Right: global search, notifications bell, user avatar menu
- Height: 60px
- Sticky, `z-40`

#### Sidebar
- Width: 240px expanded / 64px collapsed
- Logo area at top
- Nav items: icon + label, active state highlight
- Module sections: Training | Rental | Events | Admin
- Footer: user avatar + settings link
- Responsive: drawer mode on mobile

#### MobileNav (Bottom Tab Bar)
Fixed bottom, 5 tabs max.
Tabs vary by role: Home · Leads · Bookings · Notifications · Menu

#### Breadcrumb
Auto-generated from route path. Truncates on mobile.

#### PageContainer
`max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8`
Optional: `title`, `subtitle`, `actions` slot, `back` button

---

### 3.4 Data Components (`src/components/ui/`)

#### Table
Props: `columns[]`, `data[]`, `loading`, `empty`, `selectable`, `sortable`
Features: Column sorting, row selection, sticky header, responsive scroll

#### Pagination
Styles: `simple` | `full`
Props: `page`, `pageSize`, `total`, `onPageChange`

#### SearchBar
Debounced input, clear button, loading state.

#### FilterBar
Renders filter chips + dropdown panel. Integrates with URL search params.

#### Card
Variants: `default` | `bordered` | `elevated`
Slots: `header`, `body`, `footer`

#### StatCard
Props: `title`, `value`, `delta`, `deltaType`, `icon`, `trend` (sparkline optional)

---

### 3.5 Modal / Overlay Components (`src/components/ui/`)

#### Modal
Sizes: `sm`(400px) | `md`(560px) | `lg`(720px) | `xl`(900px) | `full`
Props: `open`, `onClose`, `title`, `description`, `footer`
Focus trap, scroll lock, ESC to close.

#### ConfirmModal
Extends Modal. Props: `intent` (danger|warning|info), `confirmLabel`, `onConfirm`

#### BottomSheet (Mobile)
Swipe-to-dismiss. Snap points: 50% / 90% / closed.

#### Popover
Radix-style floating panel. Props: `trigger`, `content`, `placement`

#### Tooltip
Hover/focus triggered. Max-width 240px.

---

### 3.6 Notification Components (`src/components/shared/`)

#### NotificationBell
Badge counter (max 99+). Popover panel with recent 5 items + "View All" link.

#### NotificationItem
Props: `type`, `title`, `body`, `timestamp`, `read`, `action`
Types: `lead` | `payment` | `booking` | `reminder` | `system`

#### NotificationCenter (full page)
Grouped by date: Today · Yesterday · Earlier
Filter by type. Mark all read. Infinite scroll.

---

### 3.7 Forms (`src/components/ui/`)

#### FormField
Wrapper: label + control + error + hint. Integrates with react-hook-form.

#### MultiStepForm
Progress indicator (steps bar), prev/next navigation, step validation.

---

## 4. Page Inventory

### Authentication & Onboarding

| Page | Route | Role | Components | Flow |
|---|---|---|---|---|
| Login | `/login` | All | Card, Input, Button, Toast | → Dashboard or Onboarding |
| Register | `/register` | New user | MultiStepForm, Input, Button | → Onboarding |
| Forgot Password | `/forgot-password` | All | Input, Button | → OTP page |
| Reset Password | `/reset-password` | All | Input, Button | → Login |
| Verify OTP | `/verify-otp` | All | OTP input, Timer, Button | → Reset or Activate |
| Onboarding | `/onboarding` | Owner | MultiStepForm, Select, Upload | → Dashboard |

### Dashboard

| Page | Route | Role | Components | Flow |
|---|---|---|---|---|
| Overview | `/dashboard` | All (role-aware) | AppShell, StatCard×6, Charts, NotificationBell, Table | Hub |
| Super Admin Dashboard | `/admin/dashboard` | Super Admin | StatCard, Table, Charts | Tenant overview |

### Leads / CRM

| Page | Route | Role | Components |
|---|---|---|---|
| Lead List | `/dashboard/leads` | Owner, Manager, Staff | AppShell, SearchBar, FilterBar, Table, Badge, Button |
| Lead Detail | `/dashboard/leads/[id]` | Owner, Manager, Staff | AppShell, Timeline, Badge, Modal, Toast |
| Lead Kanban | `/dashboard/leads/kanban` | Owner, Manager | AppShell, KanbanBoard, Card, Badge |

### Training Module

| Page | Route | Role | Components |
|---|---|---|---|
| Batch List | `/dashboard/training/batches` | Owner, Manager, Staff | AppShell, Table, SearchBar, FilterBar, Button |
| Batch Detail | `/dashboard/training/batches/[id]` | Owner, Manager, Staff | AppShell, Tabs, Table, StatCard, Badge |
| Student List | `/dashboard/training/students` | Owner, Manager, Staff | AppShell, Table, SearchBar, FilterBar |
| Student Profile | `/dashboard/training/students/[id]` | Owner, Manager, Staff | AppShell, Tabs, Card, Badge, Timeline |
| Enrollment | `/dashboard/training/enroll` | Owner, Manager, Staff | AppShell, MultiStepForm, Select, Input |
| Fee Plans | `/dashboard/training/fees` | Owner, Manager | AppShell, Table, Card, Button |
| Attendance | `/dashboard/training/attendance` | Trainer, Staff | AppShell, AttendanceGrid, DatePicker, Button |
| Progress | `/dashboard/training/progress/[studentId]` | Trainer, Staff | AppShell, ProgressBar, Card, Textarea |
| Certificates | `/dashboard/training/certificates` | Owner, Manager | AppShell, Table, Button, Modal |

### Rental Module

| Page | Route | Role | Components |
|---|---|---|---|
| Inventory | `/dashboard/rental/inventory` | Owner, Manager, Staff | AppShell, Table, FilterBar, Badge, Button |
| Item Detail | `/dashboard/rental/inventory/[id]` | Owner, Manager, Staff | AppShell, Tabs, StatCard, Badge, Timeline |
| Booking List | `/dashboard/rental/bookings` | Owner, Manager, Staff | AppShell, Table, FilterBar, Badge |
| Booking Detail | `/dashboard/rental/bookings/[id]` | Owner, Manager, Staff | AppShell, Card, Badge, Timeline, Button |
| Dispatch | `/dashboard/rental/dispatch/[bookingId]` | Staff | AppShell, Checklist, FileUpload, Button |
| Return | `/dashboard/rental/return/[bookingId]` | Staff | AppShell, Checklist, FileUpload, Input |
| Damage | `/dashboard/rental/damage/[bookingId]` | Staff, Manager | AppShell, Form, FileUpload, StatCard |
| Quotes | `/dashboard/rental/quotes` | Owner, Manager, Staff | AppShell, Table, Button |
| Public Catalogue | `/catalogue` | Public | Navbar, SearchBar, FilterBar, Card, Button |
| Public Enquiry | `/catalogue/enquire` | Public | Card, Form, Button |

### Events Module

| Page | Route | Role | Components |
|---|---|---|---|
| Event List | `/dashboard/events` | Owner, Manager, Staff | AppShell, Table, FilterBar, Badge |
| Event Detail | `/dashboard/events/[id]` | Owner, Manager, Staff | AppShell, Tabs, StatCard, Timeline |
| Proposal | `/dashboard/events/[id]/proposal` | Owner, Manager | AppShell, Form, Card, Button |
| Task Board | `/dashboard/events/[id]/tasks` | Owner, Manager, Staff | AppShell, KanbanBoard, Modal |
| Timeline | `/dashboard/events/[id]/timeline` | Owner, Manager | AppShell, GanttView, Modal |
| Finance | `/dashboard/events/[id]/finance` | Owner, Manager | AppShell, Table, StatCard, Charts |
| Execution | `/dashboard/events/[id]/execution` | Staff | AppShell, Checklist, Badge, Toast |
| Closure | `/dashboard/events/[id]/closure` | Owner, Manager | AppShell, Form, Modal, Button |

### Payments

| Page | Route | Role | Components |
|---|---|---|---|
| Payment List | `/dashboard/payments` | Owner, Manager | AppShell, Table, FilterBar, Badge |
| Payment Entry | `/dashboard/payments/new` | Staff | AppShell, Form, Select, Input |
| Receipt | `/dashboard/payments/[id]/receipt` | All | AppShell, Card, Button (print/download) |

### Notifications

| Page | Route | Role | Components |
|---|---|---|---|
| Notification Center | `/dashboard/notifications` | All | AppShell, NotificationItem, FilterBar |
| Preferences | `/dashboard/notifications/preferences` | All | AppShell, Switch, Select, Card |

### User & Org Management

| Page | Route | Role | Components |
|---|---|---|---|
| Users List | `/dashboard/users` | Owner, Manager | AppShell, Table, Badge, Button |
| User Detail | `/dashboard/users/[id]` | Owner | AppShell, Form, Select, Badge |
| Invite User | `/dashboard/users/invite` | Owner | AppShell, Modal, Input, Select |
| Branches | `/dashboard/settings/branches` | Owner | AppShell, Table, Modal, Form |

### Settings

| Page | Route | Role | Components |
|---|---|---|---|
| Organisation | `/dashboard/settings/organisation` | Owner | AppShell, Form, FileUpload, Toast |
| Branding | `/dashboard/settings/branding` | Owner | AppShell, ColorPicker, Upload, Preview |
| Modules | `/dashboard/settings/modules` | Owner | AppShell, Card, Switch, Badge |
| Billing | `/dashboard/settings/billing` | Owner | AppShell, Card, Table, Modal |
| Integrations | `/dashboard/settings/integrations` | Owner | AppShell, Card, Switch, Modal |
| Security | `/dashboard/settings/security` | Owner | AppShell, Form, Switch, ConfirmModal |

### Reports

| Page | Route | Role | Components |
|---|---|---|---|
| Revenue | `/dashboard/reports/revenue` | Owner, Manager | AppShell, DatePicker, Charts, Table, Button(export) |
| Attendance | `/dashboard/reports/attendance` | Owner, Manager, Trainer | AppShell, DatePicker, FilterBar, Table |
| Enrollment | `/dashboard/reports/enrollment` | Owner, Manager | AppShell, Charts, Table |
| Utilization | `/dashboard/reports/utilization` | Owner, Manager | AppShell, Charts, StatCard |
| Conversion | `/dashboard/reports/conversion` | Owner, Manager | AppShell, Charts, Table |

### Super Admin

| Page | Route | Components |
|---|---|---|
| Tenant List | `/admin/tenants` | AppShell, Table, FilterBar, Badge |
| Tenant Detail | `/admin/tenants/[id]` | AppShell, Tabs, StatCard, Badge |
| Plans | `/admin/plans` | AppShell, Card, Table, Modal |
| Platform Analytics | `/admin/analytics` | AppShell, StatCard, Charts |

### Error / Static Pages

| Page | Route | Components |
|---|---|---|
| 403 Forbidden | `(error)/403` | ErrorState, Button |
| 404 Not Found | `(error)/404` | ErrorState, Button |
| 500 Server Error | `(error)/500` | ErrorState, Button |
| Maintenance | `/maintenance` | Card, Icon |
| Offline | `/offline` | Card, Icon, Button |

### Student/Client Portal

| Page | Route | Role | Components |
|---|---|---|---|
| Student Dashboard | `/portal/student` | Student | Topbar, StatCard, Card, Badge |
| My Attendance | `/portal/student/attendance` | Student | Topbar, Table, Badge |
| My Fees | `/portal/student/fees` | Student | Topbar, Card, Badge, Button |
| My Certificates | `/portal/student/certificates` | Student | Topbar, Table, Button |
| Client Portal | `/portal/client` | Client | Topbar, Card, Badge |

---

## 5. Information Architecture

```
/                     (public landing)
/catalogue            (public rental catalogue)
/login
/register
/onboarding

/dashboard
├── /                 (overview)
├── /leads            (CRM)
├── /training
│   ├── /batches
│   ├── /students
│   ├── /attendance
│   ├── /fees
│   ├── /progress
│   └── /certificates
├── /rental
│   ├── /inventory
│   ├── /bookings
│   ├── /quotes
│   ├── /dispatch
│   └── /return
├── /events
│   ├── /[id]
│   │   ├── /proposal
│   │   ├── /tasks
│   │   ├── /timeline
│   │   ├── /finance
│   │   ├── /execution
│   │   └── /closure
├── /payments
├── /notifications
├── /users
├── /reports
└── /settings

/admin
├── /dashboard
├── /tenants
├── /plans
└── /analytics

/portal
├── /student
└── /client
```

---

## 6. Responsive Behavior

### Sidebar
- `2xl/xl/lg`: persistent, collapsible (icon-only)
- `md`: hidden by default, toggleable drawer overlay
- `sm/xs`: hidden, Bottom Tab Bar replaces navigation

### Table
- Desktop: full column display
- Tablet: hide lower-priority columns, horizontal scroll
- Mobile: card-row layout (stacked cells)

### Topbar
- Desktop: breadcrumb left, search center, actions right
- Mobile: hamburger left, app name center, bell right

### Modal
- Desktop: centered dialog
- Mobile: BottomSheet (slides from bottom)

### Forms
- Desktop: multi-column grid
- Mobile: single column, full-width inputs

---

## 7. UX Patterns

### Loading States
1. Initial page load → Skeleton placeholders (match layout)
2. Data fetch inside page → Spinner in content area
3. Action buttons → Inline loading spinner + disabled state
4. Optimistic updates → Immediate UI update, rollback on error

### Error Handling
1. Form validation → Inline field errors (react-hook-form + zod)
2. API errors → Toast notification (sonner) + inline error where applicable
3. Network failure → Toast with retry action
4. Auth expiry → Redirect to login with return URL

### Empty States
1. No data yet → Illustration + action CTA (e.g., "Add your first batch")
2. No search results → "No results for X" + clear filters
3. No permissions → 403 error state

### Success States
- Form submit → Toast success + redirect or modal close
- Payment collected → Receipt modal/page
- Certificate issued → Download prompt

---

## 8. Developer Handoff

### Folder Structure

```
src/
├── app/
│   ├── (auth)/          — Login, register, forgot, reset
│   ├── (public)/        — Landing, catalogue
│   ├── dashboard/       — Authenticated app
│   ├── admin/           — Super admin
│   ├── portal/          — Student/client portal
│   └── api/             — Route handlers
├── components/
│   ├── ui/              — Primitives (Button, Input, Modal, …)
│   ├── layout/          — AppShell, Topbar, Sidebar, MobileNav
│   └── shared/          — Domain-agnostic composites (NotificationBell, …)
├── features/
│   ├── auth/
│   ├── training/
│   ├── rental/
│   ├── events/
│   ├── billing/
│   └── tenant/
├── hooks/               — useDebounce, useMediaQuery, useOutsideClick, …
├── store/               — Zustand stores (ui, auth, notifications)
├── lib/                 — axios instance, zod schemas, utils
├── styles/              — tokens.css
└── types/               — Global TypeScript types
```

### Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Components | PascalCase | `StatCard.tsx` |
| Hooks | camelCase with `use` prefix | `useDebounce.ts` |
| Stores | camelCase with `Store` suffix | `uiStore.ts` |
| Types/Interfaces | PascalCase | `Enrollment.ts` |
| CSS tokens | kebab-case with `--` prefix | `--color-brand-500` |
| Route segments | kebab-case | `/rental-inventory` |
| API functions | camelCase verb + noun | `getStudentById` |

### Component API Conventions

```tsx
// Every component accepts className for composition
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}
```

### Design Token Usage

Always use CSS custom properties via Tailwind utilities:
```tsx
// ✅ Correct
<div className="bg-surface text-primary border-border" />

// ❌ Wrong — hardcoded colors
<div className="bg-white text-gray-900 border-gray-200" />
```

---

## 9. Dark Mode Strategy

- Implementation: `next-themes` with `class` strategy
- Root: `class="dark"` on `<html>`
- All color tokens have dark variants defined in `@media (prefers-color-scheme: dark)` AND `.dark` class
- User preference stored in localStorage via next-themes
- No flash of incorrect theme (handled by next-themes script injection)
- Component-level: never hardcode light/dark — always use semantic tokens
