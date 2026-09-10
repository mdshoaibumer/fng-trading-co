#!/usr/bin/env node
/**
 * Builds the hero printer scroll sequence from the Higgsfield story clips.
 *
 *   node scripts/build-printer-frames.mjs <sequence.json> [--out public/printer-hero]
 *
 * sequence.json lists segments in scroll order. Each segment names a source
 * clip and its background-removed twin (`matte`), plus optional `from`/`to`
 * frame bounds, `reverse` and `pingpong`:
 *
 *   { "segments": [
 *       { "label": "open",    "src": "open.mp4",    "matte": "open.bg.mp4" },
 *       { "label": "inspect", "src": "inspect.mp4", "matte": "inspect.bg.mp4", "to": 48, "pingpong": true },
 *       { "label": "close",   "src": "open.mp4",    "matte": "open.bg.mp4", "reverse": true } ] }
 *
 * Higgsfield's video background remover returns an opaque h264 file with the
 * background painted black rather than a real alpha channel, so the alpha is
 * recovered by comparing the two: where the remover kept a pixel it matches
 * the source; where it removed one it's black. That ratio survives the
 * printer's own black internals (toner, rollers), which a plain luma key on
 * the dark studio backdrop would punch holes through.
 *
 * Every frame is then cropped to the union bounding box of the printer across
 * the whole sequence — one shared crop keeps it from jittering — and written
 * as alpha WebP for desktop (every frame) and mobile (every other frame).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const outFlag = args.indexOf('--out');
const outDir = outFlag >= 0 ? args[outFlag + 1] : 'public/printer-hero';
const specPath = args.find((a, i) => a !== '--out' && i !== outFlag + 1);
if (!specPath) {
  console.error('usage: build-printer-frames.mjs <sequence.json> [--out dir]');
  process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const specDir = path.dirname(specPath);

const FPS = 24;
// Alpha = matte / source brightness, remapped so compression noise on the
// removed background reads as fully clear and the kept subject fully solid.
const RATIO_LO = 0.25;
const RATIO_HI = 0.8;
const DARK_FLOOR = 8;
const BBOX_ALPHA = 24;
const BBOX_MIN_PX = 12;
const PAD = 0.03;
const DESKTOP = { dir: 'desktop', stride: 1, maxW: 960, maxH: 960, quality: 66, alphaQuality: 80 };
const MOBILE = { dir: 'mobile', stride: 2, maxW: 560, maxH: 560, quality: 62, alphaQuality: 75 };

const work = mkdtempSync(path.join(tmpdir(), 'printer-frames-'));
let decodeId = 0;

function decode(file) {
  const tag = `d${decodeId++}`;
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.resolve(specDir, file), '-vf', `fps=${FPS}`, '-pix_fmt', 'rgb24', path.join(work, `${tag}_%05d.png`)]);
  return readdirSync(work).filter((f) => f.startsWith(`${tag}_`)).sort().map((f) => path.join(work, f));
}

const clips = new Map();
for (const seg of spec.segments) {
  if (clips.has(seg.src)) continue;
  const orig = decode(seg.src);
  const matte = decode(seg.matte);
  const count = Math.min(orig.length, matte.length);
  clips.set(seg.src, { orig: orig.slice(0, count), matte: matte.slice(0, count) });
  console.log(`${seg.src}: ${count} frames`);
}

// Assemble the scroll order as (clip, frame) references. A segment that
// starts on the exact frame the previous one ended on drops the duplicate.
const sequence = [];
const segmentEnds = [];
for (const seg of spec.segments) {
  const n = clips.get(seg.src).orig.length;
  const from = seg.from ?? 0;
  const to = Math.min(seg.to ?? n - 1, n - 1);
  let idx = Array.from({ length: to - from + 1 }, (_, k) => from + k);
  if (seg.pingpong) idx = [...idx, ...idx.slice(0, -1).reverse()];
  if (seg.reverse) idx.reverse();
  let items = idx.map((i) => ({ src: seg.src, i }));
  const prev = sequence[sequence.length - 1];
  if (prev && prev.src === items[0].src && prev.i === items[0].i) items = items.slice(1);
  sequence.push(...items);
  segmentEnds.push({ label: seg.label, frames: items.length, end: sequence.length });
}

async function buildRgba({ src, i }) {
  const clip = clips.get(src);
  const [o, m] = await Promise.all([
    sharp(clip.orig[i]).raw().toBuffer({ resolveWithObject: true }),
    sharp(clip.matte[i]).raw().toBuffer({ resolveWithObject: true }),
  ]);
  const { width, height } = o.info;
  const out = Buffer.alloc(width * height * 4);
  for (let p = 0, q = 0; p < o.data.length; p += 3, q += 4) {
    const r = o.data[p], g = o.data[p + 1], b = o.data[p + 2];
    const srcMax = Math.max(r, g, b, DARK_FLOOR);
    const matteMax = Math.max(m.data[p], m.data[p + 1], m.data[p + 2]);
    const t = (matteMax / srcMax - RATIO_LO) / (RATIO_HI - RATIO_LO);
    out[q] = r; out[q + 1] = g; out[q + 2] = b;
    out[q + 3] = t <= 0 ? 0 : t >= 1 ? 255 : Math.round(t * t * (3 - 2 * t) * 255);
  }
  return { data: out, width, height };
}

// Bounding box of the printer, ignoring rows/columns with only a handful of
// opaque pixels — a few specks of matte noise at the frame edge in any single
// frame would otherwise stretch the shared crop to the full frame width and
// shrink the printer on the page.
async function alphaBox(rgba) {
  const { data, width, height } = rgba;
  const cols = new Uint32Array(width);
  const rows = new Uint32Array(height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > BBOX_ALPHA) { cols[x]++; rows[y]++; }
    }
  }
  const first = (arr) => arr.findIndex((c) => c >= BBOX_MIN_PX);
  const last = (arr) => { let i = arr.length - 1; while (i >= 0 && arr[i] < BBOX_MIN_PX) i--; return i; };
  return { minX: first(cols), maxX: last(cols), minY: first(rows), maxY: last(rows) };
}

async function pool(items, limit, fn) {
  let next = 0;
  await Promise.all(Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const k = next++;
      await fn(items[k], k);
    }
  }));
}

// Build each unique frame's RGBA once (reversed/ping-pong segments reuse them).
const unique = new Map();
for (const ref of sequence) unique.set(`${ref.src}#${ref.i}`, ref);
const rgbaPath = new Map();
let size = { width: 0, height: 0 };
const union = { minX: Infinity, minY: Infinity, maxX: -1, maxY: -1 };
await pool([...unique.entries()], 6, async ([key, ref]) => {
  const rgba = await buildRgba(ref);
  size = { width: rgba.width, height: rgba.height };
  const b = await alphaBox(rgba);
  if (b.maxX >= 0) {
    union.minX = Math.min(union.minX, b.minX); union.minY = Math.min(union.minY, b.minY);
    union.maxX = Math.max(union.maxX, b.maxX); union.maxY = Math.max(union.maxY, b.maxY);
  }
  const file = path.join(work, `rgba_${rgbaPath.size}_${key.replace(/[^a-z0-9]/gi, '_')}.png`);
  rgbaPath.set(key, file);
  await sharp(rgba.data, { raw: { width: rgba.width, height: rgba.height, channels: 4 } }).png({ compressionLevel: 1 }).toFile(file);
});
if (union.maxX < 0) throw new Error('no opaque pixels found — check the matte clips');

const padX = Math.round((union.maxX - union.minX) * PAD);
const padY = Math.round((union.maxY - union.minY) * PAD);
const crop = { left: Math.max(0, union.minX - padX), top: Math.max(0, union.minY - padY) };
crop.width = Math.min(size.width, union.maxX + padX + 1) - crop.left;
crop.height = Math.min(size.height, union.maxY + padY + 1) - crop.top;
console.log('crop', crop, `of ${size.width}x${size.height}`);

rmSync(outDir, { recursive: true, force: true });
const counts = {};
for (const variant of [DESKTOP, MOBILE]) {
  const dir = path.join(outDir, variant.dir);
  mkdirSync(dir, { recursive: true });
  const picked = sequence.filter((_, k) => k % variant.stride === 0);
  await pool(picked, 8, (ref, k) => sharp(rgbaPath.get(`${ref.src}#${ref.i}`))
    .extract(crop)
    .resize({ width: variant.maxW, height: variant.maxH, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: variant.quality, alphaQuality: variant.alphaQuality, effort: 6, smartSubsample: true })
    .toFile(path.join(dir, `${String(k + 1).padStart(4, '0')}.webp`)));
  counts[variant.dir] = picked.length;
}

// Fraction of the sequence where each segment ends — the hook's phase table
// is tuned against these.
const segments = segmentEnds.map((s) => ({ label: s.label, frames: s.frames, end: Number((s.end / sequence.length).toFixed(4)) }));
const manifest = { fps: FPS, crop: { ...crop, of: size }, frames: counts, segments };
writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
rmSync(work, { recursive: true, force: true });
