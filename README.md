# FNG Trading Co — Website

Marketing site and admin panel for **Future Next Gen (FNG)**, a Riyadh-based B2B
supplier of professionally **refurbished HP printers**, **eco-friendly toner
(Eco Inks)**, **genuine printer parts**, and **electronics sourcing from China**
to Saudi Arabia and the wider Gulf.

Bilingual **English + Arabic (RTL)**, with a customer-facing site, a separate
sourcing vertical, an authenticated admin panel, and an AI chat assistant.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, RSC, View Transitions) |
| Styling | Tailwind CSS v4 + a CSS custom-property design system (`src/app/globals.css`) |
| i18n | `next-intl` (`messages/en.json`, `messages/ar.json`) |
| Data / auth | Supabase (Postgres, REST, Storage); custom admin session auth |
| Motion | `framer-motion`, scroll-frame sequences, `cobe` globe |
| Icons | `lucide-react` |
| Validation | `zod` |
| Tests | `vitest` |

> Next.js 16 has breaking changes vs. earlier versions — see the guides under
> `node_modules/next/dist/docs/` and `AGENTS.md` before making framework-level changes.

## Quick start (local, everything in Docker)

The database runs in Docker via the Supabase CLI; the app runs with `npm run dev`
(fastest inner loop) or in Docker via `docker compose`.

**Prerequisites:** Node 20+, Docker Desktop, and the
[Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`).

```bash
# 1. Install dependencies
npm install

# 2. Start Supabase (Postgres, REST, Storage, Studio, Kong) in Docker.
#    Runs migrations and loads supabase/seed.sql (demo catalog, parts, settings).
supabase start

# 3. First run only — create the public image bucket the admin uploader uses
docker exec supabase_db_FNG psql -U postgres -d postgres \
  -c "insert into storage.buckets (id,name,public) values ('printer-images','printer-images',true) on conflict (id) do update set public=true;"

# 4. Point the app at local Supabase — copy .env.example to .env.local and fill
#    NEXT_PUBLIC_SUPABASE_URL / *_ANON_KEY / SERVICE_ROLE_KEY from `supabase status`
cp .env.example .env.local

# 5. Run the app
npm run dev            # http://localhost:3000
```

To reset the database and reload the seed at any time: `supabase db reset`.
Supabase Studio (browse/edit data): `http://127.0.0.1:54323`.

### Run the app in Docker instead

```bash
supabase start
docker compose up --build     # app at http://localhost:3000
```

Full walkthrough, including the browser-vs-server URL note for admin, is in
[`DOCKER-LOCAL.md`](DOCKER-LOCAL.md). Production image build args are documented in
[`README-DOCKER.md`](README-DOCKER.md).

## Environment variables

Copy `.env.example` → `.env.local` and fill it in (all values are documented in
that file). `NEXT_PUBLIC_*` values are inlined at build time; the rest are
runtime secrets. `.env*` files are gitignored and never committed.

## Admin panel

`/admin` — the login password lives in the Supabase `settings` table
(`admin_password`), managed from **Admin → Settings**. The local seed sets it to
`fng-admin-2026`. `ADMIN_SESSION_SECRET` must be set or login returns a 500.

## Scripts

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build (Next standalone output)
npm run start    # serve the production build
npm run lint     # eslint
npm run test     # vitest
```

## Project structure

```
src/
  app/
    [locale]/        # public, localized routes (home, printers, eco-inks,
                     #   sourcing, industries, about, contact, faq, …)
    admin/           # authenticated admin panel
    api/             # route handlers (contact, chat, admin CRUD, upload)
    globals.css      # design tokens + global styles
  components/
    sections/        # marketing sections (hero, catalog, industries, trust, …)
    pages/           # page-level client components
    layout/          # navbar, footer, floating WhatsApp
    ui/              # primitives (Reveal, CountUp, IconButton, states)
    admin/  chat/  gate/  providers/
  lib/               # supabase client, i18n, service regions, helpers
  hooks/
messages/            # en.json / ar.json translation catalogs
supabase/            # config.toml, migrations, seed.sql
public/              # product photography, videos, frame sequences, documents
```

## Design system

Colors, spacing, radii, type sizes, shadows, easings, and glass effects are
defined as CSS custom properties in `src/app/globals.css` and consumed via
`var(--token)` in components — the single source of truth for the visual system.

## Deployment

- **Docker:** two-stage build to a Next.js standalone server — see
  [`README-DOCKER.md`](README-DOCKER.md).
- **Hostinger (Node app):** see [`HOSTINGER_DEPLOY.md`](HOSTINGER_DEPLOY.md).

---

Private repository — © Future Next Gen (FNG). All rights reserved.
