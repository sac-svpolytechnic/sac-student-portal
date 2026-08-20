# CLAUDE.md — Developer Reference

Cheatsheet for commands, architecture, and coding conventions in this repository.

## Commands
* Run development server: `npm run dev`
* Run production build: `npm run build`
* Run ESLint validation: `npm run lint`

## Architecture & Code Conventions
* **Routing**: Next.js App Router. Group routes using `(auth)` and `(dashboard)`.
* **CSS & Theming**: Tailwind CSS v4 in `src/app/globals.css` with `@theme` configurations. Explicit support for 4 color presets (`midnight`, `lumina`, `emerald`, `amber`).
* **Icons**: Use `lucide-react` for standard UI navigation icons.
* **Animations**: Leverage Framer Motion with spring physics (`stiffness: 300, damping: 30`) and CSS 3D Transforms for interactive cards.
* **State Management**: React Context APIs (`AuthContext`, `ThemeContext`) persisted in `localStorage` or authenticated Supabase tokens.
* **Authentication**: Dual lookup (Roll No / Email) resolved server-side during sign-in.
* **Database & Tables**: Managed in Supabase. Check constraints: `semester` must be 1 to 6. Default admin email: `vaibhavvishwakarma0322@gmail.com`.
* **Observer Mode (TEACHER)**: Add view-only access to `/super-admin/users` and `/super-admin/audit` but block POST/PATCH request flows.
* **CSV Export**: Perform client-side spreadsheet generation in `/super-admin/audit` via standard URI encoding.
