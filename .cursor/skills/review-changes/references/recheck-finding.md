# Re-check a review finding

Adapted from the personal `recheck-review-finding` skill for this repo's severity scale.
Load this when triaging CRITICAL/HIGH findings before fixing them, when a finding looks
doubtful, or when the developer asks to "re-check / verify / confirm" a finding.

**The earlier writeup is a claim, not evidence.** Re-judge one or two findings by tracing
the live code. Do not run a new full review.

## Do not change the repo while re-checking

Read files and git history only. Do not edit code, add a test or format files during the
re-check. A verdict does not need a repro in the tree. Fix only after the verdict - and in
a develop/fix loop only the findings judged valid.

## What to re-check

1. Open the cited file at the cited lines. Read the functions those lines call, including
   helpers in other files (`server/services/*`, `utils/*`, `store/features/api/*`). Do not
   stop at the diff hunk.
2. Write the path that would make the claim true, then the path that would make it false.
   Include timing (auth query still `undefined`), early returns, thrown `NextResponse`s,
   cookie presence, Prisma `include`/`select` shape, and what the client does with
   `error.data.message`.
3. Read tests (if any) that lock this behavior. A test that expects the behavior means the
   author chose it - say so, and say whether that test covers the claimed case.
4. Judge the claim **as written**. If the stated mechanism is wrong, the finding is not
   valid as written, even if a nearby bug is real. State the nearby bug only as a separate
   note with its own severity.

## Verdict (use one, no other)

- **Valid, still \<severity\>** - the claim matches the code and the severity is right.
- **Valid, downgrade to \<severity\>** - real, but weaker than stated or not blocking.
- **Valid, upgrade to \<severity\>** - worse than stated (for example a data leak behind
  what was reported as a style issue).
- **Not valid** - the claimed path cannot happen, or a step in the claim is wrong.

Severities are the `review-changes` ones: CRITICAL (block), HIGH (fix before merge),
MEDIUM (fix when reasonable), LOW (optional). A narrow window is still CRITICAL/HIGH when
that window is a normal path (slow network, first load before `GET /api/auth` resolves,
logged-out visit to a protected page). Do not lower severity to be polite; do not keep a
finding the trace disproves.

## Reply

Lead with the verdict. Then a few short sentences: the step that confirms or breaks the
claim and the condition under which it happens. Do not repeat the rest of the review.

## After the verdict

- **Inside the develop-feature / fix-bug loop (your own work):** fix every finding that is
  still valid at CRITICAL/HIGH; record each `Not valid` or downgraded finding with its
  one-line reason in the final summary under "Rejected / downgraded findings". Never drop
  a finding silently.
- **Developer asked for a verdict only:** stop after the verdict. If at least one finding
  is still valid, ask with the `AskQuestion` widget whether to fix it (`Fix it
(Recommended)` first for CRITICAL/HIGH/MEDIUM; `Do not fix (Recommended)` first for LOW).
- **Someone else's PR:** do not edit the repo; return paste-ready one-line comments only
  when the severity changed or the finding is not valid.

The developer may also run the personal `/recheck-review-finding` skill for an independent
re-judgement; its verdicts map 1:1 onto the table above (Critical -> CRITICAL/HIGH,
Suggestion -> MEDIUM, Nice to have -> LOW).
