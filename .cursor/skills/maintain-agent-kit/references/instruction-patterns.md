# Patterns for effective skill instructions

Reusable techniques for the `SKILL.md` body. Not every skill needs all of them - use
what fits. The through-line: **match specificity to fragility**, and spend words only on
what the agent would otherwise get wrong.

## Calibrate control

- **Flexible task, multiple valid approaches** -> describe _what_ to achieve and _why_;
  let the agent choose the _how_ (e.g. "check every protected route reads the cookie",
  not a rigid click-by-click).
- **Fragile task, order matters** -> give the exact command and forbid edits: "Run
  exactly `npm run db-backup` before `npx prisma db push`. Don't add flags."
- **Defaults, not menus.** One recommended tool/path + a brief escape hatch. Five equal
  options make the agent dither and try several before one works.
- **Procedures over declarations.** Teach the method for the _class_ of problem, not the
  answer to one instance - so the skill generalizes.

## Gotchas sections (highest value)

A list of environment-specific facts that defy reasonable assumptions - concrete
corrections to mistakes the agent _will_ make, not general advice. Keep them in
`SKILL.md` (the agent must read them _before_ hitting the situation). This is where the
hardest-won knowledge lives. Examples of the genre from this repo:

```markdown
## Gotchas

- `npm run build` runs `prisma db push && prisma db seed` against the configured
  database - use `npx next build` as the local verify step.
- `ApiError.badRequest(...)` returns a `NextResponse`; services `throw` it and handlers
  must `return apiCatchErrorHandler(...)`, or the client gets a 500 instead of the message.
- `isAuthorized` is `undefined` until `GET /api/auth` resolves - gate on `!== undefined`
  before redirecting, or every protected page flashes to `/`.
```

**When you correct the agent during a real task, add the correction here.** That one
habit improves a skill faster than anything else.

## Output templates

When the skill must produce a specific format, give a concrete template - agents
pattern-match against structure far better than against prose. Short templates inline;
long/optional ones in `assets/` (loaded only when needed). The `review-changes` findings
table and the `browser-qa` report are examples.

## Checklists for multi-step work

An explicit checklist helps the agent track progress and not skip gated steps:

```markdown
## Workflow

- [ ] Read the schema + existing routes (never invent a contract)
- [ ] Implement service -> route handler -> RTK endpoint -> UI
- [ ] Run `npm run typecheck` + `npm run lint` + `npx next build` (must be green)
- [ ] Observe the flow with browser-qa
- [ ] Review the diff (review-changes)
```

## Validation loops

Have the agent check its own work and iterate until it passes: do the work -> run a
validator (a script, or a reference checklist) -> fix -> repeat. "Run `npm run typecheck`;
if it fails, read the error, fix, re-run; only proceed when green" beats a one-shot "run
the checks".

## Plan-validate-execute (for batch / destructive work)

Have the agent produce an intermediate plan in a structured format, validate it against a
source of truth (the Prisma schema, the route files, the rules), then execute. The
validation step is what makes it reliable - it gives the agent a specific error it can
self-correct from ("field X not in `prisma/schema.prisma` - available: ...") instead of
guessing. `write-plan` + its `validation-checklist.md` is this pattern.

## Bundle a script when you see reinvention

If, across runs, the agent keeps re-deriving the same logic (parsing a format, building
the same check), write a tested `scripts/*.sh` once and reference it. See
`references/scripts.md` for how to make it agent-friendly.
