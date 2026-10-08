# Plan templates and conventions

Load this when you sit down to write or restructure a plan. Two variants - **feature /
refactor / schema change** and **bug fix** - share the same header and update conventions.
Adapt sections to the work: omit what does not apply, do not pad. A short, specific plan
beats an exhaustive one.

## File and header (both variants)

Path: `.cursor/plans/<kebab-slug>.plan.md`. Start every plan with this header:

```markdown
# <Feature / Fix Title>

> **Status:** Draft <!-- Draft -> Approved -> In progress -> Done / Abandoned -->
> **Branch:** feature/<short-name> <!-- or "main (small change)" -->
> **Created:** <YYYY-MM-DD> **Updated:** <YYYY-MM-DD>
> **Mode:** feature | refactor | schema | bugfix
> **Links:** <GitHub issue / PR / screenshot folder - optional>
```

Use absolute dates (your context carries today's date - never write "today"/"now").

---

## Variant A - Feature / refactor / schema change

```markdown
## Goal

2-3 sentences: what we are building and why. The outcome, not the steps.

## Scope

- **In:** what this delivers.
- **Out:** what it explicitly does not (so nobody expects it).
- **Assumptions:** what you take as given (call out anything you could not verify).

## Context (grounded in the code)

What exists today and what we follow. Cite real paths.

- Pattern to follow: `app/account/bonuses/*` (why it is the model).
- Models: `prisma/schema.prisma` -> `Bonus`, `Wallet` (fields used).
- Existing API: `GET/PATCH app/api/bonus/route.ts` -> `bonusService.*`; RTK:
  `store/features/api/subApi/bonus.ts`. **Missing route/field -> designed below as a step,
  never invented.**
- Auth: anonymous | logged-in (`useAuthorizedRoute` + `getUserDataFromCookies`) | admin.

## Approach

The chosen approach in a few sentences. If there was a real fork, one line per option and
why you picked this one. Prefer extending existing code over rewriting.

## Implementation steps

### Phase 1: <smallest valuable slice> - independently deliverable

1. **<Step>** (`path/to/file`)
   - Action: precisely what changes.
   - Why: the reason.
   - Depends on: none / step N.
   - Risk: Low | Medium | High - and why if not Low.
2. **<Step>** (`path/to/file`)
   ...

### Phase 2: <next slice>

...

## Verify plan

States each check covers (loading / empty / error / success - not just happy path).

- `npm run typecheck`, `npm run lint`, `npx next build`
- Review loop (`develop-feature` Step 3): `review-changes` via the `reviewer` subagent,
  triage, fix valid findings, re-gate - until no CRITICAL/HIGH is open
- `browser-qa` journey on the final code: <steps>, at 375 and 1024
- Schema change: `npm run db-backup` -> `prisma format` -> `generate` -> `db push` (see
  `prisma-schema-change`)

## Risks and mitigations

- **Risk:** <description> -> **Mitigation:** <how>.

## Open questions

- Anything unresolved or unverifiable. Remove if none.

## Success criteria

- [ ] <Checkable outcome>
- [ ] Typecheck/lint/build green on the final code.
- [ ] `review-changes` run: no CRITICAL/HIGH open; rejected or downgraded findings listed
      with reasons; MEDIUM/LOW follow-ups noted.
- [ ] Flow observed working in the browser (`browser-qa`) after the last fix.

## History / Changelog

- <YYYY-MM-DD> - Drafted.
```

---

## Variant B - Bug fix

```markdown
## Bug

What the user experiences - message, frequency, where (page/route). Describe data by shape,
never paste real emails or tokens.

- **Expected:** what should happen.
- **Actual:** what happens instead.
- **Repro:** 1... 2... 3... (note conditions if intermittent; browser/viewport if relevant).

## Root cause

Investigate the code _before_ writing this - do not theorize.

- **Error origin:** file / function / line (Vercel runtime log or browser console if
  available).
- **Chain of events:** ordered sequence leading to the bug.
- **Root cause:** why it happens. Category: state | data | API | auth | layout | logic.
- **Affected files:** `path` - role in the bug.

## Fix approach

Strategy and why this over alternatives. Then ordered steps with file paths:

1. **<Step>** (`path/to/file`) - what changes, key decisions.
2. ...

- **Related areas to check:** other code with the same pattern (for example the
  `app/admin/account` copy of an `app/account` component).

## Verification

- [ ] Reproduce the original bug - confirm it no longer occurs.
- [ ] Happy path still works.
- [ ] Edge cases: <list>.
- **Regression risk:** shared code this touches and how it is checked.
- **Commands:** `npm run typecheck`, `npm run lint`, `npx next build`, `browser-qa` steps.
- [ ] Review loop done: `review-changes` (reviewer subagent) - no CRITICAL/HIGH open,
      rejected findings recorded with reasons.

## Open questions

- Unresolved items. Remove if none.

## History / Changelog

- <YYYY-MM-DD> - Drafted from <report / screenshot / log>.
```

---

## Section guidance

- **Goal / Bug** - always. Outcome first; steps come later.
- **Scope** - features/refactors. The **Out** list prevents scope creep.
- **Context** - always. Cite real paths; this is what makes the plan trustworthy.
- **Models / API** - whenever data is involved. Read from the schema and routes; missing ->
  a designed step, not a guess.
- **Root cause** - bug fixes. Must investigate the code first.
- **Implementation** - always. Ordered, file paths, risk tags, deliverable phases.
- **Verify plan** - always. Exact commands, the review loop, and the browser journey on
  the final code.
- **Risks / Open questions** - when real. Honesty about unknowns beats false confidence.
- **Success criteria** - features/refactors. Checkable boxes; tick them as work lands.
- **History / Changelog** - always. One dated line per meaningful update.

## Updating conventions (the living record)

- **Same file, kept current.** Do not spawn `*-v2.plan.md`; history lives in `Status` +
  `Changelog` + deviation notes inside the file.
- Move **Status** as work progresses; bump **Updated:** to the current absolute date.
- Check off `- [ ]` -> `- [x]` as steps/criteria land.
- When reality diverges, add a deviation note under the step (do not delete the original):
  `> Deviation (YYYY-MM-DD): used X instead of Y because <reason>.` Strike superseded text
  with `~~...~~` rather than erasing it.
- Append a **Changelog** line on each meaningful update: `- <YYYY-MM-DD> - Approved.` /
  `Phase 1 landed.` / `Scope cut: dropped the export step.` / `Done - shipped on <branch>.`

## Worked example (abridged)

```markdown
# Consultation reviews on the detail page

> **Status:** Approved
> **Branch:** feature/consultation-reviews
> **Created:** 2026-10-08 **Updated:** 2026-10-09
> **Mode:** schema

## Goal

Let a user who bought a consultation leave a short review; show reviews on the
consultation detail page.

## Context (grounded in the code)

- Pattern to follow: `app/consultation/[id]/components/ConsultationDetails.tsx` (client
  component + RTK query + skeleton) and `app/api/purchase/route.ts` (authed POST).
- Models: `Consultation`, `Purchase`, `Users` in `prisma/schema.prisma`. No `Review` model -
  designed in Phase 1.
- Auth: logged-in; the purchase must be `paymentStatus: CONFIRMED`.

## Implementation steps

### Phase 1: data layer - independently deliverable

1. **`Review` model** (`prisma/schema.prisma`) - `id`, `userId`, `consultationId`, `text`,
   `rating Int`, `createdAt`; relations to `Users`, `Consultation`. Depends on: backup.
   Risk: Medium (schema push on the shared DB).
2. **Service + route** (`server/services/reviewService.ts`, `app/api/review/route.ts`) -
   GET by consultation, POST for the authed buyer. Risk: Low.

### Phase 2: UI

3. **RTK endpoints** (`store/features/api/subApi/review.ts`, tag `Review`). Risk: Low.
4. **`ReviewList` + `ReviewForm`** (`app/consultation/[id]/components/`). Risk: Low.

## Verify plan

- typecheck / lint / `npx next build`; review loop via the `reviewer` subagent until no
  CRITICAL/HIGH; browser-qa on the final code: open detail -> empty state -> submit
  review -> appears in list; error when not purchased.

## Success criteria

- [x] Phase 1 pushed and backed up.
- [ ] Review loop done: no CRITICAL/HIGH open (F2 "unvalidated rating" fixed; F3 rejected -
      `rating` is clamped in the service, reason recorded).
- [ ] Review visible after submit; observed at 375 and 1024.

## History / Changelog

- 2026-10-08 - Drafted.
- 2026-10-09 - Approved; Phase 1 landed.
```
