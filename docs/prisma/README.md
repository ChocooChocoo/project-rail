# Prisma Commands

Project setup: Prisma 7.9.1 + MySQL 8.4 (Laragon) — database `next-prisma-mysql`, connection in `.env` (`DATABASE_URL`).

## Schema / setup

| Command | What it does |
|---|---|
| `npx prisma init` | Scaffold schema + config |
| `npx prisma format` | Format `schema.prisma` |
| `npx prisma validate` | Validate schema |
| `npx prisma generate` | Regenerate client after schema changes |

## Migrations

| Command | What it does |
|---|---|
| `npx prisma migrate dev --name <desc>` | Create + apply migration, regen client (dev) |
| `npx prisma migrate deploy` | Apply pending migrations (prod/CI) |
| `npx prisma migrate reset` | Drop DB, reapply all migrations (dev) |
| `npx prisma migrate status` | List pending/applied migrations |

## Database

| Command | What it does |
|---|---|
| `npx prisma db push` | Sync schema without migration files (prototyping) |
| `npx prisma db pull` | Introspect existing DB into schema.prisma |
| `npx prisma db seed` | Run seed script |

## GUI

| Command | What it does |
|---|---|
| `npx prisma studio` | Browser DB viewer (like phpMyAdmin) |

## Notes

- **Daily loop**: edit `schema.prisma` → `npx prisma migrate dev --name <desc>` (client regen is automatic in v7).
- **Verify connection**: `npx prisma db push` — success output shows the datasource; an error means MySQL is down or `.env` is wrong (Laragon: "Start All" first).
- **Current state**: `User` model + `init` migration applied locally (Laragon MySQL 8.4) and on Railway (MySQL 9.4). Seed script: `prisma/seed.mjs` (uses `User` casing — Linux MySQL is case-sensitive).
- Full docs: https://www.prisma.io/docs

## Railway (production DB)

Railway MySQL is TLS-only on the public proxy and its cert is not in the OS trust store — the Prisma CLI needs `?sslaccept=accept` appended to the URL. The app itself (`src/server/db.ts`) handles TLS via the mariadb adapter, so the query param is CLI-only and safe to leave in the shared URL.

```powershell
$env:DATABASE_URL = "mysql://root:<password>@<host>.proxy.rlwy.net:<port>/railway?sslaccept=accept"
npx prisma migrate deploy   # apply pending migrations (never migrate dev against prod)
npx prisma migrate status   # verify applied state
npx prisma db seed          # optional demo data
```

Vercel env var `DATABASE_URL` uses the same public URL (with `?sslaccept=accept`). Private Railway hosts (`*.railway.internal`) only resolve inside Railway's network — never use them from Vercel or local.
