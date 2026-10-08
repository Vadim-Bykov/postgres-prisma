# Review rubric

The postgres-prisma practices as review checks. Severity in brackets. Walk each category
against the diff. For the _why_, see `AGENTS.md` and `.cursor/rules/*.mdc`.

## Data layer (RTK Query + Route Handlers)

- [HIGH] Component or page calls `fetch` directly (or uses Prisma) instead of an RTK Query
  hook from `store/features/api/subApi/*`.
- [HIGH] Endpoint `url`/method does not match an existing `app/api/**/route.ts`, or the
  handler's response shape differs from the endpoint's TS type.
- [HIGH] New domain without a tag type in `appApi.tagTypes`, or a mutation that does not
  invalidate the data it changes (stale lists after save).
- [MEDIUM] Types not in `models/*` (or `@prisma/client`); `any` at the boundary.
- [MEDIUM] Server data copied into a Redux slice instead of read from the RTK cache.
- [MEDIUM] Mutation result not `unwrap()`ed / error not surfaced to the user.

## Routing, auth and state

- [CRITICAL] Protected page or data reachable without `useAuthorizedRoute` on the client
  **and** `getUserDataFromCookies()` on the server.
- [HIGH] Admin feature gated only on the client (`useAdminRoute`) with no server-side
  `role === "ADMIN"` check.
- [HIGH] New global state library or React Context for app state (Redux slices + RTK cache +
  local `useState` are the pattern).
- [MEDIUM] New route not added to the `Pathname` union in `utils/useAppRouter.ts`.
- [MEDIUM] `export const dynamic = "force-dynamic"` on a page that fetches nothing on the
  server; or missing on an API route that reads cookies.
- [LOW] Next 15 `params` used without `await` in an async page/route.

## API handlers and services

- [CRITICAL] Handler returns a raw Prisma user record, `password`, token row or reset link;
  or returns another user's data because the id came from the body instead of the cookie.
- [CRITICAL] Catch block swallows an error on registration, login, purchase or email paths.
- [HIGH] Body/query used without validation (missing required fields, uncoerced numbers,
  enum not checked) before a Prisma write.
- [HIGH] Error protocol broken: hand-rolled responses instead of `ApiError.*`, or a handler
  without `apiCatchErrorHandler` / `instanceof NextResponse` handling; messages leaking
  stack traces, SQL or Prisma error text.
- [HIGH] Multi-write flow (user + wallet + bonus, purchase + bonus) without
  `prisma.$transaction` in new code.
- [MEDIUM] Service written as a class or default export; Prisma client constructed outside
  `lib/prisma.ts`; cookie parsed outside `cookieService`/`tokenService`.
- [MEDIUM] DTO bypassed - handler maps fields by hand instead of `server/dtos/*`.

## Prisma and database safety

- [CRITICAL] `prisma db push --force-reset`, `--accept-data-loss`, `migrate reset`, bulk
  `deleteMany` without a `where`, or raw `DROP`/`TRUNCATE` in scripts or docs run by agents.
- [HIGH] Schema change without matching updates to `models/*`, DTOs, services, RTK types
  and `prisma/seed.ts`; `npx prisma format` not applied.
- [HIGH] Use or extension of the legacy lowercase `model users`.
- [MEDIUM] New enum display values mapped in the schema (`@map`) instead of
  `prisma/enumAdapter.ts`; `select`/`include` fetching far more than the DTO needs.

## Styling (Tailwind)

- [HIGH] Raw hex colors (`#fff`, `border-[#D8D6DC]`) or inline `style={{}}` in new UI;
  colors not from `tailwind.config.js` tokens.
- [HIGH] New CSS/SCSS module for something Tailwind expresses; `@font-face`/Google Fonts
  added; component styles in `globals.css`.
- [MEDIUM] Class strings built with template literals / `? : ""` instead of `cn()`/`clsx`;
  `className` prop not accepted or not merged last.
- [MEDIUM] Desktop-first (`max-width`) or scattered `md:`/`xl:` breakpoints instead of
  mobile-first + `lg:`; CSS and `useWindowDimensions` breakpoints disagree.
- [MEDIUM] New interactive element without a focus style; animation without
  `motion-reduce:` fallback; touch target under 44px on mobile.
- [MEDIUM] Hand-rolled pattern (modal, tooltip, accordion animation) where
  `modern-web-guidance` prescribes a native feature and no shared component exists.
- [LOW] `next/image` without explicit size; `priority` on a non-hero image; remote host
  missing from `next.config.js`.

## UX copy (Russian)

- [HIGH] English user-facing strings in new code; «ты» and «вы» mixed on one screen; new
  text in «ты» without the developer asking for it.
- [HIGH] Prices, bonus amounts or percentages typed into copy instead of read from data or
  `app/constants/constants.ts`.
- [MEDIUM] Reusable validation/status message inlined instead of added to
  `app/constants/messages.json`; brand name typed instead of `BRAND_NAME`.
- [MEDIUM] Button labelled «Отправить»/«ОК»; error without a next step; pressure or
  promised-outcome wording.
- [LOW] Typos in new strings; `<html lang>` left as `en` when `app/layout.tsx` is touched.

## Errors, logging and secrets

- [CRITICAL] Personal data (email, name, payment number), token, password or reset link in
  a `console.*`, analytics call, error message or thrown error.
- [CRITICAL] Secret, privileged email or password hardcoded in code; `process.env.<secret>`
  read in a client component.
- [HIGH] `console.log` / `console.error` left in committed code.
- [HIGH] Client catch that neither shows a message nor rethrows; `error?.data?.message`
  ignored.
- [MEDIUM] Server error message written for developers (English / technical) and shown to
  users.

## TypeScript, imports and structure

- [HIGH] `: any`, `as any`, `@ts-ignore` added (`@ts-expect-error` with a reason is
  acceptable for a wrong library type).
- [MEDIUM] Barrel `index.ts` added; non-`@/` alias invented; `src/` or `@components` paths
  from the other project.
- [MEDIUM] Helper re-implemented instead of using `utils/` (`cn`, `formatDate`, plurals,
  `useAuthorizedRoute`) or a shared primitive from `app/_components/common`.
- [MEDIUM] Route tree or component copied (`app/admin/account` extended); `* copy.*` file
  added; file > ~300 lines mixing data, layout and formatting.
- [MEDIUM] Default export on a non-page component (except the accepted `Button`, `Icon`,
  `Wrapper`); PascalCase/kebab-case conventions broken.
- [LOW] Typos in new identifiers; unused imports; dead code left behind.

## Tests (when present)

- [HIGH] New behavior with no coverage _and_ no browser verification reported.
- [HIGH] `.skip` / `.only` left in; test deleted or weakened to pass.
- [MEDIUM] Test asserts implementation (mock call counts, internal state) instead of
  behavior; mocks `react-hook-form`, shared inputs or first-party hooks; hits the real
  database.
- [MEDIUM] DOM test missing `// @vitest-environment happy-dom`; `fireEvent` where
  `user-event` applies; `waitFor(() => getBy*)`.

## Known gaps (do not re-flag as new)

Pre-existing debt is accepted: the `app/admin/account` copy, `articles copy.ts`, hardcoded
admin emails and master password in `userService.ts`, `UseFormRegister<any>` on the old
inputs, `@ts-ignore` in `useAppPathname`, existing hex values, the commented-out seed
`main()`, the lowercase `users` model, `Promise.all` registration flow,
`process.env.VERCEL_URL` read in `store/features/api/appApi.ts` (not a secret; resolves
to `/api/` in the browser). Flag only newly introduced violations or edits that extend
these. (`GET /api/users` was unauthenticated until the admin check landed - keep it; the
route is the reference for an admin-only handler.)
