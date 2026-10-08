# Google — Test Doubles

Primary source:
https://abseil.io/resources/swe-book/html/ch13.html

Source: _Software Engineering at Google_, Chapter 13 — Test Doubles.

Use this reference when deciding whether to use a fake, stub, mock, spy, or real implementation.

## Core idea

Test doubles are useful tools, but they create costs and can make tests less realistic or more coupled to implementation.

Use them deliberately rather than by default.

## Prefer realistic dependencies when practical

If a dependency is fast, deterministic, local, and easy to use, using the real implementation can provide stronger confidence and simpler tests.

A test double is most justified when the real dependency is:

- external;
- slow;
- nondeterministic;
- difficult to configure;
- unavailable in the test environment;
- destructive or costly;
- hard to make hermetic.

## Types of doubles

### Fake

A lightweight working implementation suitable for tests but not production-scale use.

Often preferable to interaction-heavy mocks because it can preserve realistic behavior.

Examples:

- in-memory repository;
- fake clock;
- fake message queue;
- in-memory storage adapter.

### Stub

Provides predetermined responses to calls so the test can exercise a scenario.

Useful for controlling inputs from external boundaries.

### Mock / interaction-oriented double

Used to verify that particular interactions occurred.

Useful when the interaction itself is part of the required contract, but easier to overspecify.

## Avoid overspecification

A test becomes overspecified when it verifies details that are not required by the contract.

Warning signs:

- exact call order when order is irrelevant;
- verifying every getter/read call;
- verifying internal collaboration instead of end result;
- requiring precise internal method counts without product meaning;
- mocking several layers of internal modules.

Overspecified tests are brittle because harmless implementation changes break them.

## Interaction testing

Interaction verification is appropriate for meaningful state-changing side effects or contracts.

Examples:

- payment request sent exactly once;
- email dispatched;
- audit event emitted;
- destructive database action performed;
- retry does not duplicate an operation.

It is often unnecessary for read-only interactions when the final state/result already proves correctness.

## Mock boundaries, not arbitrary internals

Prefer substituting external/system boundaries rather than mocking every internal dependency.

Good boundaries include:

- HTTP APIs;
- email/SMS providers;
- payment gateways;
- time;
- randomness;
- filesystem/OS APIs when needed;
- remote infrastructure.

Be skeptical of mocking:

- pure functions;
- simple internal value objects;
- internal helper modules;
- most collaborators inside one feature.

Heavy internal mocking can create a test for a topology that no longer resembles the actual system.

## Do not test the test double

The goal is to test your application behavior, not to prove that a mocking library records calls correctly.

A test dominated by mock setup and mock-verification statements is a signal to reconsider the boundary.

## Fakes need contracts too

A fake can be useful only if it behaves closely enough to the relevant real contract.

If the fake diverges materially from production semantics, tests can give false confidence.

Keep fakes focused on the behavior needed by the application contract.

## Practical decision order

When choosing a dependency strategy, consider:

1. Can the real dependency be used safely, quickly, and deterministically?
2. Would a lightweight fake provide realistic enough behavior?
3. Can a stub control only the necessary external input?
4. Is interaction verification actually required by the contract?

Prefer the simplest option that provides realistic confidence.

## Review questions

For each mocked dependency ask:

1. Why is this dependency doubled?
2. Is it a real boundary or just an internal implementation detail?
3. Could a real implementation or fake be simpler and more trustworthy?
4. Are we asserting behavior or merely collaboration details?
5. Would a harmless refactor break this test?
6. Are call counts/order meaningful to the product contract?
7. Does the test still resemble how the real system behaves?

## Refactor signals

Potential `REWRITE` candidates:

- tests with more mock expectations than meaningful assertions;
- tests mocking several internal layers;
- tests that fail whenever internal collaboration changes;
- tests asserting non-state-changing reads that are already implied by the final result;
- mocks for trivial pure code.

Potential `KEEP` cases:

- explicit external side-effect contracts;
- exactly-once operations;
- failure/retry behavior at external boundaries;
- difficult or nondeterministic third-party systems.
