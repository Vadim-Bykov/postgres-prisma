---
name: review-changes
description: >-
  Review changed code in this repo (postgres-prisma) against the project practices -
  RTK Query + Route Handler data layer, auth checks, ApiError protocol, Prisma safety,
  Tailwind tokens, Russian copy, error handling, TypeScript strictness, structure - and
  report severity-tagged findings (CRITICAL/HIGH/MEDIUM/LOW) with a verdict. Targets
  uncommitted work, the last commit, or a branch vs origin/main. Use before committing
  or opening a PR, as the review step of develop-feature and fix-bug, when asked to
  "review my changes / review this diff / check this against our conventions", or to
  re-check whether a single review finding is valid.
metadata:
  author: vadim
  version: "1.0"
---

# Review changes against the project practices

This skill checks **"does the code match how we build?"** - the companion to the verify
gate ("does it work?"). The standards are `AGENTS.md`, `.cursor/rules/*.mdc` and this
skill's rubric (`references/review-rubric.md`); the live check on _current code shape_ is
the app source itself.

> **Report, don't rewrite.** Produce findings the author can act on; never silently "fix"
> by relaxing a rule. Never delete or weaken a check to make a gate pass.

## Reasoning effort

Treat this as a high-effort task. Trace each hunk for correctness, error handling, auth
and data-exposure implications before judging it; do not do a surface pass.

## How to run a review

### 1. Pick the target and get the diff

Run `git status -sb`, then choose by priority:

1. **Uncommitted changes exist** -> `git diff HEAD --unified=3`, plus read every untracked
   file from `git ls-files --others --exclude-standard`.
2. **Clean tree on a feature branch** -> `git fetch origin && git diff origin/main...HEAD`
   (and `git log --oneline origin/main..HEAD` to confirm only this work is included).
3. **Clean tree on `main`** -> `git show HEAD --unified=3` (the last commit).

If the diff is large, `--stat` first and spend the deepest pass on new logic, API
boundaries, auth and user-facing behavior; skim mechanical changes. Read enough
surrounding code to judge (does this new endpoint have a handler? does this component
call `fetch`?).

### 2. Mechanical gate first (cheap, deterministic)

- `npm run typecheck` and `npm run lint` - report their real output.
- `bash .cursor/skills/review-changes/scripts/scan.sh [--base origin/main]` - greps the
  changed files for hard-rule hits (`console.*`, `: any`, `@ts-ignore`, inline `style={{`,
  raw hex outside `tailwind.config.js`, `fetch(` in components, `process.env` in client
  files, `.skip`/`.only`, `* copy.*` file names, hardcoded emails). **Heuristic** - confirm
  every hit against the source before reporting.

### 3. Semantic review against the rubric

Walk `references/review-rubric.md` category by category against the changed code: data
layer · routing, auth and state · API handlers and services · Prisma and database safety ·
styling · UX copy · errors, logging and secrets · TypeScript, imports and structure ·
tests. For changed markup/CSS/a11y, load `modern-web-guidance` and run its `search` for
the pattern in the diff; cite the guide id in the finding.

### 4. Report

A findings table, then tests/verification, then the verdict:

| Severity | File:line | Rule | Issue | Fix |
| -------- | --------- | ---- | ----- | --- |

Then **Verification**: typecheck/lint output, whether the flow was observed in the browser
(or state that it was not), no `.skip`/`.only`, no console noise. Then the **verdict** and
whether the change is **ready to commit / open a PR** or **needs fixes first**.

Number the findings (`F1`, `F2`, ...) so the author can triage them one by one and refer
to them in the follow-up round.

### 5. What the author does with the report (triage)

The review reports; the author (usually `develop-feature` or `fix-bug`) triages:

- **CRITICAL / HIGH** - fix, unless a re-check per `references/recheck-finding.md` shows
  the finding is `Not valid` or downgrades it. A rejected or downgraded finding is recorded
  with its one-line reason - never dropped silently.
- **MEDIUM** - fix when cheap and in scope; otherwise list it as follow-up.
- **LOW** - optional.
- Never "fix" a finding by weakening a rule, deleting a test, widening a type to `any`, or
  adding `@ts-ignore`.
- After fixing, re-run the gate (`npm run typecheck`, `npm run lint`, `npx next build`)
  and re-review if the fixes changed more than trivial lines (`develop-feature` Step 3 has
  the bounded loop).

### Fresh eyes

Prefer running the review in the read-only `reviewer` subagent (`.cursor/agents/reviewer.md`
in Cursor, `.claude/agents/reviewer.md` in Claude Code): a fresh context window does not
share the implementer's assumptions and cannot edit code. Fall back to running this skill
in-session when no subagent is available.

## Severity and verdict

- **CRITICAL** - data exposure (password hash, token, reset link, another user's data
  returned or logged), destructive database operation, missing auth check on a route that
  reads or mutates user data, swallowed error on a payment/registration path. **Block.**
- **HIGH** - a real bug or clear architecture violation: `fetch` in a component, Prisma in a
  page/component, RTK endpoint not matching a route, admin action without a server-side
  role check, unvalidated body written to Prisma, `any`/`@ts-ignore` added, `console.log`
  committed, English or «ты»/«вы» mixing in new copy, raw hex / inline style in new UI.
  **Fix before merge.**
- **MEDIUM** - maintainability drift: duplicated helper or component, copied tree, missing
  skeleton/empty/error state, `Promise.all` where a transaction is needed, missing
  `Pathname` union update, file > ~300 lines mixing concerns. Fix when reasonable.
- **LOW** - style / minor suggestion. Optional.

Verdict: **Approve** (no CRITICAL/HIGH) · **Warning** (HIGH only) · **Block** (any
CRITICAL). Do not approve new behavior that nobody has observed working.

## Guardrails

- Cite the specific rule or rubric check for every finding.
- Do not flag pre-existing debt as new (the `admin/account` copy, hardcoded admin emails,
  `UseFormRegister<any>` on old inputs, existing hex) - flag newly introduced violations
  and edits that extend the debt.
- A static-scan hit is a lead, not a verdict - confirm it.
- Personal data (emails, names, payment numbers) in logs or analytics is CRITICAL even
  though this is not a healthcare product.

## References

- `references/review-rubric.md` - the rubric, each check with its severity.
- `references/recheck-finding.md` - how to re-judge one finding by tracing the live code
  (verdicts: valid / downgrade / upgrade / not valid). Load when triaging CRITICAL/HIGH
  findings or when asked to re-check a finding.
- `scripts/scan.sh` - heuristic static scan (`--base <ref>` to scope to a diff; default
  scans uncommitted changes, `--all` scans the whole tree).
