# Google — Larger Testing

Primary source:
https://abseil.io/resources/swe-book/html/ch14.html

Source: _Software Engineering at Google_, Chapter 14 — Larger Testing.

Use this reference when deciding whether a behavior belongs in a narrow unit test or a broader integration/system/acceptance test.

## Core idea

Narrow tests are valuable for speed, determinism, and precise failure localization, but they cannot prove every important property of a real system.

Broader tests are justified when confidence depends on multiple real components, deployment/runtime behavior, or user journeys.

The goal is not to maximize one test type. Use different scopes for different risks.

## Scope vs size

Think separately about:

- **scope** — how much code/system behavior the test intends to validate;
- **size/resources** — what resources the test uses and how expensive it is.

A broader scope can detect integration failures that narrow unit tests cannot.

## When broader tests add value

Use broader tests when important risk comes from collaboration between real pieces, for example:

- service + database behavior;
- request routing + handler + persistence;
- browser + frontend + backend flow;
- configuration/runtime wiring;
- serialization across boundaries;
- permissions across components;
- real user journeys.

## Working as implemented vs working as intended

A narrow test written by the same developer can accidentally encode the same misunderstanding as the implementation.

Broader acceptance-style tests can help validate intended user/product behavior through public interfaces.

This does not make every feature require an E2E test. Use broader tests for important journeys and integration risks.

## Do not duplicate everything at every level

Avoid mechanically repeating every case as unit + integration + E2E.

Ask what distinct failure mode each level detects.

Useful overlap:

- unit test protects a business-rule boundary cheaply;
- integration test proves the real storage/serialization/wiring works;
- E2E test proves a critical user journey works end to end.

Unhelpful overlap:

- repeating the exact same low-risk scenario at three levels without a distinct risk signal.

## Broader tests cost more

Larger tests can be:

- slower;
- harder to isolate;
- harder to debug;
- more sensitive to infrastructure/environment;
- more expensive to run frequently.

Therefore, use them where they buy confidence that smaller tests cannot provide.

## Critical user journeys

Good candidates for broader coverage often include:

- authentication;
- purchase/payment;
- onboarding;
- permissions;
- critical create/edit/delete operations;
- migrations/upgrades;
- workflows involving multiple services;
- high-value user journeys.

## Test environment and data

Broader tests need controlled data and reliable environments.

Avoid hidden dependence on mutable shared environments when possible.

Make setup and cleanup explicit enough that tests remain reproducible.

## Practical decision questions

Before choosing a broader test ask:

1. What integration failure can this catch that a narrow test cannot?
2. Is that failure important enough to justify the extra cost?
3. Can the scenario be tested more cheaply without losing realism?
4. Does the test use public/user-facing interfaces where possible?
5. Is the environment/data controlled enough to make the test reliable?
6. Are we duplicating lower-level coverage without adding another risk signal?

## Refactor consequences

Potential `MERGE`/`DELETE` candidates:

- many E2E tests repeating cheap validation cases already strongly covered below;
- broad tests for trivial framework behavior;
- multiple system tests protecting the same low-risk path.

Potential `KEEP` cases:

- critical journeys;
- real integration boundaries;
- runtime/configuration behavior not visible in unit tests;
- acceptance behavior that validates product intent.
