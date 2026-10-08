---
name: open-pr
description: >-
  Open a pull request for the current feature branch in this repo (postgres-prisma,
  GitHub Vadim-Bykov/postgres-prisma, base main) - push the branch, build the title
  (type: short summary, no ticket id) and the body (## Changes + ## Test plan) from the
  commits vs origin/main, print both for approval, then run gh pr create. Use for any
  request to open, create, raise or draft a PR here, or to write/update a PR title or
  description. This replaces the doctronic pr-description / create-pr flow in this repo:
  no Linear, no ENG-ID, no dev branch.
metadata:
  author: vadim
  version: "1.0"
---

# Open a pull request (single repo, base `main`)

This repo has **one branch that matters: `main`** (Vercel deploys it). PRs are optional
and used for larger or riskier changes. There is **no Linear**: no `ENG-ID` in the title,
no `Resolves` line, no `dev` base - ignore those requirements from the global doctronic PR
rule when working here.

## Preconditions

- Everything is committed (`git status -sb` clean). If not, stop: the developer commits
  first (show a proposed one-line Conventional Commit message and wait).
- You are on a feature branch, not `main`: `git branch --show-current`. If on `main` with
  unpushed commits, ask whether to move them to a branch (`git switch -c feature/<slug>`)
  or push `main` directly (allowed in this repo).
- `gh auth status` works.

## Workflow

1. **Compare against the remote base.** `git fetch origin`, then
   `git log --oneline origin/main..HEAD` - it must list only this work. If the remote
   branch has diverged from your local copy, **stop and report**; never force-push.
   `git diff origin/main...HEAD --stat` for the file list.
2. **Push:** `git push -u origin HEAD` (fast-forwards an existing remote branch).
3. **Existing PR?** `gh pr view --head "$(git branch --show-current)"` - if one exists, do
   not create a duplicate; offer to update its body with `gh pr edit`.
4. **Title** - Conventional Commit subject, under ~72 chars, lowercase after the colon, no
   trailing period, no ticket id. Map the branch prefix: `feature/` -> `feat`, `fix/` and
   `hotfix/` -> `fix`, `chore/` -> `chore`, `refactor/` -> `refactor`, `docs/` -> `docs`,
   `test/` -> `test`. No scope and no ticket id (`feat: add consultation reviews`), the
   same shape as the commit subjects in `AGENTS.md`.
5. **Body** - from the commit log and diff:

   ```markdown
   ## Changes

   - lowercase bullet describing one change, `backticks` for code references
   - another change (group related files into one bullet)

   ## Test plan

   - `npm run typecheck`, `npm run lint`, `npx next build` - green
   - what was checked in the browser (flow + viewport), with results
   - schema change: backup taken, `prisma db push` run against <which db>

   ## Screenshots

   <optional - drag images here or remove the section>
   ```

   Bullets start lowercase, one line each, no trailing period. Say honestly which checks
   were not run.

6. **Print the title and the full body in chat first** - every time, even when the request
   already said "open the PR". Title on its own line in a code block; body in a `markdown`
   code block, complete.
7. **Create:**

   ```sh
   gh pr create --base main --head "$(git branch --show-current)" \
     --title "<title>" --body "<body>" --assignee "@me"
   ```

   Add `--draft` when asked for a draft. Report the URL.

If the request did not include opening the PR, stop after step 6 and ask.

## Guardrails

- Never push to `main` _as part of opening a PR_; never force-push; never delete remote
  branches (`bin/git-guard` blocks force/delete anyway).
- Never merge the PR yourself; never post review comments on the developer's behalf.
- Keep the body short and scannable. Long root-cause analysis belongs in a PR comment the
  developer posts, not in the description.
- Short hyphens (`-`) in text, no em dashes; simple English (global writing-style rule).
- Check for `.github/pull_request_template.md` first; if one appears later, follow its
  sections and keep these formatting rules.
