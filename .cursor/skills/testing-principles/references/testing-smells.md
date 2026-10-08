# Common Testing Smells

Use this checklist while reviewing existing tests and before adding new ones.

A smell is not an automatic deletion rule. It is a signal to inspect the behavior/risk the test is intended to protect.

## 1. Change-detector test

### Signal

The test fails after an internal refactor even though externally observable behavior is unchanged.

Typical causes:

- private implementation assertions;
- exact internal call sequence;
- DOM-shape coupling;
- snapshot of incidental structure.

Typical action: `REWRITE`, sometimes `DELETE`.

## 2. Framework/library test

### Signal

The test mainly proves React, Next.js, JavaScript, the router, or another library does what its own contract already guarantees.

Typical action: `DELETE`, unless your wrapper/configuration adds meaningful behavior.

## 3. Duplicate behavior

### Signal

Multiple tests protect the same behavior and risk using equivalent examples.

Example:

- renders title for John;
- renders title for Alice;
- renders title for Bob;

when the name value does not change logic.

Typical action: `MERGE` or keep one representative test.

Do not merge genuinely different partitions or regressions.

## 4. Mock-topology test

### Signal

The test mostly verifies that mocked internal module A called mocked B which called mocked C.

The actual user/public outcome is barely asserted.

Typical action: `REWRITE` around a meaningful public boundary/result.

## 5. Trivial existence test

### Signal

Examples:

- `expect(component).toBeDefined()`;
- `expect(result).toBeTruthy()` where any non-crash satisfies it;
- checking a wrapper exists after rendering.

Typical action: `DELETE` or replace with a meaningful assertion.

## 6. Giant incidental snapshot

### Signal

A large snapshot contains hundreds of lines of markup where most changes are not meaningful contracts.

Typical action: replace with focused behavioral assertions or a deliberately scoped visual snapshot.

## 7. Production algorithm duplicated in test

### Signal

Expected output is calculated by copying/reimplementing the same logic as production.

Risk: both implementations can share the same bug.

Typical action: use explicit known expected values or a truly independent oracle.

## 8. One-test-per-method

### Signal

Test structure mechanically mirrors production methods rather than behaviors.

Typical action: reorganize by behavior and meaningful partitions.

## 9. Excessive parameterization

### Signal

A table has many rows that exercise the same behavior without different boundaries or risks.

Typical action: keep representative cases and meaningful partitions.

## 10. Hidden behavior in fixtures

### Signal

Understanding why the test should pass requires opening several fixtures/builders/helpers because behavior-relevant values are hidden.

Typical action: make important values explicit; keep only irrelevant defaults abstracted.

## 11. Clever test abstraction

### Signal

Helpers generate assertions dynamically or tests are created through several layers of indirection.

Typical action: prefer readable DAMP tests even with some duplication.

## 12. Fixed-delay async test

### Signal

The test uses arbitrary sleeps/timeouts to “wait long enough.”

Typical action: wait on actual observable state/event.

## 13. Shared-state test

### Signal

A test only passes after another test runs or depends on mutable global/shared data.

Typical action: isolate setup/state.

## 14. Oververified interaction

### Signal

The test verifies every dependency call, including read-only calls that do not represent a contract.

Typical action: assert final state/result and verify only contract-relevant side effects.

## 15. Overmocked unit

### Signal

Nearly every dependency is mocked simply to keep the test narrowly scoped.

Typical action: consider a component/integration test or a more natural boundary.

## 16. Test-only production design distortion

### Signal

Production APIs are being exposed or behavior altered solely so brittle tests can access internals.

Typical action: test through public behavior; refactor for testability only when the resulting production design is also sound.

## 17. Low-signal assertion

### Signal

The assertion can pass while the intended user behavior is broken.

Examples:

- checking a callback object exists but not that the action succeeded;
- checking status truthiness when a specific outcome is required.

Typical action: assert the actual contract.

## 18. Duplicate across levels

### Signal

The same low-risk scenario is tested identically at unit, integration, and E2E levels with no distinct risk protected.

Typical action: keep the cheapest level(s) that provide the necessary confidence and broader tests only where integration risk justifies them.

## 19. Coverage-only test

### Signal

The only rationale is “this branch/line is uncovered.”

Typical action: identify a meaningful behavior/risk first. If none exists, do not add the test.

## 20. Weak test name

### Signal

Names such as:

- `works`;
- `test button`;
- `case 1`;
- `handles data`.

Typical action: name the condition and expected behavior.

## 21. Unclear regression test

### Signal

A strange-looking test may be protecting a real historical bug, but its purpose is undocumented.

Typical action: do **not** delete immediately. Determine the regression, preserve it if relevant, and make the intent explicit.

## 22. E2E for cheap pure logic

### Signal

A browser flow exists solely to verify deterministic calculations/validation that could be covered cheaply below.

Typical action: move detailed partitions to unit/component tests; keep E2E only if the end-to-end integration adds distinct value.

## 23. Testing third-party behavior

### Signal

The test fails because an external website/provider changed behavior unrelated to your application.

Typical action: control the third-party boundary and test your own contract.

## 24. Visual baseline without intent

### Signal

Screenshot was accepted automatically or generated from an unknown/broken state.

Typical action: regenerate only from a reviewed known-good state and document what visual behavior matters.

---

# Quick classification guide

## KEEP when

- distinct behavior/risk;
- stable public-facing contract;
- useful regression/boundary;
- good confidence-to-maintenance ratio.

## REWRITE when

- valuable behavior, poor test technique;
- brittle implementation coupling;
- excessive mocks;
- weak selectors;
- incidental snapshots;
- arbitrary timing.

## MERGE when

- several tests protect the same behavior/risk;
- examples differ but logic/partition does not.

## DELETE when

- no meaningful behavior/risk;
- pure duplication;
- framework/library behavior;
- trivial implementation detail;
- coverage-only existence;
- test remains green while intended behavior can break.

Always verify regression history and meaningful unique protection before deletion.
