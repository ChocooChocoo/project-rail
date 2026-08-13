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
- **Current state**: schema has no models yet; using `db push`. First real model → `npx prisma migrate dev --name init` to switch to versioned migrations (`prisma/migrations/`).
- Full docs: https://www.prisma.io/docs
