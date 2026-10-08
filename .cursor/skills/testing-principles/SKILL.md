---
name: testing-principles
description: >-
  Evidence-based testing principles for writing, reviewing, refactoring and deleting
  tests at any level (unit, component, integration, browser journey) in this repo
  (postgres-prisma). Owns the "why" - behavior vs implementation, whether a test should
  exist, which level to use, keep/rewrite/merge/delete decisions, mocking boundaries,
  snapshots, async waits. Use for decisions about test design, coverage, level choice,
  mocking, regression coverage, or whether a test should exist; the stack mechanics
  (Vitest + happy-dom + Testing Library, when added) live in the testing-standards rule.
metadata:
  author: vadim
  version: "1.0"
  adapted-from: "doctronic-monotronic skills/testing-best-practices v1.0"
---

# Testing Best Practices

Use this skill whenever you:

- write new tests;
- modify existing tests;
- review tests;
- refactor a test suite;
- fix a bug that needs regression coverage;
- decide whether a test should exist;
- choose between unit, component, integration, and E2E coverage.

## Objective

Maintain the smallest clear, reliable, maintainable test suite that gives strong confidence in meaningful application behavior.

Do **not** optimize for test count or coverage percentage.

## Project integration

This skill owns the **principles** — the _why_ behind a test: behavior vs
implementation, whether a test should exist, which level to use, and
keep/rewrite/merge/delete decisions. The concrete **mechanics** for this repo — the
stack (Vitest + happy-dom + Testing Library, once added), file placement, run commands,
mock boundaries (`@/lib/prisma`, `next/navigation`, `fetch`), selectors (Russian labels
and roles) — live in `.cursor/rules/testing-standards.mdc`, which is authoritative for
anything it specifies; defer to it and do not contradict it.

**Current state of this repo:** there is no test runner yet. Until one is added, the
"browser journey" level is the `browser-qa` skill (Chrome DevTools MCP), and
verification is `npm run typecheck` + `npm run lint` + `npx next build` + the observed
journey. The principles below still decide _what_ is worth testing when tests arrive -
start with the pure utils in `utils/`, service business rules with Prisma mocked, and
the RTK endpoint builders.

Coverage is a diagnostic, never the goal (see principle 3). Do not add tests to move a
number.

## References

This `SKILL.md` is the decision spine. Read the reference relevant to the task before
making a non-trivial call:

**General (apply at every level):**

- `references/principles.md` — the detailed technique catalog: regression tests, public
  interfaces, assert-results-over-interactions, mocking, UI selectors, async waits,
  isolation, snapshots, visual regression, clarity, DAMP, test data, logic-in-tests,
  cross-level duplication, risk-based emphasis, low-value code, execution strategy, and
  production changes during test work. **Open it whenever you touch one of those
  areas.**
- `references/google-unit-testing.md` — general test design, behavior vs implementation, public APIs, state vs interactions, clarity, brittleness, DAMP vs DRY.
- `references/google-test-doubles.md` — fakes, stubs, mocks, interaction testing, overspecification, dependency boundaries.
- `references/google-larger-testing.md` — choosing test scope and when broader integration/system tests are justified.
- `references/testing-smells.md` — practical checklist for identifying low-value, duplicate, brittle, or misleading tests (concepts are general; some examples are web-flavored).

**React UI tests — load when writing/reviewing component tests:**

- `references/web/testing-library.md` — React Testing Library: component/UI testing from the user's perspective and semantic querying (the query philosophy the UI-testing sections build on). The kernel — test like a user, not internals — is already in principle 1.
- The repo mechanics (runner, pragma, file placement, what to mock) are in `.cursor/rules/testing-standards.mdc`.

Framework-specific documentation may refine mechanics, but it should not override these principles without a concrete reason.

---

# Core principles

## 1. Test behavior, not implementation

Tests should protect observable behavior, public contracts, business rules, edge cases, regressions, and meaningful side effects.

Prefer testing:

- returned values;
- rendered output that matters to users;
- state visible through public interfaces;
- persisted results;
- meaningful external side effects;
- user flows;
- public API contracts.

Avoid testing:

- private functions solely because they exist;
- internal component state;
- exact internal call sequences unless the interaction itself is the contract;
- incidental DOM structure;
- CSS classes or generated selectors;
- framework/library behavior;
- implementation choices that may change during harmless refactors.

A behavior-preserving refactor should normally not require unrelated test changes.

## 2. Every test needs a reason to exist

Before creating or preserving a test, identify the behavior or risk it protects.

A useful test should protect at least one meaningful thing, such as:

- business rule;
- user-visible behavior;
- public contract;
- boundary condition;
- error state;
- permission/authentication behavior;
- data transformation;
- production regression;
- integration between important components;
- critical asynchronous behavior;
- accessibility behavior;
- destructive operation;
- security-sensitive behavior.

If no meaningful behavior or risk can be identified, question whether the test should exist.

Ask:

> What realistic bug would this test catch?

If there is no credible answer, reconsider the test.

## 3. Prefer meaningful confidence over maximum coverage

Coverage is a diagnostic tool, not the objective.

Do not create tests merely because a function, branch, component, prop, or line exists.

When uncovered code appears, ask whether it contains meaningful unprotected behavior. Test that behavior if it does. Do not manufacture tests solely to raise a percentage.

---

# Choosing the test level

Use the smallest and cheapest level that provides realistic confidence in the behavior.

| Level                       | Prefer for                                                                    | Examples                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit**                    | isolated logic; fast and deterministic                                        | pure logic, calculations, transformations, parsers, validators, domain/business rules, state machines, algorithms                         |
| **Component / integration** | confidence that depends on several pieces collaborating                       | UI + state, form validation + rendering, component + hook, API handler + business logic, several modules working together                 |
| **E2E**                     | a limited set of important real user flows where full app integration matters | authentication, onboarding, checkout/payment, critical create/edit/delete, permissions, cross-page navigation, workflows spanning systems |

- **Unit** — do not isolate code merely to call the result a unit test.
- **Component / integration** — prefer this over forcing collaboration into a unit test.
- **E2E** — do not reproduce every lower-level scenario as E2E coverage.

Overlap between levels is justified only when each level protects a meaningfully different risk.

There is no required unit/integration/E2E percentage.

For E2E / visual work there is no principle reference here — the principles in this
skill's body (test-level choice, isolation, wait-on-condition, visual regression,
duplication across levels) apply directly, and the concrete browser-journey mechanics
live in the `browser-qa` skill (Chrome DevTools MCP, journeys, report template).

---

# Writing new tests

Before adding a new test:

1. Identify the behavior being introduced or changed.
2. Search existing tests for coverage of that behavior.
3. Identify meaningful behavior partitions and boundaries.
4. Choose the cheapest realistic test level.
5. Decide what observable result proves correctness.
6. Add the minimum tests necessary to protect those behaviors and risks.

Do not automatically create one test per method, branch, prop, component, or code path.

## Behavior partitions

Separate tests are justified when inputs represent different behaviors or risks, for example:

- valid / invalid input;
- empty input;
- minimum / maximum boundary;
- authenticated / unauthenticated;
- authorized / unauthorized;
- success / expected failure;
- loading / empty / populated state;
- idempotent / repeated operation;
- first attempt / retry behavior.

Equivalent values are not separate behaviors unless they exercise different logic.

For example, testing `John`, `Alice`, and `Bob` separately is usually redundant if all three exercise exactly the same behavior.

---

# Reviewing and refactoring existing tests

Do not assume every existing test deserves to remain.

Understand what a test protects before changing or deleting it.

Classify existing tests internally as:

- `KEEP`
- `REWRITE`
- `MERGE`
- `DELETE`

## KEEP

Keep a test when it protects a distinct meaningful behavior or risk and already tests it at an appropriate level.

## REWRITE

Rewrite when the underlying behavior is important but the test is:

- coupled to implementation details;
- brittle under harmless refactors;
- excessively mocked;
- difficult to understand;
- dependent on incidental DOM structure;
- using arbitrary timing;
- checking internal interactions instead of meaningful outcomes;
- using weak selectors;
- using overly broad snapshots;
- doing too much setup or test-side logic.

Preserve the behavioral protection while improving how the test expresses it.

## MERGE

Merge tests when several tests protect effectively the same behavior and risk.

Do not merge tests merely because setup is similar.

Keep separate cases when they represent different boundaries, permissions, states, failures, regressions, or other meaningful partitions.

## DELETE

A test is a deletion candidate when it:

- duplicates behavior already protected without adding another risk signal;
- mirrors the production implementation;
- primarily tests framework/library behavior;
- verifies trivial implementation details;
- checks something with no meaningful contract;
- only verifies mock calls that are not themselves important behavior;
- would continue passing while the actual intended behavior is broken;
- exists only to increase coverage;
- repeats equivalent input examples;
- asserts incidental structure rather than meaningful behavior.

Before deletion, verify that meaningful protection remains elsewhere or that the behavior was never worth protecting directly.

Never delete a test solely because another test touches the same production code.

Compare behaviors and risks, not line coverage.

Regression tests are the sharpest exception here — treat them conservatively; see
**Regression tests** in `references/principles.md` before deleting one.

---

# Detailed techniques

The techniques that support the decisions above — regression handling, public
interfaces, assert-results-over-interactions, mocking, UI selectors, async waits,
isolation, snapshots, visual regression, clarity, DAMP, test data, logic-in-tests,
cross-level duplication, risk-based emphasis, low-value code, execution strategy, and
production changes during test work — live in **`references/principles.md`**. Read the
relevant section there before making a non-trivial call in that area; the repo
mechanics each one maps to are in `.cursor/rules/testing-standards.mdc`.

---

# Gotchas

The recurring, non-obvious mistakes this skill exists to prevent:

- **Writing tests to move a coverage number.** A test with no realistic bug it would
  catch is noise — delete-worthy on sight (principle 3).
- **Deleting a test because another touches the same production code.** Coverage
  overlap is not protection overlap; compare _behaviors and risks_, not lines. And
  never delete a **regression** test without confirming the failure mode is now
  impossible or protected elsewhere.
- **Asserting internal call sequences / over-mocking.** `A called B called C` breaks on
  harmless refactors and often validates a fictional topology. Assert the observable
  result; justify interaction assertions by contract only.
- **Arbitrary sleeps for async.** `sleep(1000)` / fixed timeouts are flaky by
  construction — wait on the real observable condition.
- **Broad snapshots as the default assertion.** A snapshot nobody would inspect on
  change is not a test — prefer focused behavioral assertions.
- **Reproducing the production algorithm in the test** to compute the expected value —
  the test then passes even when the code is wrong. Write expected values explicitly.
- **Testing the framework/library** instead of your behavior.
- **Renaming or removing an existing test id** to make a selector pass — never do this;
  it silently breaks other tests and analytics.

## Personal data guardrail

Never put **real** user data (names, emails, payment numbers, reset links, tokens) in
fixtures, snapshots, recorded requests, or test logs — synthesize obviously-fake data
instead (`user@example.com`). A fixture or a logged request body that captures a real
customer is a leak that ships in the repo. Tests never hit the real Postgres database or
send real email (see `testing-standards.mdc`).

---

# Required decision process for new tests

Before writing a test, determine:

**BEHAVIOR** — What guarantee are we protecting?

**RISK** — What realistic failure would this catch?

**LEVEL** — What is the cheapest realistic test level?

**EXISTING COVERAGE** — Is another test already protecting this risk?

**BOUNDARY** — What real system/public boundary should the test exercise?

**ASSERTION** — What externally observable result proves correctness?

Only then write the test.

---

# Required decision process for existing tests

Before removing or substantially changing an existing test, determine:

**INTENT** — What was this test intended to protect?

**ACTUAL PROTECTION** — What failure would it currently detect?

**OVERLAP** — Is the same risk protected elsewhere?

**BRITTLENESS** — Would an ordinary behavior-preserving refactor break it?

**VALUE** — Does its confidence justify its maintenance cost?

Then choose `KEEP`, `REWRITE`, `MERGE`, or `DELETE`.

---

# Final checklist

Before considering test work complete, verify:

- [ ] tests protect meaningful behavior rather than incidental implementation;
- [ ] important edge cases and regressions remain protected;
- [ ] redundant tests were not added or accidentally preserved without reason;
- [ ] mocks/test doubles are justified;
- [ ] assertions verify meaningful outcomes;
- [ ] tests are deterministic and independently runnable;
- [ ] test names communicate behavior;
- [ ] arbitrary waits are absent;
- [ ] UI selectors are resilient and user-oriented where possible;
- [ ] snapshots are intentional and focused;
- [ ] deleted tests did not remove unique meaningful protection;
- [ ] new tests would realistically catch a bug;
- [ ] affected tests pass;
- [ ] unexecuted broader suites or unresolved risks are reported explicitly.
