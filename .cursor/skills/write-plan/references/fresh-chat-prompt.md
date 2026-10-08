# Hand a plan to a fresh chat

Load this when the developer asks to "implement the plan in a new chat", "build this in a
fresh chat", "write the prompt for the next chat", or "continue the remaining work in a
new chat". Output one pasteable prompt for a new **Agent-mode** chat. Do not implement,
commit or re-plan in the current chat.

A fresh chat starts with only `AGENTS.md`, the rules and the plan file, so anything not in
the plan is lost. **Fold open decisions into the plan first** (Locked decisions, Out of
scope, Verify plan), then write the prompt.

## Mode

- `build` - Status is `Draft` or `Approved` and no step is checked. The new chat
  implements every phase in order.
- `update` - some steps are checked, or the changelog has entries after work started. The
  new chat diffs the plan against the code and implements only the gap.

User wording wins; if unclear, ask one question.

## Extract from the plan (copy, do not invent)

Absolute plan path · Status and Branch · Mode · locked decisions and resolved open
questions · In / Out of scope · phases and steps with their checkbox state · the Verify
plan commands · browser-qa routes and viewports · skills named in the plan (default entry:
`develop-feature`; bug plans: `fix-bug`).

## Template

Line 1 is the chat name (Cursor takes it from the first line): `ASTRO <short title>`.
Then a blank line. Fill every `{}`; drop a section the plan has nothing for.

```text
ASTRO {short feature title}

Implement {feature title} from this plan. Do not re-plan - the plan file is the spec.
Mode: {build|update}.

Plan (source of truth):
{absolute path to .cursor/plans/<slug>.plan.md}

Entry skill: `develop-feature` (it runs write-plan updates, prisma-schema-change, the
verify-and-review loop with the `reviewer` subagent, browser-qa and open-pr). Follow
AGENTS.md and .cursor/rules.

Branch: `{feature/<slug> | main for a small change}`.
Before edits:
  git fetch origin --prune
  If `{branch}` already exists: git switch {branch}
  Else: git switch main && git pull --ff-only && git switch -c {branch}
Never `git switch -c {branch} origin/main`. Show every commit message and wait for my
confirmation. Do not push unless I ask.

Locked decisions (do not re-ask):
- {decision}

Out of scope:
- {item}

{build: Implement every pending phase in order. Check off each step in the plan as it
lands; move Status to "In progress" now and to "Done" at the end.}
{update: Already done (do not redo unless the plan changed that step): {checked steps}.
Apply only: {unchecked steps + changelog entries after the last implementation}. Diff the
plan against the code before editing.}

Keep the same plan file current: checkboxes, Status, deviation notes, a changelog line
with the real date.

Gate on the final code: `npm run typecheck`, `npm run lint`, `npx next build` (never
`npm run build` - it pushes the schema and seeds the DB). Then the review loop: `/reviewer`
on the diff, fix valid CRITICAL/HIGH, re-check doubtful findings per
.cursor/skills/review-changes/references/recheck-finding.md, record rejected findings with
a reason, re-gate; at most 3 rounds.

Browser verification: ask me before starting `npm run dev` or driving Chrome. Journey:
{routes and states from the plan}, at 375 and 1024.

When done, reply with: files changed, gate output, review rounds (findings fixed /
rejected with reasons), browser-qa evidence, open questions, and the plan path.
```

## Gotchas

- Do not point the new chat at a `~/.cursor/plans/` copy - move the plan into
  `.cursor/plans/` first (see "Adopting or validating an existing plan").
- The personal `/plan-fresh-chat` skill also works here but adds doctronic lines
  ("never commit to main", platform prefixes, `web-develop`) that must be deleted by hand;
  this template is the repo-native version.
- Print the prompt in chat inside a `text` fence so it can be copied; a prompt saved only
  to a file is not a hand-off.
