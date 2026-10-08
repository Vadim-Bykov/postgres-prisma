# Testing Library — UI Testing Principles

Primary sources:
https://testing-library.com/docs/guiding-principles/
https://testing-library.com/docs/queries/about/

Use this reference for React/component/UI tests.

## Core principle

Tests should resemble the way the software is used.

Confidence increases when tests interact with the same visible/accessibility surfaces that users interact with rather than component instances or internal implementation state.

## Test DOM/user behavior, not component internals

Prefer interacting with rendered DOM behavior.

Avoid tests centered on:

- component instances;
- internal state variables;
- lifecycle/internal hooks;
- private methods;
- implementation-only component structure.

A UI refactor that preserves user-visible behavior should normally preserve the test.

## Query priority

Prefer queries that reflect user-facing/accessibility semantics.

Typical order:

1. role + accessible name;
2. label text;
3. placeholder/text where appropriate;
4. display value / alt text / title where semantically appropriate;
5. test id as a fallback.

`getByRole` is often the strongest default because it aligns with accessibility semantics and how users identify controls.

## Test IDs

Test IDs are acceptable when no suitable semantic/user-facing selector exists, but they should not be the default.

Prefer stable product semantics over implementation-specific selectors.

## Avoid CSS/DOM-shape coupling

Avoid selecting elements by:

- generated class name;
- `.parent > div:nth-child(2)` style structure;
- internal wrapper hierarchy;
- styling-only attributes.

These selectors often break without behavior changing.

## Interact like a user

Prefer realistic user-event interactions where practical.

After an action, assert what the user can observe:

- message appears;
- button becomes disabled/enabled;
- result is rendered;
- validation appears;
- navigation/flow changes;
- data appears or disappears.

Do not assert internal state updates merely because they happened.

## Accessibility semantics are useful contracts

Queries based on roles, labels, and accessible names can catch accessibility regressions while also making tests more resilient.

If an element cannot be found in a semantic way, first consider whether the UI itself is missing appropriate semantics before adding a test-only selector.

## Async UI behavior

Use asynchronous queries/waits that track the expected UI state.

Wait for meaningful conditions instead of fixed time delays.

Examples:

- find an element that should appear;
- wait for an element to disappear;
- wait for an assertion tied to actual UI state.

## Avoid testing framework mechanics

Do not test that React itself:

- calls event handlers;
- renders basic elements;
- propagates ordinary DOM events;
- implements standard component behavior.

Test what your application does with those mechanisms.

## Component vs integration boundary

Do not over-mock every child or hook merely to make a component “unit test.”

If several small pieces naturally work together to produce a user-visible behavior, a component/integration test can provide stronger confidence with less coupling.

Mock external boundaries when needed, not arbitrary internals.

## Review questions

For each UI test ask:

1. Does it behave like a user or inspect internals?
2. Are selectors based on user-facing semantics?
3. Would harmless DOM refactoring break it?
4. Does the assertion verify a meaningful visible result?
5. Is the test mocking internal UI pieces unnecessarily?
6. Is this behavior already covered by another test?
7. Would a user-visible regression make this test fail?

## Common rewrite examples

Weak:

- assert `setState` was called;
- select `.submit-button`;
- assert wrapper count;
- snapshot an entire page for simple behavior;
- mock every child component.

Stronger:

- click the button by role/name;
- assert the saved state/message/output visible to the user;
- keep only focused snapshots when visual/serialized output is the contract.
