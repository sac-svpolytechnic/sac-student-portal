# SAC Student Portal 🎓

A comprehensive, state-of-the-art Student Activity Centre (SAC) Club & Attendance Management Application. Built with **Next.js 15 (App Router)**, **TypeScript 5**, **Tailwind CSS v4**, **Framer Motion**, and **Supabase**.

---

## 🚀 Key Features

### 1. Dual Authentication & Role-Based Access Control (RBAC)
* Log in using **Roll Number** OR **Email** + **Password**.
* Four system-wide roles:
  1. **SUPER_ADMIN**: Full system control (Clubs, Users, Security Auditing, CSV download).
  2. **TEACHER**: Viewer/Observer. Can view all statistics, student registry, and security logs; download reports; cannot edit database entries or join clubs.
  3. **CLUB_ADMIN**: Manage club requests, view member rosters, create sessions, and broadcast QR codes.
  4. **MEMBER**: Standard student accounts. Explore clubs, submit join requests, and scan attendance QR codes.
* **Multiple Role Support**: Users with a global `SUPER_ADMIN` system permission can also hold club-specific roles (e.g. `LEAD` or `CO_LEAD` inside specific clubs) to manage club rosters.

### 2. Club Discovery & Management Console
* Premium **3D Hover Tilt Cards** using CSS 3D Transforms and Framer Motion spring physics.
* Search and filter clubs by branch (12 SVPC branches) or status.
* Member directory, role management, and join request approval flow.

### 3. Dynamic Rotating QR & Geofenced Attendance Engine
* **Rotating QR Broadcaster**: Refreshes a signed single-use JWT payload every 15s to prevent screenshot proxy sharing. Includes anti-screenshot watermarks and circular count-down.
* **HUD Viewfinder Scanner**: Integrated camera viewfinder stream with HUD laser line animation and haptic vibration feedback.
* **Geofence Check**: Verified server-side via **Haversine formula** (validates student's GPS distance to session coordinates).
* **Geofence Watcher Hook**: Continuously monitors location in the background and auto-records checkout upon perimeter exit.

### 4. System Governance & Audit Trail
* Full security logs viewer with action filters (`CREATE_CLUB`, `ELEVATE_ROLE`, `ACCEPT_MEMBER`, `CREATE_SESSION`, `ARCHIVE_CLUB`).
* Expandable JSON metadata inspector for deep security logging.
* **CSV Report Exporter**: One-click Excel-compatible spreadsheet generation and download.

### 5. High-End Customization & Theming
* Beautiful glassmorphic components and spring animations.
* **4-Preset Visual Theme Selector** in profile:
  * 🌌 `Midnight Cyber` (Obsidian + Neon Violet)
  * ☀️ `Clean Lumina` (Porcelain + Cobalt)
  * 🌲 `Emerald Forest` (Forest Slate + Mint Jade)
  * 🌅 `Sunset Amber` (Charcoal + Sunset Amber)

---

## 🛠️ Technology Stack
* **Framework**: Next.js 15 (App Router, Turbopack)
* **Language**: TypeScript 5
* **Styling**: Tailwind CSS v4 (`@theme`)
* **Animations**: Framer Motion
* **Database & Auth**: Supabase (PostgreSQL + Auth + RLS + Realtime)
* **Cryptographic Signatures**: Jose (short-lived JWTs)

---

## ⚙️ Setup & Configuration

### 1. Supabase Schema Migration
1. Go to your **Supabase Dashboard** ➔ **SQL Editor**.
2. Copy the content of [`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/vikas/Desktop/SAC/supabase/migrations/001_initial_schema.sql) and paste it into a new query.
3. Click **Run** to set up tables, custom types, triggers, and indices.

### 2. Supabase Auth Configuration
To allow instant signups and logins without rate limit blocks:
1. Go to **Authentication** ➔ **Providers** ➔ **Email** in Supabase.
2. Toggle **"Enable Email provider"** to **ON** 🟢.
3. Toggle **"Allow new users to sign up"** to **ON** 🟢.
4. Toggle **"Confirm email"** to **OFF** 🔴 (Disables email rate limits and link confirmations).
5. Click **Save**.

### 3. Local Environment variables (`.env.local`)
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
QR_JWT_SECRET=your_32_character_signing_key_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🏃 Running Locally
Install dependencies and launch the dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deploying to Vercel
1. Go to [Vercel](https://vercel.com) and import the repository.
2. Add the four environment variables from `.env.local` to Vercel.
3. Click **Deploy**.
4. In Supabase Dashboard, set the **Site URL** and **Redirect URLs** under **Authentication ➔ URL Configuration** to your Vercel deployment URL (e.g. `https://your-app.vercel.app/**`).
