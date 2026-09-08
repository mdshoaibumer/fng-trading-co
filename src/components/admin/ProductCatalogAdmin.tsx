'use client';

import React from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Save,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AvailabilityToggle from '@/components/admin/AvailabilityToggle';
import type { Product } from '@/lib/supabase';

// The admin form also lets editors set an Arabic name override, which isn't
// part of the Product type consumed by the public site (nothing currently
// reads it back out) — kept here as-is rather than scope-creeping into that.
export type AdminProduct = Product & { nameAr?: string };

/**
 * The printer and office-equipment admin catalogs were ~90% identical
 * copy-paste of each other (same state, same fetch/save, same collapsible
 * EN/AR editor, same MultiImageUploader). This is the single shared editor
 * they both render; the per-catalog differences (API endpoint, preset feature
 * lists, new-item template, and all display copy) come in through `config`.
 */
export interface ProductCatalogConfig {
  /** Admin API segment — reads/writes `/api/admin/${endpoint}`. */
  endpoint: 'printers' | 'equipment';
  title: string;
  subtitle: string;
  addLabel: string;
  editAria: string;
  deleteAria: string;
  emptyText: string;
  deleteConfirm: string;
  loadingText: string;
  toasts: {
    loadError: string;
    saveSuccess: string;
    saveError: string;
    saveException: string;
  };
  presetFeaturesEn: string[];
  presetFeaturesAr: string[];
  /** Produces the seed object for a freshly added catalog item. */
  makeNewItem: () => AdminProduct;
}

export default function ProductCatalogAdmin({ config }: { config: ProductCatalogConfig }) {
  const [items, setItems] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const { showToast } = useToast();
  // Serialized snapshot of the last loaded/saved state; the page is "dirty"
  // when the live items no longer match it. Held in state (not a ref) so the
  // dirty-check below doesn't read a ref during render.
  const [savedSnapshot, setSavedSnapshot] = React.useState<string | null>(null);

  const apiPath = `/api/admin/${config.endpoint}`;

  React.useEffect(() => {
    fetch(apiPath)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Unexpected response');
        setItems(data);
        setSavedSnapshot(JSON.stringify(data));
        setLoading(false);
      })
      .catch(() => {
        showToast(config.toasts.loadError, 'error');
        setLoading(false);
      });
  }, [apiPath, config.toasts.loadError, showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      });
      if (res.ok) {
        setSavedSnapshot(JSON.stringify(items));
        showToast(config.toasts.saveSuccess, 'success');
      } else {
        showToast(config.toasts.saveError, 'error');
      }
    } catch {
      showToast(config.toasts.saveException, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Unsaved-changes guard: warns on tab close / refresh and on sidebar nav.
  const isDirty = savedSnapshot !== null && JSON.stringify(items) !== savedSnapshot;
  useUnsavedChanges(isDirty);

  const addItem = () => {
    const newItem = config.makeNewItem();
    setItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const deleteItem = (id: string) => {
    if (confirm(config.deleteConfirm)) {
      setItems(items.filter(p => p.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: unknown) => {
    setItems(items.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) return <div>{config.loadingText}</div>;

  return (
    <div style={{ animation: 'fadeIn var(--admin-duration-page) var(--admin-ease-out)' }}>
      <AdminPageHeader
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <>
            <button onClick={addItem} className="btn-admin" style={{ background: '#1E293B', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} />
              {config.addLabel}
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.length === 0 && (
          <div className="admin-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            {config.emptyText}
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header / Summary */}
            <div className="printer-card-header" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', background: editingId === item.id ? '#F8FAFC' : '#fff' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {item.images?.[0] ? <Image src={item.images[0]} alt={item.name || ''} fill sizes="72px" style={{ objectFit: 'contain' }} /> : <ImageIcon color="#94A3B8" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>ID: {item.id}</p>
              </div>

              {/* Availability Toggle */}
              <AvailabilityToggle
                available={item.available}
                onToggle={() => updateItem(item.id, 'available', !item.available)}
                className="printer-availability-badge"
                size="sm"
              />

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setEditingId(editingId === item.id ? null : item.id)} aria-label={editingId === item.id ? 'Collapse editor' : config.editAria} className="btn-admin" style={{ background: '#F1F5F9', padding: '8px 12px' }}>
                  {editingId === item.id ? <ChevronUp size={18} /> : <Edit3 size={18} />}
                </button>
                <button onClick={() => deleteItem(item.id)} aria-label={config.deleteAria} className="btn-admin" style={{ background: '#FEF2F2', color: '#EF4444', padding: '8px 12px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Detailed Editor */}
            {editingId === item.id && (
              <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>
                <div className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                  {/* English Info */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', color: 'var(--admin-accent-text)' }}>ENGLISH CONTENT</h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label className="admin-label">Product Name</label>
                        <input className="admin-input" aria-label="Product name (English)" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="admin-label">Description (EN)</label>
                        <textarea className="admin-input" aria-label="Description (English)" style={{ height: '100px' }} value={item.descEn} onChange={(e) => updateItem(item.id, 'descEn', e.target.value)} />
                      </div>

                      {/* Features (EN) */}
                      <div>
                        <label className="admin-label">Features (Bullet Points)</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(item.featuresEn || []).map((feat: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                              <input className="admin-input" value={feat} onChange={(e) => {
                                const newFeats = [...(item.featuresEn || [])];
                                newFeats[idx] = e.target.value;
                                updateItem(item.id, 'featuresEn', newFeats);
                              }} />
                              <button onClick={() => updateItem(item.id, 'featuresEn', item.featuresEn.filter((_, i) => i !== idx))} aria-label="Remove feature" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => updateItem(item.id, 'featuresEn', [...(item.featuresEn || []), ''])} style={{ fontSize: '0.8rem', color: 'var(--admin-accent-text)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>+ Add Custom Feature</button>
                            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>|</span>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateItem(item.id, 'featuresEn', [...(item.featuresEn || []), e.target.value]);
                                  e.target.value = '';
                                }
                              }}
                              className="admin-input"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', flex: 1, cursor: 'pointer' }}
                            >
                              <option value="">+ Select a preset feature...</option>
                              {config.presetFeaturesEn.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Specs (EN) */}
                      <div>
                        <label className="admin-label">Technical Specifications</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {Object.entries(item.specsEn || {}).map(([key, val]) => (
                            <div key={key} style={{ display: 'flex', gap: '8px' }}>
                              <input className="admin-input" style={{ flex: 1 }} defaultValue={key} onBlur={(e) => {
                                const newKey = e.target.value;
                                if (newKey && newKey !== key) {
                                  const newSpecs = { ...item.specsEn };
                                  delete newSpecs[key];
                                  newSpecs[newKey] = val;
                                  updateItem(item.id, 'specsEn', newSpecs);
                                }
                              }} placeholder="Key (e.g. Print Speed)" />
                              <input className="admin-input" style={{ flex: 2 }} value={val as string} onChange={(e) => {
                                updateItem(item.id, 'specsEn', { ...item.specsEn, [key]: e.target.value });
                              }} placeholder="Value" />
                              <button onClick={() => {
                                const newSpecs = { ...item.specsEn };
                                delete newSpecs[key];
                                updateItem(item.id, 'specsEn', newSpecs);
                              }} aria-label="Remove specification" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={() => updateItem(item.id, 'specsEn', { ...(item.specsEn || {}), [`New Spec ${Date.now()}`]: '' })} style={{ fontSize: '0.8rem', color: 'var(--admin-accent-text)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: 'fit-content' }}>+ Add Specification</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arabic Info */}
                  <div style={{ direction: 'rtl' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', color: 'var(--admin-accent-text)', textAlign: 'right' }}>المحتوى العربي</h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {/* No Arabic name field: product names are model numbers
                          (e.g. "HP LaserJet M428fdw") and the catalog table has
                          a single `name` column, so the old input here looked
                          editable but never saved anywhere. */}
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>الوصف (AR)</label>
                        <textarea className="admin-input" aria-label="Description (Arabic)" style={{ height: '100px', fontFamily: 'var(--font-ibm-plex-arabic), sans-serif' }} value={item.descAr} onChange={(e) => updateItem(item.id, 'descAr', e.target.value)} />
                      </div>

                      {/* Features (AR) */}
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>المميزات (نقاط)</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(item.featuresAr || []).map((feat: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', flexDirection: 'row-reverse' }}>
                              <input className="admin-input" style={{ fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', textAlign: 'right' }} value={feat} onChange={(e) => {
                                const newFeats = [...(item.featuresAr || [])];
                                newFeats[idx] = e.target.value;
                                updateItem(item.id, 'featuresAr', newFeats);
                              }} />
                              <button onClick={() => updateItem(item.id, 'featuresAr', item.featuresAr.filter((_, i) => i !== idx))} aria-label="حذف الميزة" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexDirection: 'row-reverse', marginLeft: 'auto' }}>
                            <button onClick={() => updateItem(item.id, 'featuresAr', [...(item.featuresAr || []), ''])} style={{ fontSize: '0.8rem', color: 'var(--admin-accent-text)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right' }}>+ إضافة ميزة يدوياً</button>
                            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>|</span>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateItem(item.id, 'featuresAr', [...(item.featuresAr || []), e.target.value]);
                                  e.target.value = '';
                                }
                              }}
                              className="admin-input"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', cursor: 'pointer' }}
                              dir="rtl"
                            >
                              <option value="">+ اختر ميزة جاهزة...</option>
                              {config.presetFeaturesAr.map(f => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Specs (AR) */}
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>المواصفات الفنية</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {Object.entries(item.specsAr || {}).map(([key, val]) => (
                            <div key={key} style={{ display: 'flex', gap: '8px', flexDirection: 'row-reverse' }}>
                              <input className="admin-input" style={{ flex: 1, fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', textAlign: 'right' }} defaultValue={key} onBlur={(e) => {
                                const newKey = e.target.value;
                                if (newKey && newKey !== key) {
                                  const newSpecs = { ...item.specsAr };
                                  delete newSpecs[key];
                                  newSpecs[newKey] = val;
                                  updateItem(item.id, 'specsAr', newSpecs);
                                }
                              }} placeholder="الخاصية (مثل سرعة الطباعة)" />
                              <input className="admin-input" style={{ flex: 2, fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', textAlign: 'right' }} value={val as string} onChange={(e) => {
                                updateItem(item.id, 'specsAr', { ...item.specsAr, [key]: e.target.value });
                              }} placeholder="القيمة" />
                              <button onClick={() => {
                                const newSpecs = { ...item.specsAr };
                                delete newSpecs[key];
                                updateItem(item.id, 'specsAr', newSpecs);
                              }} aria-label="حذف المواصفة" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={() => updateItem(item.id, 'specsAr', { ...(item.specsAr || {}), [`خاصية جديدة ${Date.now()}`]: '' })} style={{ fontSize: '0.8rem', color: 'var(--admin-accent-text)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', width: 'fit-content', marginLeft: 'auto' }}>+ إضافة مواصفة</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <MultiImageUploader
                  images={item.images || []}
                  onImagesChange={(newImages) => updateItem(item.id, 'images', newImages)}
                  productId={item.id}
                  showToast={showToast}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .admin-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 6px;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
