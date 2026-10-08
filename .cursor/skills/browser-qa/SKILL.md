---
name: browser-qa
description: >-
  Verify a flow of this site (postgres-prisma / Астрология_Инь) in a live Chrome via the
  Chrome DevTools MCP against `npm run dev`: drive the journey (navigate, snapshot, fill,
  click, wait_for), capture screenshots at 375/768/1024, sweep console and network, and
  report. Use after implementing or fixing a feature, when asked to "check it in the
  browser / test the flow / QA this / take screenshots", or as the verify step of
  develop-feature and fix-bug. There is no scripted E2E framework - this is the manual gate.
metadata:
  author: vadim
  version: "1.0"
---

# Browser QA (Chrome DevTools MCP)

You drive the browser, capture evidence, and report. Treat journeys as the **pre-commit /
pre-PR manual gate** - "done" includes having watched the flow work.

## Setup

- Start the dev server: `npm run dev` (runs `prisma generate` first; needs the Postgres env
  vars - confirm which database they point at, because registration and purchase journeys
  **write rows**). Default URL `http://localhost:3000`.
- The `Chrome-devtools` MCP is the default browser driver (user-level rule). Firefox /
  Safari MCPs only when asked or for engine-specific bugs.
- Test accounts: use a throwaway email you can delete afterwards; never use real customer
  accounts. Note created rows in the report so they can be cleaned up.

## Journey shape

```
1. navigate_page -> http://localhost:3000/consultation
2. take_snapshot                         # elements with uid refs
3. click { uid: <consultation card> }
4. wait_for { text: "Оплатить" }         # a real UI signal, never a fixed wait
5. take_screenshot { name: "consultation-detail-375" }
6. list_console_messages + list_network_requests   # end-of-journey sweep
```

Run each journey at **375** (phone, `MobileMenu`), **768** and **1024** (`lg:` desktop
layout) via `resize_page`. Cover the states the change touches: loading (skeleton),
empty, error (Russian message shown inline), success.

## MCP tool map

- Open: `navigate_page`, `new_page`, `select_page`, `list_pages`
- Discover: `take_snapshot` (uids), `get_css_styles`
- Interact: `click`, `hover`, `fill`, `fill_form`, `type_text`, `press_key`, `handle_dialog`
- Wait: `wait_for` (text / selector)
- Capture: `take_screenshot`, `take_snapshot`
- Runtime: `list_console_messages`, `get_console_message`, `list_network_requests`,
  `get_network_request` (check `/api/*` status codes and `{ success: false, message }` bodies)
- Probe: `evaluate_script` (e.g. `document.documentElement.lang`, cookie presence - never
  read token values into the chat)
- Responsive: `resize_page`, `emulate`
- Perf / a11y: `lighthouse_audit`, `performance_start_trace` / `stop_trace` / `analyze_insight`

## The journeys of this app

Read `references/journeys.md` for the step lists. Pick the ones your change touches:

- Home -> consultations list -> consultation detail -> payment info (banking list, copy
  number, bonus split).
- Register (bonus toast, wallet created) -> logout -> login -> wrong password error.
- Reset password: request link -> email sent state -> `/reset-password/<link>` form.
- Account: personal details edit, purchases (empty + filled), bonuses, friends (copy
  referral), notifications toggle, support.
- Admin: `/admin` user list (requires `ADMIN` role; a `USER` must be redirected home).
- Articles: list -> article page -> "send by email" button.
- Mobile navigation: burger menu, account mobile nav at 375.

## Flake triage

- **Stale uid**: re-`take_snapshot` before sensitive interactions after a re-render.
- **Network timing**: `wait_for { text }` then confirm via `list_network_requests`; never an
  arbitrary sleep.
- **Auth race**: `isAuthorized` is `undefined` until `GET /api/auth` resolves; wait for the
  header `UserBadge` (logged in) or the «Войти» button (logged out) before asserting.
- **Modal animation**: react-modal closes with a 300 ms timeout - `wait_for` the modal
  content to disappear before the next click.
- Re-run a flaky journey 3 times before calling it stable; report what stayed flaky.

## Evidence and gates

- Save screenshots and the console/network JSON under `.tmp/qa/<journey>/` (gitignored).
- End every journey with the console + network sweep: no uncaught errors, no failed
  `/api/*` calls except the ones the journey expects (e.g. 401 on `/api/auth` when logged
  out is expected).
- Lighthouse on the home and consultation pages for visual changes: targets **LCP < 2.5 s,
  CLS < 0.1, INP < 200 ms, accessibility > 95**. Fixes come from `modern-web-guidance`.
- Write-path journeys (register, purchase, reset password) only against a non-production
  database or with a throwaway account you clean up; confirm the final network sweep shows
  no unintended POST/PATCH/DELETE.

## Report template

```markdown
# Browser QA - <branch or change> - PASSING / FAILING

Dev server: http://localhost:3000 · DB: <host, masked> · Viewports: 375 / 768 / 1024
Journeys: X | Passed: Y | Failed: Z

## <journey> - PASS

Screenshots: .tmp/qa/<journey>/01-....png · Console: clean · Network: all /api/* 200

## <journey> - FAIL

Failing step: wait_for "..." timed out at 375
Screenshot: .tmp/qa/<journey>/03-failure.png · Console: 1 uncaught TypeError (…)
Network: PATCH /api/bonus -> 400 { message: "..." } · Suspected cause: <...>
```

## Gotchas

- The MCP drives a local Chrome; nothing runs in CI. Say so when reporting "verified".
- If pages render but lists stay empty, the dev server could not reach Postgres - check the
  terminal before debugging the UI.
- Prefer stable selectors: visible Russian labels (`«Электронная почта»`), roles, or a
  `data-test-id` you add to new interactive elements; fall back to a fresh snapshot uid.
- Screenshots may contain user emails or names - do not paste them into PRs or chat.
