---
name: maintain-agent-kit
description: >-
  House guide for maintaining this repo's agent kit - AGENTS.md, the rules in
  .cursor/rules/*.mdc, the skills in .cursor/skills/<name>/SKILL.md (Agent Skills format),
  the hooks (prettier, git-guard) and where each kind of guidance belongs. Use when
  adding or editing a rule or skill, writing a skill description, deciding whether
  something should be a rule vs a skill vs a hook, folding a correction into the kit, or
  re-syncing a vendored skill (modern-web-guidance).
paths: ".cursor/**,AGENTS.md,CLAUDE.md,bin/**"
metadata:
  author: vadim
  version: "1.0"
  adapted-from: "doctronic-monotronic skills/authoring-skills v2.0"
---

# Maintaining the agent kit

The kit is small on purpose. Every always-on line competes for context with the task at
hand, so each addition must earn its place: **add what the agent lacks, omit what it
knows.**

## Where things live

- `AGENTS.md` (repo root) - the constitution: stack, map, commands, env names, universal
  rules, git/PR policy, tooling. Always loaded (Cursor, Claude Code via `CLAUDE.md`,
  other agents). Keep it under ~150 lines.
- `.cursor/rules/*.mdc` - conventions by concern, loaded by file type through `globs`
  (`development-standards` is the only `alwaysApply: true` rule). A rule states _how we
  write code here_; it quotes real code shapes from this repo.
- `.cursor/skills/<name>/SKILL.md` - workflows the agent follows (plan, develop, review,
  QA, PR, schema change). Depth goes into `references/`, runnables into `scripts/`.
- `.cursor/hooks.json` + `.cursor/hooks/*.sh` - deterministic enforcement on events
  (prettier after edits, `bin/git-guard` before git commands).
- `.cursor/agents/<name>.md` - thin subagents that drive a skill in their own context
  (today only `reviewer`, read-only, runs `review-changes`). They invoke skills, never
  re-encode them. Each harness has its own frontmatter, so the agent exists twice with the
  same body: `.cursor/agents/reviewer.md` (`readonly: true`) and
  `.claude/agents/reviewer.md` (`tools: Read, Grep, Glob, Bash`, `skills: [review-changes]`).
  Cursor also reads `.claude/agents/` but prefers `.cursor/agents/` on a name clash. Keep
  the two bodies in sync when you edit one.
- `.cursor/plans/` and `.cursor/_archive/` are gitignored local state; everything else in
  `.cursor/` is versioned.
- `.claude/` mirrors the kit for Claude Code and holds no content of its own:
  `.claude/skills/<name> -> ../../.cursor/skills/<name>` and
  `.claude/rules/<name>.md -> ../../.cursor/rules/<name>.mdc` (relative symlinks,
  committed), `.claude/hooks/git-guard.sh` (PreToolUse adapter for `bin/git-guard`) and
  `.claude/settings.json` (the hook + empty `attribution`, so Claude Code adds no
  `Co-Authored-By` trailer). `.claude/settings.local.json` is gitignored.
- Claude Code reads only `paths` from a rule's frontmatter and ignores `globs`, so every
  glob-scoped `.mdc` carries both: Cursor's `globs:` and a Claude `paths:` with the same
  patterns, both as quoted comma-separated strings (the form the Cursor docs document; a
  YAML list gets reflowed by prettier through the `.md` symlink). A rule with neither
  loads at launch in both tools. Claude Code also honours `paths` on skills (same format).
- Name precedence in Claude Code: a personal skill in `~/.claude/skills` beats a project
  skill with the same name - another reason project skill names must not collide with
  the doctronic set.
- User-level rules (`~/.cursor/rules`) and skills apply here too. Do not duplicate them;
  when one conflicts with this repo (doctronic PR template, analytics taxonomy), state the
  repo-specific policy in `AGENTS.md` instead of copying the global file.

## Rule vs skill vs hook

- **Rule** - a convention that must shape every edit of a file type (imports, data layer,
  Tailwind, copy, API shape). Short, declarative, with one real example per pattern.
- **Skill** - a multi-step procedure with judgment (plan, review, QA, schema change). Has
  a workflow, guardrails and a Gotchas section. Composes sibling skills by name instead
  of re-encoding them.
- **Subagent** - a delegatable role that needs its own context window (a reviewer that
  must not share the implementer's assumptions, a parallel verifier). Thin: it loads a
  skill and adds only the role's rules (read-only, what to return).
- **Hook** - enforcement that must always happen and needs no judgment (format on save,
  block force-push). Portable logic in `bin/` or `scripts/`, thin adapter in
  `.cursor/hooks/`.

## SKILL.md rules (Agent Skills spec - enforce these)

- `name`: `[a-z0-9-]`, no leading/trailing/double hyphen, **equals the folder name**,
  and **does not collide with a user-level skill** visible in this workspace (`plan`,
  `web-review`, `create-pr`, `testing-best-practices`, `authoring-skills` are taken -
  hence `write-plan`, `review-changes`, `open-pr`, `testing-principles`,
  `maintain-agent-kit`). Exception: `modern-web-guidance` is vendored under its upstream
  name on purpose.
- `description`: what it does **and** when to use it, with trigger phrases a user would
  type, mentioning this repo. It is the only thing loaded at discovery - make it earn
  activation. Craft: `references/descriptions.md`.
- Body under ~500 lines. Reference files one level deep, each with a stated trigger
  ("read X when Y"), not a generic "see references".
- Optional `metadata` (`author`, `version`, `adapted-from` for ported skills), `license`
  for vendored content.

## House conventions

- **Teach discovery, not snapshots.** Point at the live files to copy
  (`app/account/bonuses/*`, `server/services/bonusService.ts`) rather than freezing code
  that will drift. Quote a shape, not a whole file.
- **Ground in this repo.** New rules come from real code, review findings and corrections
  - not from generic best-practice articles and not from the doctronic kit's stack
    (no TanStack, Zustand, CSS Modules, Sentry, Clerk, `src/` here).
- **Generic web-platform rules are `modern-web-guidance`'s.** Rules and skills state the
  repo delta (tokens, `cn()`, Russian copy, auth protocol) and cite the guide.
- **Known debt is named once** (in the rubric's "Known gaps" and the rules) so reviews do
  not re-flag it; when debt is fixed, remove it from those lists.
- **Fold corrections into Gotchas.** When the developer corrects the agent, the fix goes
  into the relevant skill's Gotchas or the rule - that is the main way the kit improves.
- **Calibrate control.** Prescriptive where fragile (database commands, git, error
  protocol); freedom where several approaches are fine (component composition). Defaults,
  not menus. Patterns: `references/instruction-patterns.md`.
- **Scripts** are read-only by default, have `--help`, split stdout/stderr, exit 0 for
  "hits are data" and non-zero only for usage errors: `references/scripts.md`.

## Checklist for a change to the kit

- [ ] Right home (AGENTS.md / rule / skill / hook) and no duplicate of a global rule.
- [ ] Rule frontmatter: `description`, and either `alwaysApply: true` or `globs` plus the
      matching Claude `paths:` string.
- [ ] New skill or rule also gets its `.claude/` symlink:
      `ln -s ../../.cursor/skills/<name> .claude/skills/<name>` or
      `ln -s ../../.cursor/rules/<name>.mdc .claude/rules/<name>.md`; a removed one has its
      link removed (`find .claude -type l ! -exec test -e {} \; -print` lists broken links).
- [ ] Skill: folder == `name`, no name collision, description passes the user-intent test,
      references exist and have load triggers, Gotchas present where mistakes are likely.
- [ ] Examples quote this repo's real code; no doctronic stack leftovers.
- [ ] `npx -y skills-ref validate .cursor/skills/<name>` passes. One expected warning:
      `paths` is a Cursor / Claude Code extension, not part of the open Agent Skills spec,
      so the validator reports it as unexpected on skills that use it. Write it as a
      comma-separated string (`paths: "prisma/**,lib/prisma.ts"`): the docs accept a YAML
      list too, but several Claude Code versions silently ignored the list form
      (anthropics/claude-code issues #17204, #19377), and the string form is what both
      tools are verified to read.
- [ ] Hooks: `bash bin/git-guard-test` still green after a guard change; the adapter
      smoke (`printf '{"command":"git push --force"}' | .cursor/hooks/git-guard.sh`)
      returns `deny`.
- [ ] Smoke-test by triggering the skill on a real task; read the trace, then revise.

## Vendored content

`modern-web-guidance` is copied from the upstream GoogleChrome skill (Apache-2.0, LICENSE
kept) with `DISABLE_TELEMETRY=1` on its `npx` lines. To refresh: copy the latest upstream
`SKILL.md` and re-apply only that prefix; never hand-edit the `search`/`retrieve`
commands or the `--skill-version` flag.

## References

- `references/descriptions.md` - writing a description that triggers reliably. Load when
  writing or fixing a skill description.
- `references/instruction-patterns.md` - Gotchas sections, output templates, checklists,
  validation loops, calibrating control. Load when a skill body feels vague or bloated.
- `references/scripts.md` - designing `scripts/*.sh` for agentic use. Load when adding a
  script.
