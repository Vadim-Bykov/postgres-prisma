# Designing scripts for agentic use

When a skill bundles a `scripts/*.sh` (or `.py`, ...), the agent reads its stdout/stderr
to decide what to do next. A few choices make a script dramatically easier for an agent
to drive - and keep it portable across providers (the reason we prefer a skill-invoked
script or a `bin/` tool over a provider-only hook for anything that should work
everywhere).

## When to bundle vs. inline

- **Inline a one-off command** in `SKILL.md` when an existing tool does the job with a
  few flags (`npm run typecheck`, `npx skills-ref validate`). **Pin versions** for
  reproducibility and **state prerequisites** (e.g. "needs Node 18+, `pg_dump`").
- **Bundle a script** when the command grows complex enough to get wrong on the first
  try, or when the agent keeps reinventing the same logic across runs.

## Reference scripts by relative path

List them in `SKILL.md` so the agent knows they exist, then instruct it to run them.
Paths are relative to the skill directory root:

```markdown
## Scripts

- `scripts/scan.sh` - heuristic static scan of changed files (`--base <ref>`, `--all`).
```

## Design rules (make the script agent-friendly)

- **Never prompt interactively.** Agents run in non-interactive shells; a TTY prompt
  hangs forever. Take input via flags / env / stdin. Missing input -> exit with a clear
  usage error, not a prompt.
- **Document with `--help`** - a short description, the flags, and examples. This is how
  the agent learns the interface. Keep it concise (it enters the context window).
- **Structured output.** Prefer JSON/TSV over aligned text so the agent and `jq`/`cut`
  can parse it. **Data to stdout, diagnostics/progress to stderr** - so the agent captures
  clean output while still seeing warnings.
- **Helpful errors.** Say what went wrong, what was expected, what to try. An opaque
  error wastes the agent's next turn.
- **Idempotent + safe.** Agents retry. "Create if not exists" over "fail on duplicate".
  Gate destructive actions behind `--confirm`/`--dry-run`; database writes never happen
  from a kit script.
- **Meaningful exit codes**, documented in `--help`, so the agent can branch on them. Our
  convention (see `bin/git-guard`): 0 = allow/ok, a distinct code for a policy deny (10),
  2 for usage errors; scans exit 0 because hits are data, not failures.
- **Predictable output size.** Many harnesses truncate tool output past ~10-30K chars.
  Default to a summary; offer `--verbose` or an `--output FILE` for the full dump.

## Self-contained when it needs deps

Declare dependencies inline so there is no separate install step: Node via
`npx pkg@version`, Python via PEP 723 + `uv run`. Pin versions. Our bash scripts
(`bin/git-guard`, `scripts/backup-db.sh`, `.cursor/skills/review-changes/scripts/scan.sh`)
deliberately stick to POSIX tools + the repo's own toolchain (macOS bash 3.2: no
`mapfile`; BSD `grep -E`: no lookaheads) so they run anywhere without setup.

## Gotchas

- This repo uses **npm** (there is a `package-lock.json`); do not introduce pnpm/yarn
  commands or `just` recipes.
- A script that is only wired into a provider hook is not portable. If the behavior
  should work in Cursor and Claude Code, ship the logic in `bin/` or `scripts/` and keep
  the hook a thin adapter (`.cursor/hooks/git-guard.sh` -> `bin/git-guard`).
- The `afterFileEdit` prettier hook also formats Markdown: after editing a `.md` file
  through the agent, re-read it before the next search-and-replace (`*x*` becomes
  `_x_`, blank lines appear after headings).
