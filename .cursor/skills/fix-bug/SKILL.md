---
name: fix-bug
description: >-
  Investigate and fix a bug in this repo (postgres-prisma), or write a structured
  bug-fix plan first. Gathers the report (description, screenshots, repro steps, Vercel
  runtime logs, browser console), reproduces it in Chrome when needed, traces the path
  component -> RTK endpoint -> route handler -> service -> Prisma to the root cause, then
  either applies a minimal fix or hands off to write-plan (bug-fix variant). Use when
  asked to "fix this bug / debug this / investigate this issue / why does X happen / plan
  a fix", or when the user shares an error message, screenshot or failing flow.
metadata:
  author: vadim
  version: "1.0"
---

# Fix a bug

Find the root cause, then either fix it with the smallest safe change or write a plan.
Conventions come from `AGENTS.md` and `.cursor/rules/*.mdc`; copy the shape of the
surrounding code.

## 1. Gather context

Ask for what is available (one short checklist, do not block on all of it):

- **What the user sees** - message, screenshot or recording, which page / flow.
- **Reproduction steps** - or "intermittent" with the conditions (logged in? mobile?
  which consultation? which browser?).
- **Expected vs actual behavior.**
- **Logs** - Vercel runtime logs (dashboard or `vercel logs` if the CLI is installed) for
  API errors; browser console / network for client errors.

Proceed when you have at least a clear description or a reproducible step.

## 2. Reproduce (when the cause is not obvious)

- Start `npm run dev` (needs the Postgres env vars) and drive the flow with the
  `browser-qa` skill (Chrome DevTools MCP): `take_snapshot`, interact, then
  `list_console_messages` and `list_network_requests` to see the failing call and the
  `{ success: false, message }` body.
- For runtime-state bugs (timing, stale cache, auth race), Cursor's **Debug mode** is a good
  fit - suggest it instead of guessing.

## 3. Investigate the root cause

Trace the whole path and name the layer where it breaks:

1. **UI** - component in `app/<route>/components/*`: state, conditions, props.
2. **RTK endpoint** - `store/features/api/subApi/*`: url/method/body, tags (stale cache
   after a mutation is a common cause), `unwrap()` error handling.
3. **Route handler** - `app/api/**/route.ts`: body parsing, auth
   (`getUserDataFromCookies`), validation, `apiCatchErrorHandler`.
4. **Service / Prisma** - `server/services/*`: query shape, missing `include`, enum
   values, environment filter (`PUBLISHED` only in production), transactions.
5. **Auth / cookies** - `cookieService`, `tokenService` (expired JWT -> 401 -> client
   redirect), `useAuthorizedRoute` timing (`isAuthorized` is `undefined` until the auth
   query resolves).

Common categories: state (stale/undefined), data (null not handled, wrong shape), API
(wrong url, missing tag invalidation), auth (cookie missing on the request), layout
(Tailwind class conflict, breakpoint mismatch), logic (wrong condition, off-by-one).

Check for the same pattern elsewhere - especially the mirrored `app/admin/account`
components, which often carry the same bug as `app/account`.

Document: root cause, chain of events, affected files.

## 4. Choose the mode

Ask (use the `AskQuestion` widget):

- **Write a plan** (`write-plan`, bug-fix variant) - when the fix touches several files or
  shared code, the root cause is ambiguous, or you want a record before changing anything.
- **Apply the fix** - single-file or clearly isolated change with one obvious correct fix.

## 5a. Mode: plan

Hand off to `write-plan` and use **Variant B - Bug fix** from its templates. The plan must
state the root cause before any fix step, propose the minimal change, and include the
verification steps (reproduce -> confirm gone, happy path, edge cases).

## 5b. Mode: fix

1. **Say what you will change and why** before editing.
2. **Minimal change.** Fix the bug; do not refactor around it. Fix obvious issues in the
   lines you touch (register mixing, `any`) per "fix what you touch".
3. **Follow the rules** (`development-standards`, `api-and-prisma`, `styling-tailwind`,
   `ux-copy-ru`). If the fix needs a schema change, go through `prisma-schema-change`.
4. **Verify and review loop** (same as `develop-feature` Step 3, at most 3 rounds): gate
   (`npm run typecheck`, `npm run lint`, `npx next build`) -> review the diff with the
   read-only `reviewer` subagent or `review-changes` in-session (skip the review only for
   a true one-liner) -> triage: fix valid CRITICAL/HIGH, re-check doubtful ones per
   `.cursor/skills/review-changes/references/recheck-finding.md`, record rejected
   findings with a reason -> re-gate after fixes.
5. **Confirm the fix on the final code**: re-run the reproduction in the browser
   (`browser-qa`), confirm the bug is gone and the happy path still works. Report the
   actual output. A regression found here re-enters step 4.
6. **Related code**: if the same bug exists elsewhere (admin copy, sibling list), flag it
   and offer to fix.
7. Propose a one-line commit message (`fix: ...`) and wait for confirmation. The summary
   lists findings fixed and findings rejected (with reasons).

## Guardrails

- Never "fix" by deleting a check, widening a type to `any`, or swallowing the error.
- Never run destructive Prisma commands to "reset" state; take a backup first if data must
  be repaired, and ask.
- Keep personal data out of the plan and the chat (describe by shape).
