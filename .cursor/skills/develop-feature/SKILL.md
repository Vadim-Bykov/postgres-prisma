---
name: develop-feature
description: >-
  Front door for building or changing a feature in this repo (postgres-prisma, the
  Астрология_Инь Next.js 15 + Prisma + RTK Query + Tailwind site). Runs the full cycle:
  plan (write-plan) -> branch -> build to the project rules (copy the nearest existing
  feature; schema edits via prisma-schema-change) -> a bounded verify-and-review loop
  (typecheck, lint, next build, reviewer subagent / review-changes, triage and fix valid
  findings, re-gate, browser-qa on the final code) -> ship (commit / open-pr). Use for any
  "build / add / implement / develop / change a feature, page, component, flow, API
  route or model" request in this project, or whenever you want planning,
  verification and the git workflow wrapped around the work.
metadata:
  author: vadim
  version: "1.0"
---

# Develop a feature (end to end)

This skill is the **conductor**. It does not re-teach conventions - those live in
`AGENTS.md` and `.cursor/rules/*.mdc` (always loaded by file type). It chooses the shape
of the work, then drives **plan -> build -> verify -> review -> ship**, invoking:

- `write-plan` - the Step 0 plan in `.cursor/plans/<slug>.plan.md`, kept updated.
- `modern-web-guidance` - web-platform craft (HTML semantics, a11y, CSS, CWV): run its
  `search` -> `retrieve` loop **before** writing new markup/CSS/client JS, with
  `DISABLE_TELEMETRY=1`.
- `prisma-schema-change` - any edit to `prisma/schema.prisma`.
- `browser-qa` - observe the touched flow in Chrome via the Chrome DevTools MCP.
- `review-changes` - the "does it match how we build?" gate, run through the read-only
  `reviewer` subagent when available; `.cursor/skills/review-changes/references/recheck-finding.md`
  is how doubtful findings are re-judged before fixing.
- `design-bar` - the anti-template + copy pass for visual surfaces.
- `open-pr` - when the developer asks for a pull request.

> The live code is the ground truth for code shape. Before writing, open the nearest
> existing feature and copy it: `app/consultation/*` (list + detail + payment),
> `app/account/bonuses/*` (authed list with skeleton + empty state),
> `server/services/bonusService.ts` + `app/api/bonus/route.ts` (service + handler),
> `store/features/api/subApi/bonus.ts` (RTK endpoints), `app/_components/Modal/LoginModal.tsx`
> (form + mutation + inline error).

## Step 0 - Plan and choose the shape

For anything beyond a one-file edit, write the plan with **`write-plan`** first. Establish
(ask only what you cannot infer):

- **Shape of the work:** UI-only change · new screen/flow · new API route + service ·
  schema change (new model/field) · bug fix (use `fix-bug` instead).
- **Data:** which Prisma models and which existing `app/api/**/route.ts` it needs. Read
  `prisma/schema.prisma` and the route files - **never invent a route, field or enum**. A
  missing one is a design step in the plan (API + service + RTK endpoint), not a guess.
- **Auth:** anonymous, logged-in (`useAuthorizedRoute` + `getUserDataFromCookies`) or admin
  (`useAdminRoute` + server-side `role` check)?
- **States to handle:** loading (skeleton), empty, error (Russian message), success.
- **Copy:** Russian, «вы» register (`ux-copy-ru.mdc`).

Present the plan summary and get a go-ahead before building non-trivial work.

## Step 1 - Preflight and branch

- **Adopt the plan file first.** If the plan lives in `~/.cursor/plans/` (Cursor Plan mode
  writes there and cannot move files), run
  `mkdir -p .cursor/plans && mv ~/.cursor/plans/<name>_<hash>.plan.md .cursor/plans/<slug>.plan.md`,
  set its Status to `Approved`, and work from that path only.
- `npm run dev` needs the Postgres env vars from `.env` / `.env.development.local`. Confirm
  which database they point at before running anything that writes.
- Small, safe change -> work on `main` is allowed (AGENTS.md git policy). Feature-sized work
  -> `git switch -c feature/<slug>` (or `fix/<slug>`) so it can go through a PR.
- Never force-push, delete remote branches or skip hooks (`bin/git-guard` blocks them).

## Step 2 - Build

Work from the inside out, following the rules files:

1. **Schema** (if needed) -> `prisma-schema-change` (backup, edit, `prisma format`,
   `generate`, `db push`, update `models/*`).
2. **Service** in `server/services/<domain>Service.ts` - named async functions, Prisma via
   `@/lib/prisma`, `throw ApiError.*`, `catchErrorHandler` (see `api-and-prisma.mdc`).
3. **Route handler** in `app/api/<path>/route.ts` - auth via `cookieService.getUserDataFromCookies()`,
   validation, `NextResponse.json`, `apiCatchErrorHandler`.
4. **RTK endpoint** in `store/features/api/subApi/<domain>.ts` injected into `appApi`, with
   tags; types in `models/*`.
5. **UI** in `app/<route>/components/*` with shared primitives from `app/_components/common`,
   Tailwind + `cn()`, skeleton placeholder, empty state, inline error, `next/dynamic` for
   modals (see `development-standards.mdc`, `styling-tailwind.mdc`). Load
   `modern-web-guidance` for each new UI pattern (dialog, form, animation, image).
6. **Copy** per `ux-copy-ru.mdc`; add reusable strings to `app/constants/messages.json`.
7. Add new routes to the `Pathname` union in `utils/useAppRouter.ts`.

Keep the plan file current (check off steps, note deviations) as you go.

## Step 3 - Verify and review loop

Do not claim done on "it compiles". The goal of this step is a **tested, reviewed
implementation with every finding either fixed or explicitly rejected**. Run the loop
below until the exit condition holds (at most 3 rounds).

### One round

1. **Gate** - run and report the real output of `npm run typecheck`, `npm run lint` and
   `npx next build` (**not** `npm run build`, which pushes the schema and seeds the DB).
   Fix failures before reviewing.
2. **Review** - prefer the read-only `reviewer` subagent (`/reviewer` in Cursor; the
   `reviewer` agent in Claude Code): fresh context, cannot edit. Fall back to running
   `review-changes` in-session. For visual or marketing surfaces also run `design-bar`.
3. **Triage every finding** (`review-changes` Step 5):
   - **CRITICAL / HIGH** - fix. When a finding looks doubtful, re-check it first per
     `.cursor/skills/review-changes/references/recheck-finding.md` (trace the live path;
     the finding is a claim, not evidence). Fix what is still valid; a `Not valid` or downgraded finding
     is recorded with its one-line reason in the summary - never dropped silently. The
     developer can also run `/recheck-review-finding` for an independent verdict.
   - **MEDIUM** - fix when cheap and in scope; otherwise list as follow-up.
   - **LOW** - optional.
   - Never satisfy a finding by weakening a rule, deleting a test, widening a type to
     `any`, or adding `@ts-ignore`.
4. **Re-gate** after fixes (step 1 again). If the fixes changed more than trivial lines,
   review again (step 2) - a fix can introduce a new finding.

### Exit condition

- Gate green on the **final** code.
- No open CRITICAL/HIGH findings (fixed or rejected with a traced reason).
- `browser-qa` run on the **final** code for the touched journey at 375 and 1024: loading,
  empty, error and success states, console and network sweep. A bug found here re-enters
  the loop.
- Plan file updated (steps checked off, deviations noted).

If three rounds do not converge, stop and report the residue to the developer instead of
looping further or relaxing the bar. State honestly what you could not run (for example,
no database credentials for `browser-qa`).

## Step 4 - Ship

- Commit in small coherent units with a one-line Conventional Commit; show the message and
  wait for confirmation (global commit rule). No AI attribution in commits.
- When asked for a PR, use `open-pr` (base `main`, title `type: summary`, no ticket ids).
- Deliver a summary: what changed (files); the gate output; review rounds with findings
  fixed, findings rejected or downgraded (with reasons) and MEDIUM/LOW left as follow-up;
  browser-qa evidence (screenshots); deviations from the plan; open questions.

## Guardrails

- **Never invent the backend.** Missing model/route -> design it in the plan or stop and
  flag.
- **Data goes through RTK Query + Route Handlers.** No `fetch` in components, no Prisma in
  pages/components.
- **Tailwind tokens, `cn()`, no inline styles, no raw hex.**
- **Russian copy, «вы» register, no English leftovers.**
- **No `any`, no `@ts-ignore`, no `console.log` in committed code.**
- **Database safety:** backup before schema changes; never destructive Prisma commands
  without explicit go-ahead.
- **Honest done:** typecheck + lint + build green on the final code, flow observed in the
  browser, every review finding fixed or rejected with a traced reason - or say exactly
  which of these did not happen.
