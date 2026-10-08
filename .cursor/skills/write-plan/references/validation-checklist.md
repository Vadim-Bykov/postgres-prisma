# Plan validation checklist

Load after the first draft. Walk every code snippet, file path, component name and copy
string in the plan against these checks, fix violations in place, then present the plan.
Only conventions are validated here - not business logic.

## Grounding

- [ ] Every file, model, route, hook and component the plan names exists (open it) or is
      explicitly marked as _new_ with its path.
- [ ] Prisma models/fields/enums quoted match `prisma/schema.prisma`.
- [ ] Every RTK endpoint `url` maps to an existing or planned `app/api/**/route.ts`.
- [ ] A nearest existing feature is cited as the pattern to copy.

## Executable without inference (the plan may be built by a weaker model)

- [ ] Every step names its file(s), the exact change and the names to use (service,
      endpoint, hook, tag, component, `messages.json` key); nothing is left "to decide".
- [ ] Every step has "Copy from" (`path:lines` of a real file), "Verify" (command or
      observable) and "Done when" (checkable).
- [ ] A Contract section lists fields, request/response types, RTK hooks/tags and
      component props for everything new or changed.
- [ ] Snippets appear only for non-obvious shapes (`ApiError` protocol, `injectEndpoints`
      tags, `$transaction`, role check), are 10-30 lines, and name the file they are
      adapted from; no whole-file implementations.
- [ ] UI and error strings are written out in Russian («вы»), ready to paste.
- [ ] The plan is within ~300 lines and references the rules instead of restating them.

## Imports and structure (`development-standards.mdc`)

- [ ] Imports use `@/...` from the repo root or relative siblings; no `@components`,
      `@utils`, `src/` paths, no new barrel files.
- [ ] Pages/layouts are thin default exports; components named exports in
      `app/<route>/components/` or `app/_components/*`.
- [ ] Hooks live in `utils/`; constants UPPER_SNAKE_CASE; PascalCase component files,
      kebab-case route folders.
- [ ] No copied trees, no `* copy.*` files; `app/admin/account` is not extended.
- [ ] New routes are added to the `Pathname` union in `utils/useAppRouter.ts`.
- [ ] Existing helpers reused (`cn`, `formatDate`, `useAuthorizedRoute`, inputs, `Modal`).

## Data and state

- [ ] Server data via RTK Query endpoints injected into `appApi`; no `fetch` in components;
      no Prisma in pages/components.
- [ ] Tags added to `appApi.tagTypes` when a new domain appears; mutations invalidate.
- [ ] Types in `models/*` extending Prisma types; no `any`.
- [ ] Redux only for auth/user/modal state; otherwise local `useState`. No React Context.

## API and Prisma (`api-and-prisma.mdc`)

- [ ] Handlers: typed body, auth via `cookieService.getUserDataFromCookies()`, validation,
      `NextResponse.json`, `apiCatchErrorHandler`.
- [ ] Admin actions check `role` server-side.
- [ ] DTOs strip `password`/tokens; no secrets or personal data in logs or messages.
- [ ] Multi-write flows use `prisma.$transaction`.
- [ ] Schema change steps include `npm run db-backup`, `prisma format`, `generate`,
      `db push`, and updates to `models/*`, DTOs, services, seed. No destructive commands.

## Styling (`styling-tailwind.mdc`)

- [ ] Tailwind utilities with theme tokens; no raw hex; no inline `style`; `cn()`/`clsx`
      for conditionals; mobile-first with `lg:`.
- [ ] Loading skeleton, empty state, error state and focus styles planned for new UI.

## Copy (`ux-copy-ru.mdc`)

- [ ] All user-facing strings Russian, «вы» register, action-naming buttons.
- [ ] Reusable messages go to `app/constants/messages.json`; amounts come from data.

## Verify plan

- [ ] Lists `npm run typecheck`, `npm run lint`, `npx next build` (not `npm run build`).
- [ ] Includes the review loop (`review-changes` via the `reviewer` subagent, triage, fix,
      re-gate) and a success criterion "no CRITICAL/HIGH open; rejected findings recorded".
- [ ] Names the `browser-qa` journey and the states it covers, run on the final code.
- [ ] Honest about what cannot be verified (open questions).

## Report format

```
**[Category]** - Section "X" of the plan
- Issue: <what is wrong>
- Fix: <what to change>
```

After reporting, update the plan file in place with minimal, targeted fixes. Preserve
structure, header and intent. If nothing is wrong, say the plan passes validation.
