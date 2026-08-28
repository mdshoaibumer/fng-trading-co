# Hostinger Deploy Notes

Deploy this project as a Node.js / Next.js web app, not as a static `public_html` upload.

## Hostinger settings

- Framework: Next.js
- Build command: `npm run build`
- Start command: `npm run start`
- Node version: Node 20 or newer if available

## Environment variables

Add these in Hostinger hPanel for the app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_PASSWORD`

Use the real values from your local `.env.local`, but do not upload `.env.local` publicly.

## Upload package

Upload `fng-hostinger-deploy.zip` if using Hostinger's file upload option. Hostinger should install dependencies and run the build command.
