# Running FNG locally in Docker (app + Supabase)

This runs the whole stack in containers: **Supabase** (Postgres, REST, Storage,
Studio, Kong) via the Supabase CLI, and the **Next.js app** via `docker compose`.

## Prerequisites

- Docker Desktop running.
- The Supabase CLI: `brew install supabase/tap/supabase` (or download the binary
  from https://github.com/supabase/cli/releases).

## 1. Start Supabase (in Docker)

From the repo root:

```bash
supabase start
```

This reads `supabase/config.toml`, runs the migrations in `supabase/migrations/`,
and loads the demo data in `supabase/seed.sql` (6 refurbished-printer SKUs, the
parts catalog, and settings). It publishes:

- API / REST / Storage gateway: `http://127.0.0.1:54321`
- Postgres: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Studio (browse the data): `http://127.0.0.1:54323`

To reset the database and reload the seed at any time:

```bash
supabase db reset
```

The first time, also create the public image bucket the admin uploader uses:

```bash
docker exec supabase_db_FNG psql -U postgres -d postgres \
  -c "insert into storage.buckets (id,name,public) values ('printer-images','printer-images',true) on conflict (id) do update set public=true;"
```

## 2. Start the app (in Docker)

```bash
docker compose up --build
```

The app comes up at **http://localhost:3000**. It reaches Supabase at
`host.docker.internal:54321`. Because the public site reads Supabase entirely
server-side, this single URL is all it needs.

Runtime secrets live in `.env.docker` (gitignored). The default keys are the
standard Supabase local/demo keys — fine for local, never for production.

## Notes

- **Admin panel** (`/admin`, password `fng-admin-2026` from the seed): a couple
  of admin screens call Supabase from the browser. In the containerized setup
  those calls need a browser-reachable URL. For admin work, either run the app
  with `npm run dev` (below) or set `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321`
  before building — the public marketing site does not need this.
- **Run the app on the host instead of in Docker** (fastest inner loop) — point
  `.env.local` at the CLI Supabase and use `npm run dev`:

  ```
  NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from `supabase status`>
  SUPABASE_SERVICE_ROLE_KEY=<service_role key from `supabase status`>
  ADMIN_SESSION_SECRET=<any 32+ char string>
  NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ```

- Run `supabase status` at any time to print the current URL and keys.
- Production build/deploy args (`--build-arg` for a hosted Supabase) are covered
  in `README-DOCKER.md`.
