/**
 * Copies the `printers` table from the production Supabase project into the
 * local development one, so `next dev` shows the same catalog the live site
 * does instead of whatever happens to be in the local Docker database.
 *
 * Direction is fixed and one-way: it READS from the project in .env.local
 * (production) and WRITES to the project in .env.development.local (local
 * Docker). Writing is refused outright unless the destination resolves to
 * localhost, so a mixed-up env file can't push local rows over the live site.
 *
 * Dry-run by default, matching scripts/seed.js:
 *   node scripts/sync-printers-to-dev.js            # show what would change
 *   node scripts/sync-printers-to-dev.js --confirm  # actually write
 */
const fs = require('fs');
const path = require('path');

const CONFIRMED = process.argv.includes('--confirm');

function readEnv(file) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.error(`Missing ${file}`);
    process.exit(1);
  }
  const out = {};
  for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const i = line.indexOf('=');
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

function client(env, file) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error(`${file} is missing NEXT_PUBLIC_SUPABASE_URL or a Supabase key`);
    process.exit(1);
  }
  return { url, key };
}

const isLocal = (url) => /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?/i.test(url);

async function rest(target, pathAndQuery, init = {}) {
  const res = await fetch(`${target.url}/rest/v1/${pathAndQuery}`, {
    ...init,
    headers: {
      apikey: target.key,
      Authorization: `Bearer ${target.key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${body.slice(0, 300)}`);
  // `Prefer: return=minimal` answers 201 with an empty body, not just 204.
  return body ? JSON.parse(body) : null;
}

async function main() {
  const source = client(readEnv('.env.local'), '.env.local');
  const dest = client(readEnv('.env.development.local'), '.env.development.local');

  if (!isLocal(dest.url)) {
    console.error(
      `Refusing to run: the destination (.env.development.local) is ${dest.url},\n` +
      'which is not a local Supabase instance. This script only ever writes to localhost.'
    );
    process.exit(1);
  }
  if (isLocal(source.url)) {
    console.error(`Refusing to run: the source (.env.local) is ${source.url}, which is already local — nothing to copy from.`);
    process.exit(1);
  }

  const rows = await rest(source, 'printers?select=*&order=created_at.asc');
  const existing = await rest(dest, 'printers?select=id');
  const have = new Set(existing.map((r) => r.id));

  console.log(`source (production): ${source.url} — ${rows.length} row(s)`);
  console.log(`destination (local): ${dest.url} — ${existing.length} row(s)\n`);
  for (const r of rows) {
    const kind = r.id.startsWith('eq-') ? 'equipment' : 'printer';
    console.log(`  ${have.has(r.id) ? 'update' : 'insert'}  ${r.id}  [${kind}]  ${r.name}`);
  }

  if (!CONFIRMED) {
    console.log('\n[dry run] Nothing was written. Re-run with --confirm to apply:');
    console.log('  node scripts/sync-printers-to-dev.js --confirm');
    return;
  }

  // Upsert rather than replace: rows added locally that production doesn't
  // have are left alone, so this never destroys local-only test data.
  await rest(dest, 'printers?on_conflict=id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(rows),
  });

  const after = await rest(dest, 'printers?select=id');
  console.log(`\nDone. Local now has ${after.length} row(s).`);
}

main().catch((err) => {
  console.error('Sync failed:', err.message);
  process.exit(1);
});
