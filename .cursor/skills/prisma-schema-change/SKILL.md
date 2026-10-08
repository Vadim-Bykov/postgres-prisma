---
name: prisma-schema-change
description: >-
  Safely change the Prisma schema in this repo (postgres-prisma, Prisma 6 + Vercel
  Postgres, `prisma db push` workflow, no migrations folder): confirm which database the
  env points at, take a pg_dump backup, edit prisma/schema.prisma, run prisma format /
  generate / db push, then update models, DTOs, services, RTK types and the seed, and
  verify. Use when adding or changing a model, field, enum or relation, when asked about
  migrations / db push / schema sync, or before any command that writes to the database
  schema.
paths: "prisma/**,lib/prisma.ts"
metadata:
  author: vadim
  version: "1.0"
---

# Change the Prisma schema safely

The project uses **`prisma db push`** (schema-first, no `prisma/migrations/`). `npm run
build` on Vercel runs `prisma generate && prisma db push && prisma db seed`, so whatever is
in `prisma/schema.prisma` on `main` is applied to the production database on the next
deploy. Treat every schema edit as a production change.

## 0. Know which database you are touching

```sh
grep -E '^(POSTGRES_PRISMA_URL|POSTGRES_URL_NON_POOLING|VERCEL_ENV)=' .env .env.development.local | sed -E 's/(:\/\/[^:]+:)[^@]+@/\1***@/'
```

Print hosts and env names only - **never print credentials**. If both env files point at
the same (production) database, say so explicitly before continuing; there is no separate
dev database unless the developer provides one.

## 1. Backup first

```sh
npm run db-backup        # pg_dump custom format into backups/db-<timestamp>.dump
```

Needs `pg_dump` (`brew install libpq`). Keeps the last 5 snapshots (`BACKUP_KEEP`). If the
backup fails, stop - do not push a schema without a snapshot. Note the file name in your
report / plan.

## 2. Edit `prisma/schema.prisma`

Follow `api-and-prisma.mdc` conventions: PascalCase model, camelCase fields,
`id Int @id @default(autoincrement())`, `createdAt DateTime @default(now())`,
`updatedAt DateTime?` (or `@updatedAt` on new models), UPPER_SNAKE enum values, relation
fields named after the model, `onDelete: Cascade` where the child cannot exist without the
parent (see `Token`, `Wallet`, `Bonus`).

Rules of thumb:

- **Additive changes are safe** (new optional field, new model, new enum value). Required
  new fields on existing tables need a `@default(...)` or they fail on existing rows.
- **Renames are destructive under `db push`** - Prisma drops and recreates the column,
  losing data. Prefer add-new-field -> copy data (script) -> remove old; or keep the name
  and `@map("old_name")`.
- **Removing a field/model or changing a type** loses data: confirm with the developer in
  the same conversation and point at the backup.
- Never touch the legacy lowercase `model users` or the `@map` currency symbols without a
  dedicated plan.

Then:

```sh
npx prisma format
npx prisma validate
```

## 3. Generate and push

```sh
npx prisma generate
npx prisma db push          # prints the planned changes; read them before confirming
```

- If Prisma warns about data loss, **stop**. Do not add `--accept-data-loss` or
  `--force-reset` on your own - they need the developer's explicit go-ahead, in this
  conversation, after the backup.
- `prisma db push` will not prompt in CI; locally it may ask to confirm - read the diff it
  prints.

## 4. Update the code that mirrors the schema

In the same change:

- `models/*` - request/response types that extend the Prisma type.
- `server/dtos/*` - expose the new field only if the client may see it.
- `server/services/*` - queries, `include`/`select`, validation of the new field.
- `app/api/**/route.ts` - body handling if the field is written.
- `store/features/api/subApi/*` - endpoint types / tags.
- `prisma/seed.ts` - if the model is seeded (upsert by a stable key; keep it idempotent).
  Note: the seed's `main()` call is currently commented out - do not enable it as a side
  effect of your change.
- `prisma/enumAdapter.ts` - display mapping for a new enum.

Then `npm run typecheck`.

## 5. Verify

- `npx prisma studio` or a quick `npx tsx -e` / `node -e` script reading the table (no
  writes) to confirm the column/model exists.
- Run the affected API route via the app (`npm run dev` + `browser-qa`) or `curl` and check
  the response shape.
- Report: database host (masked), backup file, the `db push` summary, files updated.

## Rollback

- Code: revert the commit.
- Data: `pg_restore --clean --if-exists --no-owner -d "$POSTGRES_URL_NON_POOLING" backups/db-<ts>.dump`
  - a destructive restore; only with the developer's explicit go-ahead.

## Gotchas

- `POSTGRES_PRISMA_URL` is the pooled URL; `directUrl` (`POSTGRES_URL_NON_POOLING`) is what
  `db push`, `pg_dump` and `pg_restore` need.
- Vercel builds push the schema on deploy: merging a schema change to `main` _is_ the
  production migration. Make sure the code using the field ships in the same commit.
- `prisma db pull` overwrites the schema from the database - only use it to inspect drift,
  and review the diff before keeping it.
- Consultations are filtered to `PUBLISHED` only when `VERCEL_ENV === "production"`
  (`getEnvironment()`); a seed row with `status: PENDING` will not appear in production.
