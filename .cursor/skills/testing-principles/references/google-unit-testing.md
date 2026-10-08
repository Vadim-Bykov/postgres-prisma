# Google — Unit Testing

Primary source:
https://abseil.io/resources/swe-book/html/ch12.html

Source: _Software Engineering at Google_, Chapter 12 — Unit Testing.

This file is a practical summary for test design. Read the source when a decision is subtle or high impact.

## Core idea

Tests should improve engineering productivity by catching meaningful regressions while remaining stable as implementation changes.

A good test is not merely one that passes today. It should continue to provide useful confidence over time without creating unnecessary maintenance work.

## Strive for unchanging tests

Tests that require frequent edits during harmless implementation refactors are often too coupled to implementation details.

Prefer tests that change when behavior or contract changes, not when internal structure changes.

Warning signs:

- testing private methods directly;
- asserting exact internal call order without a contract requiring it;
- coupling tests to internal object structure;
- using implementation-specific selectors;
- mirroring production code in expected-value calculations.

## Test via public APIs

Exercise the system through the same stable surface used by real consumers whenever practical.

Why:

- public interfaces are more stable than implementation details;
- tests become closer to meaningful contracts;
- refactors are less likely to cause unrelated test churn.

Private helpers generally do not need separate direct tests when their meaningful behavior is already covered through a public interface.

## Test behaviors, not methods

Do not map test structure mechanically to production method structure.

A behavior is a guarantee the system makes under a particular state/input.

Useful framing:

- Given a relevant state,
- When an action occurs,
- Then the system provides a specific observable result.

One method may implement several behaviors. One behavior may require several methods to collaborate.

Therefore, “one test per method” is usually the wrong organizing principle.

## State over interactions

Prefer verifying observable results/state over verifying internal collaborator calls.

State/result assertions answer “what happened?”

Interaction assertions answer “how did the implementation get there?”

The latter are often more brittle.

Interaction testing is justified when the interaction itself is meaningful behavior, such as an external side effect or exactly-once operation.

## Complete and concise tests

A test should contain enough information to understand the behavior without unnecessary detail.

Keep behavior-relevant setup visible. Hide irrelevant boilerplate behind helpers/builders only when that improves readability.

Avoid overly magical fixtures where critical values are hidden far away from the assertion.

## Name tests after behavior

Good names describe the condition and expected result.

Prefer:

- `rejects withdrawal when account has insufficient funds`
- `shows validation error when email is malformed`

Avoid names that merely repeat a method name or test number.

## Do not put unnecessary logic in tests

Avoid recreating production algorithms in test code.

If the expected result is computed using the same algorithm as production, both can contain the same bug and the test can still pass.

Prefer explicit expected values when practical.

Avoid unnecessary loops, conditionals, and transformations that make the test itself difficult to verify.

## DAMP over excessive DRY

Tests benefit from being Descriptive And Meaningful Phrases (DAMP), even when that means some duplication.

Do not apply DRY mechanically to test code.

A small amount of duplicated setup can be better than deeply abstracted helpers that hide the meaning of the test.

Extract helpers when they remove noise, not when they remove information needed to understand behavior.

## Test behavior partitions

Different behaviors deserve different tests; different values do not automatically deserve different tests.

Useful partitions often include:

- normal behavior;
- boundary behavior;
- invalid input;
- expected failure;
- different permission/state classes;
- meaningful regression scenarios.

Do not create many examples that all exercise the exact same behavior unless the domain risk justifies it.

## Practical review questions

For each test ask:

1. What behavior does this protect?
2. Would a harmless internal refactor break it?
3. Does it test through a stable/public interface?
4. Is it asserting outcome or incidental interactions?
5. Is the test complete enough to understand locally?
6. Is there unnecessary logic or abstraction inside the test?
7. Is this a distinct behavior or just another example of the same behavior?
8. What realistic bug would this catch?

## Practical consequences for refactoring

Potential `DELETE` candidates:

- trivial existence tests with no contract;
- tests of framework/library behavior;
- duplicate examples of the same behavior/risk;
- direct private-helper tests whose behavior is fully protected publicly;
- tests that merely restate production implementation.

Potential `REWRITE` candidates:

- interaction-heavy tests for behavior that can be asserted through state/results;
- tests coupled to private internals;
- tests with large hidden fixtures;
- tests requiring edits for behavior-preserving refactors.

## Source sections worth consulting

The chapter is especially useful for:

- maintainability and brittleness;
- public APIs;
- state vs interaction testing;
- behavior-driven organization;
- test naming;
- DAMP vs DRY;
- avoiding logic in tests.
