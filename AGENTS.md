<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Agent Codebase Guidelines

Welcome, AI Agent! Refer to these rules when contributing to the Student Activity Centre (SAC) Portal:

## 1. Directory Structure
* All route pages are located under `src/app/(dashboard)/` and `src/app/(auth)/`.
* Shared ui elements (`GlassCard`, `ThemeSwitcher`, `AnimatedPage`) are in `src/components/ui/`.
* QR and GPS calculations are located in `src/lib/qr/` and `src/lib/geo/`.

## 2. Coding Guidelines
* Keep component layouts responsive and mobile-first with CSS grid and flex overlays.
* Retain native select dropdown option styling support by maintaining the background-color overrides in `globals.css`.
* Do not introduce fake/mock interval timers in dashboard pages without checking if actual updates are required. Keep live listings cleanly waiting for database subscriptions.
* Role check: Verify `'TEACHER'` permissions appropriately. They should have read access to global dashboards but write permissions blocked.
* Use `DIPLOMA_BRANCHES` and `DIPLOMA_SEMESTERS` from `src/lib/branches.ts` for registration fields.
