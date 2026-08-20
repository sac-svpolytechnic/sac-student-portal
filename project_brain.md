# SAC Student Portal — System Brain

## Stack
Next.js 15 (App Router, Turbopack) · React 19 · TypeScript 5 · Tailwind CSS v4 · Framer Motion · Lucide Icons · Supabase (Postgres + Auth + RLS + Realtime) · Jose · QRCode

## DB Schema Snapshot
- `profiles`: `id` (FK auth.users), `name`, `email`, `contact_number`, `branch`, `semester` (1-6), `roll_no` (UQ), `role` (`user_role`), `roles` (TEXT[]), `avatar_url`, `created_at`, `updated_at`
- `clubs`: `id` (PK), `name` (UQ), `description`, `logo_url`, `branch_tags` (TEXT[]), `status` (`club_status`), `created_by` (FK profiles), `created_at`, `updated_at`
- `club_members`: `id` (PK), `club_id` (FK), `user_id` (FK), `role` (`club_role`), `status` (`member_status`), `joined_at`, `created_at` — UQ(`club_id`, `user_id`)
- `sessions`: `id` (PK), `club_id` (FK), `title`, `description`, `start_time`, `end_time`, `lat`, `lng`, `geofence_radius_m` (DEF 100), `qr_secret`, `status` (`session_status`), `created_by` (FK), `created_at`
- `attendance`: `id` (PK), `session_id` (FK), `user_id` (FK), `check_in_time`, `check_out_time`, `check_in_lat`, `check_in_lng`, `created_at` — UQ(`session_id`, `user_id`)
- `audit_logs`: `id` (PK), `actor_id` (FK profiles), `action`, `target_type`, `target_id`, `metadata` (JSONB), `created_at`

## Enums
`user_role`: `SUPER_ADMIN` | `TEACHER` | `CLUB_ADMIN` | `MEMBER`
`club_status`: `ACTIVE` | `ARCHIVED`
`member_status`: `PENDING` | `ACCEPTED` | `REJECTED`
`club_role`: `LEAD` | `CO_LEAD` | `MEMBER`
`session_status`: `SCHEDULED` | `ACTIVE` | `ENDED`

## SVPC Diploma Curriculum & Accounts
- **Branches (12)**: `Information Technology (IT)`, `Computer Science (CS)`, `Civil Engineering`, `Mechanical Engineering`, `Electrical Engineering`, `Electronics Engineering`, `Production Engineering`, `FTTP`, `Pharmacy`, `MOM`, `Architecture`, `Other Diploma Branch`
- **Semesters (6)**: 1, 2, 3, 4, 5, 6
- **Super Admin Account**: `Vaibhav Vishwakarma` (`vaibhavvishwakarma0322@gmail.com` / Roll: `2024CS101`)

## Role Hierarchy & Access Matrix
| Resource | MEMBER | CLUB_ADMIN | TEACHER | SUPER_ADMIN |
|---|---|---|---|---|
| View Clubs / Profiles | ✅ Self / Active | ✅ All | ✅ All | ✅ All |
| Request Club Join / Scan QR | ✅ | ✅ | ❌ | ✅ |
| Manage Club Members / Requests | ❌ | ✅ Own Club | ❌ | ✅ All Clubs |
| Create / Broadcast Sessions | ❌ | ✅ Own Club | ❌ | ✅ All Clubs |
| System Auditing & CSV Download | ❌ | ❌ | ✅ (View-Only) | ✅ (Full control) |
| Global Governance (User Registry) | ❌ | ❌ | ✅ (View-Only) | ✅ (Full control) |

## Theming Matrix (4 Presets)
- `midnight` (Default): Obsidian `#0a0b10` + Neon Violet `#8b5cf6` (Glassmorphic)
- `lumina`: Clean Porcelain `#f8fafc` + Electric Cobalt `#2563eb` (Light Glass)
- `emerald`: Deep Forest Slate `#0f1a1a` + Mint Jade `#10b981` (Dark Glass)
- `amber`: Warm Charcoal `#1a1510` + Sunset Amber `#f59e0b` (Dark Warm Glass)

## Active Routes (24 Total)
```
(auth)/login                 → src/app/(auth)/login/page.tsx
(auth)/register              → src/app/(auth)/register/page.tsx
(dashboard)/home             → src/app/(dashboard)/home/page.tsx
(dashboard)/home/scan        → src/app/(dashboard)/home/scan/page.tsx
(dashboard)/explore          → src/app/(dashboard)/explore/page.tsx
(dashboard)/explore/[clubId] → src/app/(dashboard)/explore/[clubId]/page.tsx
(dashboard)/club-admin       → src/app/(dashboard)/club-admin/page.tsx
(dashboard)/club-admin/session/new → src/app/(dashboard)/club-admin/session/new/page.tsx
(dashboard)/club-admin/session/[sessionId]/broadcast → src/app/(dashboard)/club-admin/session/[sessionId]/broadcast/page.tsx
(dashboard)/super-admin      → src/app/(dashboard)/super-admin/page.tsx
(dashboard)/super-admin/clubs → src/app/(dashboard)/super-admin/clubs/page.tsx
(dashboard)/super-admin/users → src/app/(dashboard)/super-admin/users/page.tsx
(dashboard)/super-admin/audit → src/app/(dashboard)/super-admin/audit/page.tsx
(dashboard)/profile          → src/app/(dashboard)/profile/page.tsx
api/admin/audit              → src/app/api/admin/audit/route.ts
api/admin/clubs              → src/app/api/admin/clubs/route.ts
api/admin/users              → src/app/api/admin/users/route.ts
api/clubs                    → src/app/api/clubs/route.ts
api/memberships              → src/app/api/memberships/route.ts
api/sessions                 → src/app/api/sessions/route.ts
api/sessions/[sessionId]/qr  → src/app/api/sessions/[sessionId]/qr/route.ts
api/attendance/check-in      → src/app/api/attendance/check-in/route.ts
api/attendance/check-out     → src/app/api/attendance/check-out/route.ts
```

## Component Tree
```
BottomNav → NavItem (per tab, role-filtered with spring physics)
GlassCard (reusable glassmorphism surface with optional style/hover)
ThemeSwitcher (grid card select layout with interactive mock dashboard previews)
AnimatedPage (Framer Motion page transition wrapper)
ClubCard (3D tilt, CSS transforms, ambient radial glow)
ClubFilters (search + animated branch filter chips)
MemberRequestCard (applicant academic info + one-click accept/reject)
MemberDirectory (searchable roster with role badges & attendance metrics)
ScannerOverlay (HUD laser beam, targeting reticle & crosshairs)
QRScanner (camera stream, fallback simulation & haptic feedback)
useGeofenceWatcher (background GPS monitoring with automatic check-out)
```
