# Writing descriptions that trigger

The `description` carries the **entire burden of activation**. At discovery the agent
sees only `name` + `description`; if it does not convey _when_ the skill helps, the skill
never loads. Under-specified -> misses real tasks; over-broad -> fires on the wrong ones.

## What a good description does

- **Says what it does AND when to use it.** Both halves, every time.
- **Frames it as an instruction to the agent.** Lean toward "Use when you ..." / "Use
  after ..." over a dry "This skill does ...". The agent is deciding whether to act.
- **Targets user intent, not internals.** Describe what the user is trying to achieve
  and the words they would actually type - not the mechanism.
- **Names the repo.** User-level skills from other projects are visible here too
  (`plan`, `web-review`, `create-pr`, ...). "in this repo (postgres-prisma)" is what
  makes the agent pick the local skill over the doctronic one.
- **Is pushy about scope.** List the contexts it applies to, including ones where the
  user will not name the domain: "... even if they just say 'make sure it works'".
- **Stays concise and <= 1024 chars.** A few sentences. It competes for context across
  every skill at startup.

## House pattern

One sentence of _what it does_ (with the concrete nouns - the stack, the file set, the
artifacts, and "this repo"), then a "Use when ..." sentence packed with **real trigger
phrases** (build/add/implement/review/fix ...), then any pairing ("as the verify step of
develop-feature").

```yaml
# Weak - mechanics only, no triggers
description: Helps with database changes.

# Strong - what + when + triggers + pairing
description: >-
  Safely change the Prisma schema in this repo (Prisma 6 + Vercel Postgres, `prisma db
  push` workflow): confirm which database the env points at, take a pg_dump backup,
  edit prisma/schema.prisma, run format / generate / db push, then update models, DTOs,
  services, RTK types and the seed. Use when adding or changing a model, field, enum or
  relation, when asked about migrations / db push / schema sync, or before any command
  that writes to the database schema.
```

## A quick self-check before you ship a description

- Would the developer's natural phrasing of the task contain a word that is in here?
- Does it name a _near-miss_ it should NOT swallow (so it stays precise)? E.g.
  `fix-bug` vs `develop-feature`; `review-changes` (conventions) vs `browser-qa` (does it
  work).
- Is it under 1024 chars? (Descriptions grow during editing - recount.)

## Optional: the trigger eval loop (when activation matters and you can invest)

1. Write ~20 realistic queries labelled `should_trigger` true/false - 8-10 each way. Vary
   phrasing, explicitness, detail and step count. The most useful positives are ones
   where the skill helps but the link is not obvious; the most useful negatives are
   **near-misses** that share keywords but need something else.
2. Run each query a few times (model behavior is nondeterministic); compute a trigger
   rate per query. Positive passes if rate > 0.5; negative passes if < 0.5.
3. Split queries ~60/40 into train/validation. Tune the description against the train
   set only; pick the version with the best **validation** pass rate. Stop after ~5
   iterations.
4. Do not paste failed-query keywords in verbatim (overfitting) - generalize the
   _category_ they represent.

## Gotchas

- Agents typically only consult skills for tasks that need capability _beyond_ what they
  can already do. A trivially simple matching request may not trigger even a perfect
  description - that is expected, not a description bug.
- A description that lists every keyword reads as spam and triggers on near-misses.
  Precision (naming the boundary) matters as much as recall.
