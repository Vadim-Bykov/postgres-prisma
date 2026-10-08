---
name: write-plan
description: >-
  Create, validate and maintain a written implementation plan for non-trivial work in
  this repo (postgres-prisma), persisted to .cursor/plans/<slug>.plan.md as a living
  record: restate the requirement, investigate the real code (Prisma schema, API routes,
  RTK endpoints, nearest feature), phased steps with exact paths, a verify plan, risks,
  success criteria; check the draft against .cursor/rules; keep the file updated. Use
  when asked to "plan / write an implementation or bug-fix plan", to scope a feature,
  refactor or schema change, as Step 0 of develop-feature and fix-bug, to "validate /
  check a plan" (including one Cursor's Plan mode wrote to ~/.cursor/plans), or to
  "implement the plan in a new chat / write the prompt for a fresh chat". Use instead of
  the global create-plan / validate-plan / plan-fresh-chat skills (doctronic-specific).
metadata:
  author: vadim
  version: "1.0"
---

# Create and maintain an implementation plan

Produce a **written plan before touching code**, persist it to `.cursor/plans/`, and keep
that one file **updated as the work proceeds**. The plan is the spec you build and verify
against and a durable record of what was decided - not a throwaway chat message.

A good plan is **grounded in this codebase** (exact files, the nearest feature to copy),
**specific** (phased steps, file paths), **honest about risk and unknowns**, and
**checked against the project rules** before anyone builds from it.

## When to use this

- Any non-trivial change: a new screen or flow, a new API route + service, a schema change,
  a refactor, a bug fix that is not a one-line typo, work spanning multiple files.
- Requirements are ambiguous or the approach has real trade-offs.
- As Step 0 of `develop-feature` / `fix-bug`.

**Skip it** for a single obvious edit, a rename, or a question you can just answer.

> Cursor's plan mode is an ephemeral thinking sandbox; this skill produces the artifact.
> Think in plan mode, write the file here.

## Where the plan lives

- `.cursor/plans/<kebab-slug>.plan.md` (gitignored local history), e.g.
  `.cursor/plans/consultation-reviews.plan.md`.
- **One file per unit of work.** Updates go back into the same file. Never delete a plan
  when the work ships - mark it `Done`.
- If a plan for this work already exists, open and update it instead of starting a new one.
- Never paste secrets, tokens or real user emails into a plan. Refer to data by shape.

## Creating a plan

Investigate first, then write. A plan invented without reading the code is the failure mode
this skill exists to prevent.

1. **Restate the requirement**: goal, in/out of scope, success criteria, assumptions.
   Surface ambiguities as questions (use the `AskQuestion` widget for fixed choices).
2. **Investigate the real code.** Read `prisma/schema.prisma` for the models involved, the
   existing `app/api/**/route.ts` and `server/services/*` for the domain, the RTK endpoints in
   `store/features/api/subApi/*`, and the nearest UI feature (`app/consultation/*`,
   `app/account/*/components/*`). **Cite paths.** A missing route, field or enum is a
   blocker you record and design - never a guess.
3. **Choose the approach.** When there is a real fork, state the options in a sentence each
   and the one you recommend and why. Prefer extending existing code over rewriting.
4. **Break it into phased, ordered steps** - each with the file(s) it touches, the action,
   why, dependencies and a risk tag. Phases should be independently deliverable
   (smallest valuable slice first; data layer before UI).
   **Write every step for an executor who has not seen this chat and may be a weaker
   model**: it must be doable without inference. Give exact file paths and names
   (service, endpoint, RTK hook and tag, component, `messages.json` key), the existing
   file to copy with line numbers (`server/services/bonusService.ts:9-48`), the contract
   (fields, request/response types), the Russian UI and error strings ready to paste, a
   verify command or observable result, and a "done when" criterion. Add a short snippet
   (10-30 lines) only where the shape is non-obvious or error-prone - the `ApiError` /
   `apiCatchErrorHandler` protocol, `injectEndpoints` with tags, `$transaction`, the
   admin role check - and name the real file it is adapted from. Do not paste whole
   implementations: they go stale and a weak model copies them blindly; a skeleton plus
   "copy this file" ages better. Keep the plan within ~300 lines; conventions stay in the
   rules, which the executor loads automatically.
5. **Verify plan**: `npm run typecheck`, `npm run lint`, `npx next build`; the review loop
   (`review-changes` through the `reviewer` subagent, triage, fix valid findings, re-gate,
   until no CRITICAL/HIGH is open); and the `browser-qa` journey on the final code with
   its states (loading / empty / error / success). If a schema changes, the
   `prisma-schema-change` steps including the backup.
6. **Risks and mitigations**, **open questions**, **success criteria** (checkable boxes).

Write the file using `references/plan-templates.md` (feature/refactor and bug-fix variants -
**load it when you sit down to write**). Then **validate** the draft against
`references/validation-checklist.md` and fix violations in place (imports, data-layer
shape, Tailwind, copy, API/Prisma rules). Finally present a short summary in chat and get a
go-ahead before building non-trivial work.

7. **Offer the hand-off.** Right after presenting the plan (in Cursor Plan mode: right
   after `CreatePlan`), ask with the `AskQuestion` widget how to proceed - `Build in a new
chat - print the hand-off prompt (Recommended)` for anything non-trivial, `Build in this
chat`, or `Adjust the plan first`. On "new chat", print the prompt from
   `references/fresh-chat-prompt.md` immediately (printing is allowed in Plan mode even
   though file moves are not).

## Adopting or validating an existing plan

- **Cursor Plan mode** writes its file to `~/.cursor/plans/<name>_<hash>.plan.md`, outside
  the repo, and Plan mode is read-only - the planning chat cannot move it. The move is the
  **first action in Agent mode**, done by whoever builds (`develop-feature` Step 1, or the
  new chat via the hand-off prompt):
  `mv ~/.cursor/plans/<name>_<hash>.plan.md .cursor/plans/<kebab-slug>.plan.md` (drop the
  hash, keep the content), then treat it as the living record described here. Never keep
  two copies. While still in Plan mode, write the destination path into the plan's header
  so the executor knows where it goes.
- **Validation** is this skill's checklist, not the global `validate-plan` skill (that one
  detects any Next.js repo as the doctronic website, applies v2/Vitest/`eng-XXXX`
  conventions and moves plans into monotronic paths). Walk
  `references/validation-checklist.md` against the plan, report findings in its format,
  and fix the plan in place with minimal edits.

## Handing a plan to a fresh chat

Prefer implementing a non-trivial plan in a **new Agent chat**: it starts with only
`AGENTS.md`, the rules and the plan file, so it builds from the spec instead of the memory
of a long planning discussion, and it will not hit the context limit mid-work. Stay in the
same chat only for small plans (a few files) with a short discussion. Either way, anything
decided in chat must be in the plan file first - the new chat cannot see this one.

When asked to hand off ("implement this in a new chat", "write the prompt for the next
chat"), load `references/fresh-chat-prompt.md` and print its filled template.

## Updating a plan (the living record)

- Move **Status** through `Draft -> Approved -> In progress -> Done` (or `Abandoned`).
- Check off steps and success criteria (`- [x]`) as they land.
- Record **deviations** under the step when reality differs - what changed and why. Do not
  silently rewrite history.
- Append a dated line to **History / Changelog** on each meaningful update (use the absolute
  date from your context, never "today").
- Update the plan when scope changes _before_ building the change.

## Composition

- This skill plans only; it never implements, commits or reviews. `develop-feature` and
  `fix-bug` hand off to it, then proceed.
- Conventions are referenced, not re-encoded: point at `.cursor/rules/*.mdc` and the live
  files.

## Gotchas

- **Do not plan from memory.** If the plan names a file, model, route or component you have
  not opened, go read it first. Invented APIs and stale line numbers are the most common rot.
- **One file, kept current** beats several timestamped copies.
- **Phases must stand alone.** A plan where nothing works until phase 4 needs re-slicing.
- **Be honest about limits.** If you could not verify a contract or a behavior (for
  example, no database access), say so under _Open questions_.
- **`npm run build` is not a verify step** - it pushes the schema and seeds the DB. Plans
  say `npx next build`.

## References

- `references/plan-templates.md` - the feature/refactor and bug-fix templates, header,
  section guidance, update conventions, worked example. Load when writing a plan.
- `references/validation-checklist.md` - what to check the draft against before presenting
  it. Load after the first draft.
- `references/fresh-chat-prompt.md` - the pasteable prompt (build / update modes) for
  implementing the plan in a new Agent chat. Load when asked to hand a plan off.
