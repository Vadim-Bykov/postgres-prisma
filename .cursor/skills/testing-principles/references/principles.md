# Testing principles — detailed technique reference

The decision spine (core principles, level choice, the write/review processes, and the
decision checklists) lives in `SKILL.md`. This file holds the detailed technique
catalog those decisions draw on — read the relevant section before making a non-trivial
call in that area.

---

# Regression tests

Treat known regression tests conservatively.

A regression test for a real production bug may look unusual or redundant while protecting a historical failure mode.

Before deleting it, determine:

- what bug it originally protected;
- whether that failure is still possible;
- whether another test now protects the same regression.

Prefer making regression intent explicit over removing an apparently strange test.

---

# Public interfaces

Prefer exercising a unit through the same stable interface used by real consumers.

Avoid directly testing private helpers when their behavior is already observable through a public interface.

A helper that exists only as an implementation detail usually does not need its own direct tests.

Reusable libraries and genuinely public utilities can reasonably have direct tests of their public APIs.

---

# Assert results over internal interactions

Prefer:

`action -> observable result`

over:

`action -> internal A called -> internal B called -> internal C called`

Strong assertions often verify:

- the expected value is returned;
- the user sees the saved result;
- persisted state changed;
- the correct error appears;
- a public contract is satisfied.

Interaction assertions are appropriate when the interaction itself is part of the required behavior, for example:

- an analytics event must be emitted;
- an email must be sent;
- an external payment operation must happen exactly once;
- a destructive operation must not execute twice;
- explicit caching behavior depends on call count.

Do not ban interaction assertions categorically; justify them by contract.

---

# Mocking and test doubles

Read `google-test-doubles.md` for non-trivial mocking decisions.

Prefer, when practical:

1. real implementation;
2. lightweight fake;
3. stub;
4. interaction-heavy mock.

Mock boundaries rather than arbitrary internal modules.

Good candidates include:

- third-party APIs;
- network services;
- time;
- randomness;
- external infrastructure;
- OS/browser APIs that cannot reasonably run in the test.

Be skeptical of mocking:

- pure internal functions;
- simple value objects;
- most of the code inside the same feature;
- every dependency merely to make a unit test possible.

If a test requires extensive internal mocking, reconsider the test boundary. It may be validating a fictional topology rather than the real application.

The concrete module boundaries to mock (and the ones you must never mock) are
platform-specific — see the platform integration reference (**Mocking boundaries** in
`web/integration.md` for the web).

---

# UI testing

For web component/UI work, read `web/testing-library.md` (React Testing Library).

Interact with the UI in ways that resemble real usage.

Prefer selectors in roughly this order when applicable:

1. role + accessible name;
2. label;
3. visible text;
4. other user-visible semantics;
5. test id when no suitable user-facing selector exists — never rename or remove an
   existing one to satisfy a test. (The concrete test-id attribute/query is
   platform-specific — see the platform integration reference.)

Avoid relying on:

- CSS classes;
- generated class names;
- DOM hierarchy;
- internal component names;
- implementation-specific selectors.

Test what the user observes after an interaction rather than internal component state.

Accessibility-oriented queries are valuable because they often align test selectors with real user semantics.

---

# Async tests

Never use arbitrary sleeps as the normal synchronization mechanism.

Avoid fixed waits such as:

- `sleep(1000)`;
- `waitForTimeout(2000)`;
- arbitrary polling delays.

Wait for the actual observable condition:

- expected element appears;
- request completes;
- UI state changes;
- control becomes enabled;
- expected event/state is reached.

The concrete wait-on-condition primitives (and the anti-patterns to avoid) are
platform-specific — see the platform integration reference (**Async synchronization**
in `web/integration.md` for the web).

Async tests must remain deterministic.

---

# Test isolation

Tests should be independently runnable.

A test must not depend on another test running first.

Avoid shared mutable state between tests.

Tests should produce the same result regardless of:

- execution order;
- parallel execution;
- previous tests;
- local developer state.

Reset or recreate state where necessary.

---

# Snapshots

Do not use snapshots as the default assertion mechanism.

Snapshots are appropriate when the serialized or visual representation itself is an intentional contract.

Avoid large snapshots containing mostly incidental markup.

Ask:

> Would a developer intentionally inspect this entire diff if the snapshot changed?

If not, prefer focused behavioral assertions.

Small focused snapshots are acceptable when they make an intentional contract clearer.

---

# Visual regression tests

Visual tests protect visual behavior rather than application logic.

Use them intentionally for:

- layout;
- design-system components;
- responsive states;
- complex visual states;
- visual rendering regressions.

Baselines must come from a known-good running application/environment.

Never invent expected screenshots.

Keep visual environment variables stable where possible, including browser, viewport, fonts, OS/container, and relevant data.

Do not use visual snapshots as a substitute for behavioral assertions.

---

# Test clarity

Tests should be understandable without reconstructing large amounts of hidden setup.

Prefer a clear structure such as:

- Given / When / Then; or
- Arrange / Act / Assert.

A test should normally protect one primary behavior.

Name tests after behavior and expected result.

Prefer:

`shows validation error when email is invalid`

Avoid vague names such as:

`testEmail`

Prefer straightforward test code over clever abstractions.

---

# DAMP over excessive DRY

Test code does not need to eliminate all duplication.

Some duplication is preferable when it makes each test easier to understand.

Extract helpers when they remove irrelevant noise.

Do not extract so aggressively that understanding a test requires jumping through several helper layers.

Tests should be descriptive and meaningful first, DRY second.

---

# Test data

Use the smallest data necessary to communicate the behavior.

Make behavior-relevant values explicit in the test.

Avoid large generic fixtures when a small object communicates intent more clearly.

Builders/factories are useful when they provide sensible defaults while keeping behavior-relevant fields visible.

---

# Avoid logic inside tests

Tests should be easy to verify by inspection.

Avoid unnecessary:

- loops;
- conditions;
- transformations;
- calculations;
- dynamic expected-value generation.

Do not reproduce the production algorithm inside the test to calculate the expected answer.

Expected values should normally be explicit and obvious.

Parameterization is appropriate when it clearly represents multiple meaningful cases and stays readable.

---

# Duplication across testing levels

Do not mechanically duplicate every scenario at unit, component, integration, and E2E levels.

Ask what failure each level would catch.

Some overlap is useful when:

- a narrow test cheaply pinpoints a business rule;
- a broader test verifies that the real pieces integrate correctly.

Overlap without an additional risk signal is usually unnecessary.

---

# Risk-based emphasis

Apply stronger coverage to areas such as:

- money;
- permissions;
- authentication;
- destructive actions;
- irreversible operations;
- data migrations;
- validation boundaries;
- concurrency;
- security;
- critical user flows;
- complex business rules.

Test effort should roughly follow risk, not code size.

---

# Code that often needs little or no direct testing

Be skeptical of direct tests for:

- constants;
- trivial getters/setters;
- simple pass-through wrappers;
- static markup with no meaningful product contract;
- framework-provided behavior;
- third-party library behavior;
- private helpers already protected through meaningful public behavior.

Exceptions are valid when these elements encode an important product contract or regression risk.

---

# Execution strategy

During normal development or targeted refactoring, run the smallest useful test scope first.

Prefer:

- current test;
- current test file;
- current module/feature;
- tests related to changed source files.

Do not repeatedly run the entire repository test suite after every edit.

For large test-suite refactors, work incrementally:

`module/feature -> inspect -> classify -> modify -> run affected tests -> continue`

Run broader validation at meaningful milestones and before completion when feasible.

The concrete iterate-a-single-file commands and the full merge gate are
platform-specific — see the platform integration reference (**Execution strategy** in
`web/integration.md` for the web). Don't claim done on a partial run.

## Default local time budget

For one focused batch, avoid spending more than about 10 minutes on local test execution/debugging unless the task explicitly requires deeper investigation.

If one test consumes disproportionate time:

1. identify the likely cause;
2. determine whether the test is brittle or at the wrong level;
3. record unresolved risk;
4. avoid expanding into unrelated refactors;
5. continue when appropriate.

Never hide unresolved failures.

---

# Production changes during test work

Do not change production behavior solely to make an existing test pass.

First determine whether:

- production behavior is wrong;
- the test is wrong;
- the test is coupled to implementation details;
- the expected contract changed.

Changing production structure for testability can be appropriate when intended behavior is preserved.

If a legitimate behavioral test exposes a real bug, production changes may be appropriate when bug fixing is in scope.

---

# Reference philosophy

Primary conceptual sources:

- _Software Engineering at Google_ — Unit Testing, Test Doubles, Larger Testing.
- Testing Library — Guiding Principles and query philosophy.
- Playwright — Best Practices.

Use these references as principles, not as a reason to copy patterns mechanically. The goal is confidence in real behavior with low maintenance cost.
