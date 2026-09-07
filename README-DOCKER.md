# Running FNG with Docker

The image is built in two stages (see `Dockerfile`) and ships Next.js's
`standalone` server output, so the final image contains only the production
server and the node modules it actually uses.

## The two kinds of environment variables

| Kind | Examples | When it must be present |
| --- | --- | --- |
| **Build-time** (`NEXT_PUBLIC_*`) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` | Inlined into the client bundle by `next build` — must be passed as `--build-arg` at **build** time. Passing them at run time has no effect. |
| **Runtime secrets** | `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_SESSION_SECRET`, `OPENROUTER_API_KEY`, `WEB3FORMS_ACCESS_KEY` | Read on each request — passed with `--env-file` at **run** time and never baked into an image layer. |

`.env*` files are excluded from the image (`.dockerignore`), so secrets never
end up in a layer.

## Build

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://<project>.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://www.fngtradingco.com" \
  -t fng-web .
```

## Run

Put the runtime secrets in a file (e.g. `.env.local`, which is gitignored):

```
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SESSION_SECRET=...
OPENROUTER_API_KEY=...
WEB3FORMS_ACCESS_KEY=...
```

Then:

```bash
docker run -d --name fng-web -p 3000:3000 --env-file .env.local fng-web
```

The app listens on `http://localhost:3000`.

## Notes

- `ADMIN_SESSION_SECRET` signs the admin session cookie — generate one with
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- The admin password lives in the Supabase `settings` table (managed from
  **Admin → Settings**), not in an env var.
- See `HOSTINGER_DEPLOY.md` for host-specific deployment steps.
