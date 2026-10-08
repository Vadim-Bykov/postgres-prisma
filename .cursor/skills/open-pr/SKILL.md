---
name: open-pr
description: >-
  Open a pull request for the current feature branch in this repo (postgres-prisma,
  GitHub Vadim-Bykov/postgres-prisma, base main) - push the branch, build the title
  (type: short summary, no ticket id) and the body (## Changes + ## Test plan +
  collapsible ## Attachments) from the commits vs origin/main, print both for approval,
  then run gh pr create with the browser-qa screenshots from .tmp/qa/ uploaded via
  --attach. Use for any request to open, create, raise or draft a PR here, to write/update
  a PR title or description, or to attach screenshots to a PR. This replaces the doctronic
  pr-description / create-pr / attach-pr-screenshots flow in this repo: no Linear, no
  ENG-ID, no dev branch.
metadata:
  author: vadim
  version: "1.1"
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
3. **Existing PR?** `gh pr view --json number,url` (picks the current branch's PR; exit 1
   with `no pull requests found` means there is none). If one exists, do not create a
   duplicate; offer to update its body with
   `gh pr edit <number> --body-file .tmp/pr-body.md --attach ...` - same body and
   attachment rules as steps 5-7, keep every section the developer already edited.
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

   ## Attachments

   <details>
     <summary>Screenshots/Videos</summary>

   Consultation cards at 375: skeletons fit the viewport, no side scroll.

   ![Consultation cards 375](/abs/path/.tmp/qa/<journey>/15-final-cards-375-full.png)

   </details>
   ```

   Bullets start lowercase, one line each, no trailing period. Say honestly which checks
   were not run.

   **Attachments** are the `browser-qa` screenshots of the final code. List them with
   `ls .tmp/qa/<journey>/` (gitignored - `Glob` returns nothing there) and propose the
   `final` shots at 375 and 1024 that show the change; skip tuning shots, traces and
   lighthouse folders. One short note above each image (plain English, backticks for UI
   copy), then `![alt](<absolute path>)` with the **same absolute path** you pass to
   `--attach` - `gh` uploads the file and rewrites the link to a `user-attachments` URL.
   Only shots taken with a throwaway account - nothing with a real user's email or name
   (`browser-qa` gotcha). Drop the section when the change has no UI and there is nothing
   to attach.

   **Confirm the pick before uploading.** Show every candidate inline in chat
   (`![name](<absolute path>)` renders there), then ask once with the `AskQuestion` widget
   - multi-select, one option per file, your proposed shots first and marked
     `(Recommended)`; in Claude Code (no widget) a numbered list. Skip the question only
     when the request names the files or says "attach all", or when the plan or the initial
     prompt asks for a fully autonomous run with no questions - then attach the proposed
     shots and list them in the final summary so the developer can change them with
     `gh pr edit`.

6. **Print the title and the full body in chat first** - every time, even when the request
   already said "open the PR". Title on its own line in a code block; body in a `markdown`
   code block, complete - never a summary or "as above". The printed body shows the local
   image paths; `gh` rewrites them on upload.
7. **Create.** Write the body to `.tmp/pr-body.md` (gitignored; `--body-file` keeps the
   HTML and the paths intact), then:

   ```sh
   gh pr create --base main --head "$(git branch --show-current)" \
     --title "<title>" --body-file .tmp/pr-body.md --assignee "@me" \
     --attach "/abs/path/.tmp/qa/<journey>/15-final-cards-375-full.png" \
     --attach "/abs/path/.tmp/qa/<journey>/16-final-hover-primary-1024.png"
   ```

   `--attach` is repeatable (max 50 files); leave it out when there is nothing to attach.
   Add `--draft` when asked for a draft. Report the URL, then `gh pr view --json body` and
   confirm no local paths remain.

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

## Gotchas

- `gh pr view --head <branch>` does not exist - the branch is a positional argument, and
  `gh pr view` with no argument already picks the current branch's PR.
- `.tmp/qa/` is gitignored, so `Glob` returns nothing for it - list screenshots with `ls`.
- The markdown image path and the `--attach` path must match exactly, or `gh` appends the
  upload at the end of the body and the local link stays broken.
- `--attach` needs `gh` 2.99 or newer (`gh --version`; `gh pr create --help` must list
  `--attach`). If it is older, create the PR without screenshots and say so - do not
  `brew upgrade gh` on your own and do not invent an upload API.
- If some uploads fail, `gh` still creates the PR with the ones that worked, exits non-zero
  and prints the URL anyway - check the body before re-running; never create a second PR.
- Never upload screenshots to gists, anonymous image hosts or `raw.githubusercontent`, and
  never commit `.tmp/qa/` to link it from the repo.
- The developer's personal `attach-pr-screenshots` skill
  (`~/.cursor/skills/attach-pr-screenshots/SKILL.md`, hidden from auto-discovery) covers the
  same `gh pr edit --attach` flow for an existing PR; here the screenshot folder is
  `.tmp/qa/<journey>/`, not `.cursor/docs/`.
