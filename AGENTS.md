# AGENTS.md

Top-of-mind context for AI agents working in `postgres-prisma` - the **Астрология_Инь**
website (astrology consultations, bonuses and referrals, Russian UI). Live site:
https://astrology-yin.vercel.app/. Solo project, deployed on Vercel from `main`.

Detailed conventions live in `.cursor/rules/*.mdc` (loaded by file type) and the
workflow skills in `.cursor/skills/`. Enter feature work through the **`develop-feature`**
skill. The live code is the ground truth for code shape - copy the nearest existing
feature before inventing anything.

`.cursor/` is the single source of truth; `.claude/` only mirrors it for Claude Code
(`.claude/skills/*` and `.claude/rules/*.md` are relative symlinks into `.cursor/`, plus
the `PreToolUse` adapter for `bin/git-guard` in `.claude/settings.json`). Edit the
`.cursor/` files, never the links.

# Stack

Next.js 15 (App Router, `app/` at the repo root - no `src/`) · React 18 · TypeScript (strict)
· Prisma 6 + Postgres (Vercel Postgres) · Redux Toolkit + RTK Query · Tailwind CSS 3 (+ 3
small CSS/SCSS modules) · react-hook-form · react-modal · react-toastify ·
react-loading-skeleton · `@react-spring/web` (reset-password only) · nodemailer · `jose` JWT
in an httpOnly cookie + `bcrypt` · `@vercel/analytics` + `@vercel/speed-insights`.

Not in this repo (do not assume them): Sentry, Clerk, Statsig, TanStack Query, Zustand,
React Aria, CSS Modules design system, Storybook, Vitest, Linear, a `dev` branch, Docker.

# Repository map

- `app/` - routes. Pages/layouts are thin; most UI is client components.
  - `app/_components/common/` shared primitives (`Button`, `Link`, `Paragraph`, `Form`, `Icon`, `input/*`)
  - `app/_components/Modal/`, `app/_components/Toast/`, `app/_components/main-layout/` (header, nav, `Wrapper` app shell)
  - `app/<route>/components/` route-local components (`consultation`, `account/*`, `article`, `admin`)
  - `app/api/**/route.ts` Route Handlers - the only backend entry points
  - `app/constants/` (`constants.ts`, `validation.ts`, `messages.json`, `brand.tsx`, `socialConnections.ts`)
- `server/` - backend: `services/*` (named async functions), `dtos/*`, `helpers/` (token, env, email template), `middlewares/auth.ts`, `error/ApiError.ts`
- `store/` - Redux store, slices (`userSlice`, `authentication`, `app`) and RTK Query (`features/api/appApi.ts` + `subApi/*`)
- `lib/prisma.ts` - the Prisma client singleton
- `models/` - request/response TS types that extend Prisma types
- `utils/` - helpers **and hooks** (`css.ts` `cn()`, `formatting.ts`, `validation.ts`, `authorization.ts`, `useAppRouter.ts`, `useWindowDimensions.ts`, `errorHandler.ts`)
- `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/enumAdapter.ts`
- `scripts/backup-db.sh` - `pg_dump` snapshots into the gitignored `backups/`
- `middleware.ts` - only guards `GET /api/users/:id`; page gating is client-side (`useAuthorizedRoute`, `useAdminRoute`)

# Commands

- `npm run dev` - `prisma generate && next dev` (needs the Postgres env vars)
- `npm run lint` · `npm run typecheck` (`tsc --noEmit`) · `npm run format` (prettier)
- `npx next build` - local production build check
- `npm run build` - **also runs `prisma db push` and `prisma db seed` against the configured database.** Never use it as a casual verify step; it is the Vercel build command.
- `npm run prisma-studio` · `prisma-db-push` · `prisma-db-pull` · `prisma-format`
- `npm run db-backup` (`--sql`, `--both` variants) - take a snapshot before any schema change

# Environment

Secrets live in `.env` / `.env.development.local` (gitignored, never commit, never print values).
Names in use: `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING` (+ other `POSTGRES_*`),
`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `VERCEL_SMTP_HOST/PORT/USER/PASSWORD`,
`VERCEL_DEFAULT_RESET_PASSWORD`, `VERCEL_ENV`, `VERCEL_URL`, `ADMIN_EMAILS` (comma-separated
emails that get the `ADMIN` role on registration; read via `isAdminEmail()` in
`server/helpers/envKeys.ts`). Only `NEXT_PUBLIC_*` names may be read in client code. Before
touching the database, check which database the env points at.

# Universal rules

- **Honesty over confidence.** Say what you ran and what it printed. Never report a check
  as passing that you did not watch pass. "Done" means typecheck green and the touched
  flow observed working, not "the code looks right".
- **Never invent contracts.** Read `prisma/schema.prisma`, the existing `app/api/**/route.ts`
  and the `store/features/api/subApi/*` endpoints before adding or changing one. A missing
  model/route is a blocker to design, not a guess to make.
- **No `as any`, no `@ts-ignore` to silence errors.** Fix the type; `@ts-expect-error` with a
  reason only when a third-party type is wrong.
- **No secrets, privileged emails or passwords in code.** They come from env (admin emails
  via `ADMIN_EMAILS`). Never add a master password or a login bypass of any kind.
- **Fix what you touch.** When you edit a file, fix its obvious issues (wrong register in
  copy, `any`, unused imports). Don't start unrelated refactors.
- **Do not duplicate.** No `* copy.*` files, no copied route trees (`app/admin/account` is a
  historical copy of `app/account` - accepted debt, do not grow it). Check `utils/` and
  `app/_components/common/` before writing a helper or primitive.
- **Never communicate on the developer's behalf.** Draft PR text, commit messages or issue
  comments when asked; never post them yourself.

# Git, PR and release policy (this repo overrides global assumptions)

- `main` is the deploy branch (Vercel). Small, safe changes may be committed to `main`
  directly. Larger work goes on `feature/<slug>` (or `fix/<slug>`) with a PR to `main`.
- Conventional Commits, one line: `type: short imperative summary` (no scope, no ticket).
  Always show the message and wait for confirmation before `git commit`.
- PR title `type: short summary`; body `## Changes` (lowercase bullets, backticks for code)
  and `## Test plan`. **There is no Linear here - no `ENG-ID`, no `Resolves` link, no `dev`
  branch.** Use the `open-pr` skill, not the doctronic `pr-description` template.
- The doctronic analytics-event taxonomy does not apply. Analytics here is
  `@vercel/analytics` through `app/_components/main-layout/AnalyticsHandler.tsx`.
- Enforced by `bin/git-guard` (Cursor `beforeShellExecution` hook): no force / mirror pushes,
  no remote branch deletion, no `--no-verify`, no `core.hooksPath` overrides. Commits and
  pushes to `main` are allowed.
- Never delete remote branches, never rewrite shared history, never run destructive Prisma
  commands (`db push --force-reset`, `--accept-data-loss`, `migrate reset`) without the
  developer's explicit go-ahead and a fresh `npm run db-backup`.

# Tooling and MCP servers

- **Context7** - look up Next.js 15, Prisma 6, RTK Query, Tailwind 3, react-hook-form docs
  before relying on memory.
- **Chrome DevTools MCP** - the browser driver for QA (`browser-qa` skill) against
  `npm run dev`.
- **GitHub** - via `gh` (PRs, checks) or the GitHub MCP.
- Optional: Prisma MCP (`npx prisma mcp`) for schema/migration help.

# Skills (in `.cursor/skills/`)

`develop-feature` (front door) · `write-plan` · `review-changes` · `fix-bug` · `open-pr`
· `prisma-schema-change` · `browser-qa` · `design-bar` · `testing-principles`
· `modern-web-guidance` (vendored, load before markup/CSS work) · `maintain-agent-kit`.

Plans live in the project's `.cursor/plans/` (gitignored). Cursor's Plan mode writes to
`~/.cursor/plans/` first - move an adopted plan into `.cursor/plans/` and update it there.
Plan writing and validation go through `write-plan`; the global `create-plan` /
`validate-plan` skills are doctronic-specific and are not used in this repo.

"Done" for any feature or fix means the `develop-feature` verify-and-review loop ran on
the final code: typecheck, lint and `npx next build` green; `review-changes` (through the
read-only `reviewer` subagent when available) with every CRITICAL/HIGH finding fixed or
rejected with a traced reason; the touched flow observed with `browser-qa`.
