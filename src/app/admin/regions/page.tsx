'use client';

import React from 'react';
import { Plus, Trash2, Save, ArrowUp, ArrowDown, RotateCcw, Globe2, Building2 } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';
import type { ServiceRegion } from '@/lib/serviceRegions';

/**
 * Editor for the service-region footprint — the country list that feeds the
 * footer's "Operating in" line, the contact page's office cards and market
 * chips, both contact forms' country pickers, the sourcing globe's markers and
 * routes, the AI assistant's system prompt, and the JSON-LD `areaServed` data.
 *
 * Latitude/longitude are held as strings while editing so a half-typed value
 * ("-", "24.") doesn't collapse to NaN mid-keystroke; they are converted and
 * range-checked on save.
 */

interface RegionRow {
  code: string;
  nameEn: string;
  nameAr: string;
  flag: string;
  hubEn: string;
  hubAr: string;
  lat: string;
  lng: string;
  presence: 'office' | 'market';
}

const toRow = (r: ServiceRegion): RegionRow => ({
  code: r.code,
  nameEn: r.nameEn,
  nameAr: r.nameAr,
  flag: r.flag,
  hubEn: r.hubEn,
  hubAr: r.hubAr,
  lat: String(r.hub[0]),
  lng: String(r.hub[1]),
  presence: r.presence,
});

const BLANK: RegionRow = {
  code: '', nameEn: '', nameAr: '', flag: '', hubEn: '', hubAr: '', lat: '', lng: '', presence: 'market',
};

/** Mirrors the API's zod schema so mistakes surface before a round trip. */
function validate(rows: RegionRow[]): string[] {
  const errors: string[] = [];
  if (rows.length === 0) errors.push('Add at least one country.');

  const seen = new Set<string>();
  rows.forEach((r, i) => {
    const where = `Row ${i + 1}${r.nameEn ? ` (${r.nameEn})` : ''}`;
    const code = r.code.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code)) errors.push(`${where}: country code must be two letters (e.g. SA).`);
    else if (seen.has(code)) errors.push(`${where}: duplicate country code ${code}.`);
    seen.add(code);

    for (const [label, value] of [
      ['English name', r.nameEn], ['Arabic name', r.nameAr], ['flag', r.flag],
      ['English hub city', r.hubEn], ['Arabic hub city', r.hubAr],
    ] as const) {
      if (!value.trim()) errors.push(`${where}: ${label} is required.`);
    }

    const lat = Number(r.lat);
    const lng = Number(r.lng);
    if (r.lat.trim() === '' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.push(`${where}: latitude must be a number between -90 and 90.`);
    }
    if (r.lng.trim() === '' || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.push(`${where}: longitude must be a number between -180 and 180.`);
    }
  });

  if (rows.length > 0 && !rows.some((r) => r.presence === 'office')) {
    errors.push('At least one country must be marked as an Office — the globe and the contact forms anchor to it.');
  }
  return errors;
}

export default function AdminRegionsPage() {
  const [rows, setRows] = React.useState<RegionRow[]>([]);
  const [defaults, setDefaults] = React.useState<ServiceRegion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const { showToast } = useToast();
  // Serialized snapshot of the last loaded/saved state, held in state so the
  // dirty-check below doesn't read a ref during render.
  const [savedSnapshot, setSavedSnapshot] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/regions')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || !Array.isArray(data.regions)) throw new Error('Unexpected response');
        const loadedRows = data.regions.map(toRow);
        setRows(loadedRows);
        setSavedSnapshot(JSON.stringify(loadedRows));
        setDefaults(Array.isArray(data.defaults) ? data.defaults : []);
      })
      .catch(() => showToast('Failed to load regions. Check your connection and refresh.', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const isDirty = savedSnapshot !== null && JSON.stringify(rows) !== savedSnapshot;
  useUnsavedChanges(isDirty);

  const update = (index: number, field: keyof RegionRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    setRows((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (index: number) => {
    if (!confirm(`Remove ${rows[index].nameEn || 'this country'} from the footprint?`)) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const restoreDefaults = () => {
    if (defaults.length === 0) return;
    if (!confirm('Replace the current list with the built-in default footprint? Unsaved edits will be lost.')) return;
    setRows(defaults.map(toRow));
  };

  const handleSave = async () => {
    const errors = validate(rows);
    if (errors.length > 0) {
      showToast(errors[0] + (errors.length > 1 ? ` (+${errors.length - 1} more)` : ''), 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        regions: rows.map((r) => ({
          code: r.code.trim().toUpperCase(),
          nameEn: r.nameEn.trim(),
          nameAr: r.nameAr.trim(),
          flag: r.flag.trim(),
          hubEn: r.hubEn.trim(),
          hubAr: r.hubAr.trim(),
          hub: [Number(r.lat), Number(r.lng)] as [number, number],
          presence: r.presence,
        })),
      };
      const res = await fetch('/api/admin/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSavedSnapshot(JSON.stringify(rows));
        showToast(`Saved ${payload.regions.length} countries. The public site will refresh shortly.`, 'success');
      } else {
        const body = await res.json().catch(() => null);
        showToast(body?.issues?.[0] || body?.error || 'Failed to save regions. Please try again.', 'error');
      }
    } catch {
      showToast('Error saving regions.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading regions...</div>;

  const officeCount = rows.filter((r) => r.presence === 'office').length;
  const errors = validate(rows);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Regions</h1>
          <p style={{ color: '#64748B', margin: 0, maxWidth: '640px' }}>
            The countries FNG operates in. Drives the footer&apos;s &ldquo;Operating in&rdquo; line, the contact
            page&apos;s office cards and country pickers, the sourcing globe, the AI assistant and the site&apos;s
            search-engine data. Order matters — countries appear in this order, and the first Office is the hub
            every market route on the globe connects back to.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={restoreDefaults} className="btn-admin" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RotateCcw size={16} />
            Restore defaults
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(141,184,51,0.1)', color: '#5C7F1F', fontWeight: 700, fontSize: '0.85rem' }}>
          <Globe2 size={16} /> {rows.length} countries
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>
          <Building2 size={16} /> {officeCount} with an office
        </span>
      </div>

      {errors.length > 0 && (
        <div className="admin-card" style={{ marginBottom: '20px', borderLeft: '4px solid #EF4444', background: '#FEF2F2' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#B91C1C' }}>Fix before saving</p>
          <ul style={{ margin: 0, paddingInlineStart: '20px', color: '#B91C1C', fontSize: '0.87rem', lineHeight: 1.7 }}>
            {errors.slice(0, 6).map((e) => <li key={e}>{e}</li>)}
            {errors.length > 6 && <li>…and {errors.length - 6} more.</li>}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rows.map((r, i) => (
          <div key={i} className="admin-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-ibm-plex-mono), monospace', fontWeight: 800, fontSize: '0.8rem', color: '#94A3B8', minWidth: '24px' }}>
                {i + 1}
              </span>
              <strong style={{ flex: 1, fontSize: '0.95rem', color: '#0F172A' }}>
                {r.flag} {r.nameEn || 'New country'}
              </strong>
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"
                style={{ background: 'none', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', color: i === 0 ? '#CBD5E1' : '#64748B', padding: '6px' }}>
                <ArrowUp size={16} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down"
                style={{ background: 'none', border: 'none', cursor: i === rows.length - 1 ? 'not-allowed' : 'pointer', color: i === rows.length - 1 ? '#CBD5E1' : '#64748B', padding: '6px' }}>
                <ArrowDown size={16} />
              </button>
              <button onClick={() => remove(i)} aria-label={`Remove ${r.nameEn || 'country'}`}
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }}>
                <Trash2 size={16} />
              </button>
            </div>

            <div className="region-grid" style={{ display: 'grid', gridTemplateColumns: '90px 90px 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input className="admin-input" placeholder="SA" maxLength={2} aria-label="Country code"
                value={r.code} onChange={(e) => update(i, 'code', e.target.value.toUpperCase())}
                style={{ textTransform: 'uppercase', fontFamily: 'var(--font-ibm-plex-mono), monospace' }} />
              <input className="admin-input" placeholder="🇸🇦" aria-label="Flag emoji"
                value={r.flag} onChange={(e) => update(i, 'flag', e.target.value)} />
              <input className="admin-input" placeholder="Country name (EN)" aria-label="Country name in English"
                value={r.nameEn} onChange={(e) => update(i, 'nameEn', e.target.value)} />
              <input className="admin-input" placeholder="اسم الدولة" aria-label="Country name in Arabic"
                style={{ fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', direction: 'rtl' }}
                value={r.nameAr} onChange={(e) => update(i, 'nameAr', e.target.value)} />
            </div>

            <div className="region-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 110px 110px 130px', gap: '10px' }}>
              <input className="admin-input" placeholder="Hub city (EN)" aria-label="Hub city in English"
                value={r.hubEn} onChange={(e) => update(i, 'hubEn', e.target.value)} />
              <input className="admin-input" placeholder="المدينة" aria-label="Hub city in Arabic"
                style={{ fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', direction: 'rtl' }}
                value={r.hubAr} onChange={(e) => update(i, 'hubAr', e.target.value)} />
              <input className="admin-input" placeholder="Latitude" inputMode="decimal" aria-label="Latitude"
                value={r.lat} onChange={(e) => update(i, 'lat', e.target.value)} />
              <input className="admin-input" placeholder="Longitude" inputMode="decimal" aria-label="Longitude"
                value={r.lng} onChange={(e) => update(i, 'lng', e.target.value)} />
              <select className="admin-input" aria-label="Presence"
                value={r.presence} onChange={(e) => update(i, 'presence', e.target.value)}>
                <option value="office">Office</option>
                <option value="market">Market</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setRows((prev) => [...prev, { ...BLANK }])}
        className="btn-admin"
        style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Plus size={18} />
        Add country
      </button>

      <p style={{ marginTop: '20px', color: '#64748B', fontSize: '0.84rem', lineHeight: 1.7, maxWidth: '760px' }}>
        <strong>Latitude and longitude</strong> place the country&apos;s dot on the sourcing globe — latitude runs
        &minus;90 to 90 (north positive), longitude &minus;180 to 180 (east positive). <strong>Office</strong>{' '}
        countries are named in full in the footer, get a card on the contact page and a shipping route from China on
        the globe; <strong>Market</strong> countries are counted as &ldquo;&amp; N more markets&rdquo; and route
        through the first office. A newly added office country shows its hub city on the contact page until a
        translated address is added for its code in <code>messages/en.json</code> and <code>messages/ar.json</code>.
      </p>

      <style jsx>{`
        @media (max-width: 900px) {
          .region-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
