FROM node:20-slim

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
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# Server-only secrets (SUPABASE_SERVICE_ROLE_KEY, ADMIN_SESSION_SECRET,
# OPENROUTER_API_KEY, WEB3FORMS_ACCESS_KEY) are read at runtime, so they are
# passed with `docker run --env-file` and deliberately never baked into a layer.
EXPOSE 3000

CMD ["npm", "start"]
