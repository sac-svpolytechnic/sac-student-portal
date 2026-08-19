# SAC Student Portal — Project Brain

## Stack
| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Icons | Lucide React |
| Animation | Framer Motion 11 (spring physics) |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| QR | `qrcode` (gen) + `html5-qrcode` (scan) |
| JWT | `jose` (Edge-compatible) |
| Geo | Browser Geolocation API + Haversine |

## DB Schema (Supabase PostgreSQL)

### Enums
| Enum | Values |
|------|--------|
| `user_role` | `SUPER_ADMIN`, `CLUB_ADMIN`, `MEMBER` |
| `club_status` | `ACTIVE`, `ARCHIVED` |
| `member_status` | `PENDING`, `ACCEPTED`, `REJECTED` |
| `club_role` | `LEAD`, `CO_LEAD`, `MEMBER` |
| `session_status` | `SCHEDULED`, `ACTIVE`, `ENDED` |

### Tables
| Table | PK | Key Columns | FK |
|-------|-----|------------|-----|
| `profiles` | `id` (uuid) | name, email, contact_number, branch, semester, roll_no, role | `id → auth.users.id` |
| `clubs` | `id` (uuid) | name, description, logo_url, branch_tags[], status, created_by | `created_by → profiles.id` |
| `club_members` | `id` (uuid) | club_id, user_id, role, status, joined_at | `club_id → clubs.id`, `user_id → profiles.id` |
| `sessions` | `id` (uuid) | club_id, title, start_time, end_time, lat, lng, geofence_radius_m, qr_secret, status | `club_id → clubs.id` |
| `attendance` | `id` (uuid) | session_id, user_id, check_in_time, check_out_time, check_in_lat, check_in_lng | `session_id → sessions.id`, `user_id → profiles.id` |
| `audit_logs` | `id` (uuid) | actor_id, action, target_type, target_id, metadata (jsonb), created_at | `actor_id → profiles.id` |

## Role Hierarchy & Access Matrix
| Route Pattern | MEMBER | CLUB_ADMIN | SUPER_ADMIN |
|--------------|--------|------------|-------------|
| `/home` | ✅ (scanner/summary) | ✅ | ✅ |
| `/explore` | ✅ | ✅ | ❌ |
| `/profile` | ✅ | ✅ | ✅ |
| `/club-admin/*` | ❌ | ✅ (own club) | ✅ (all) |
| `/super-admin/*` | ❌ | ❌ | ✅ |
| `/home/scan` | ✅ | ❌ | ❌ |

## Bottom Nav Tabs by Role
- **MEMBER**: Home (Scanner/Summary) · Explore Clubs · Profile
- **CLUB_ADMIN**: Home · Explore Clubs · Club Management · Profile
- **SUPER_ADMIN**: SAC Console · Global Clubs · User Registry · Audit Logs · Profile

## Theme Presets
| ID | Name | BG | Accent | Surface |
|----|------|----|--------|---------|
| `midnight` | Midnight Cyber | `#0a0b10` | `#8b5cf6` | `rgba(139,92,246,0.08)` |
| `lumina` | Clean Lumina | `#f8fafc` | `#2563eb` | `#ffffff` |
| `emerald` | Emerald Forest | `#0f1a1a` | `#10b981` | `rgba(16,185,129,0.08)` |
| `amber` | Sunset Amber | `#1a1510` | `#f59e0b` | `rgba(245,158,11,0.08)` |

## Route → File Map
```
(auth)/login          → src/app/(auth)/login/page.tsx
(auth)/register       → src/app/(auth)/register/page.tsx
(dashboard)/home      → src/app/(dashboard)/home/page.tsx
(dashboard)/home/scan → src/app/(dashboard)/home/scan/page.tsx
(dashboard)/explore   → src/app/(dashboard)/explore/page.tsx
(dashboard)/explore/[clubId] → src/app/(dashboard)/explore/[clubId]/page.tsx
(dashboard)/club-admin       → src/app/(dashboard)/club-admin/page.tsx
(dashboard)/club-admin/session/new → src/app/(dashboard)/club-admin/session/new/page.tsx
(dashboard)/club-admin/session/[sessionId]/broadcast → ...broadcast/page.tsx
(dashboard)/super-admin      → src/app/(dashboard)/super-admin/page.tsx
(dashboard)/super-admin/clubs → src/app/(dashboard)/super-admin/clubs/page.tsx
(dashboard)/super-admin/users → src/app/(dashboard)/super-admin/users/page.tsx
(dashboard)/super-admin/audit → src/app/(dashboard)/super-admin/audit/page.tsx
(dashboard)/profile   → src/app/(dashboard)/profile/page.tsx
```

## Component Tree
```
BottomNav → NavItem (per tab, role-filtered)
GlassCard (reusable surface)
ThemeSwitcher (4 presets)
AnimatedPage (Framer page-transition wrapper)
ClubCard (3D tilt, CSS transforms)
ClubFilters (search + tag chips)
MemberRequestCard (accept/reject)
MemberDirectory (search + role tags)
QRScanner → ScannerOverlay (HUD laser)
LiveSessionMonitor (Realtime stream)
```
