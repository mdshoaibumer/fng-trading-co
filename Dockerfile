# ---- Builder stage: install all deps and build ----
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# NEXT_PUBLIC_* values are inlined into the compiled output by `next build`,
# so they have to be present *here*. Passing them with `docker run -e` has no
# effect — the built bundle already has whatever was set at build time baked
# in. Supply them with --build-arg (see README-DOCKER.md).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NODE_ENV=production

RUN npm run build

# ---- Runtime stage: copy only the standalone server output ----
# `output: 'standalone'` (next.config.ts) emits a self-contained server with
# just the production node_modules it actually uses, so the final image drops
# the full source tree and devDependencies (eslint, vitest, typescript, …).
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Server-only secrets (SUPABASE_SERVICE_ROLE_KEY, ADMIN_SESSION_SECRET,
# OPENROUTER_API_KEY, WEB3FORMS_ACCESS_KEY) are read at runtime, so they are
# passed with `docker run --env-file` and deliberately never baked into a layer.
EXPOSE 3000

CMD ["node", "server.js"]
