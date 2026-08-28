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
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AvailabilityToggle from '@/components/admin/AvailabilityToggle';
import type { Product } from '@/lib/supabase';

// The admin form also lets editors set an Arabic name override, which isn't
// part of the Product type consumed by the public site (nothing currently
// reads it back out) — kept here as-is rather than scope-creeping into that.
type AdminProduct = Product & { nameAr?: string };

const COMMON_FEATURES_EN = [
  "Ergonomic Design",
  "Lumbar Support",
  "Adjustable Height",
  "HD Display",
  "Energy Efficient",
  "Like-new Condition",
  "Tested & Certified",
  "Premium Materials",
  "1-Year Warranty"
];

const COMMON_FEATURES_AR = [
  "تصميم مريح",
  "دعم أسفل الظهر",
  "ارتفاع قابل للتعديل",
  "شاشة عالية الدقة",
  "موفر للطاقة",
  "بحالة كالجديد",
  "مفحوص ومعتمد",
  "مواد عالية الجودة",
  "ضمان لمدة عام"
];

export default function AdminEquipmentPage() {
  const [printers, setPrinters] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const { showToast } = useToast();

  React.useEffect(() => {
    fetch('/api/admin/equipment')
      .then(res => res.json())
      .then(data => {
        setPrinters(data);
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load equipment. Check your connection and refresh.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(printers)
      });
      if (res.ok) showToast('Equipment updated successfully!', 'success');
      else showToast('Failed to save equipment. Please try again.', 'error');
    } catch {
      showToast('Error saving equipment.', 'error');
    } finally {
      setSaving(false);
    }
  };



  const addPrinter = () => {
    const newPrinter = {
      id: `eq-${Date.now()}`,
      name: 'New Office Equipment',
      descEn: 'Product description goes here...',
      descAr: 'وصف المنتج هنا...',
      featuresEn: ['Ergonomic Design'],
      featuresAr: ['تصميم مريح'],
      images: ['/placeholder.png'],
      specsEn: { 'Material': 'Ergonomic Mesh' },
      specsAr: { 'المادة': 'شبك مريح' },
      available: true
    };
    setPrinters([...printers, newPrinter]);
    setEditingId(newPrinter.id);
  };

  const deletePrinter = (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      setPrinters(printers.filter(p => p.id !== id));
    }
  };

  const updatePrinter = (id: string, field: string, value: unknown) => {
    setPrinters(printers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) return <div>Loading equipment catalog...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <AdminPageHeader
        title="Office Equipment Catalog"
        subtitle="Manage refurbished office equipment like chairs, monitors, and more."
        actions={
          <>
            <button onClick={addPrinter} className="btn-admin" style={{ background: '#1E293B', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={18} />
              Add New Equipment
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {printers.length === 0 && (
          <div className="admin-card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            No equipment yet. Click &quot;Add New Equipment&quot; to create your first listing.
          </div>
        )}
        {printers.map((printer) => (
          <div key={printer.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header / Summary */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: editingId === printer.id ? '#F8FAFC' : '#fff' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {printer.images?.[0] ? <Image src={printer.images[0]} alt={printer.name || ''} fill sizes="80px" style={{ objectFit: 'contain' }} /> : <ImageIcon color="#94A3B8" />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800 }}>{printer.name}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>ID: {printer.id}</p>
              </div>
              
              {/* Availability Toggle */}
              <AvailabilityToggle
                available={printer.available}
                onToggle={() => updatePrinter(printer.id, 'available', !printer.available)}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingId(editingId === printer.id ? null : printer.id)} aria-label={editingId === printer.id ? 'Collapse editor' : 'Edit equipment'} className="btn-admin" style={{ background: '#F1F5F9', padding: '8px 12px' }}>
                  {editingId === printer.id ? <ChevronUp size={18} /> : <Edit3 size={18} />}
                </button>
                <button onClick={() => deletePrinter(printer.id)} aria-label="Delete equipment" className="btn-admin" style={{ background: '#FEF2F2', color: '#EF4444', padding: '8px 12px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Detailed Editor */}
            {editingId === printer.id && (
              <div style={{ padding: '32px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  {/* English Info */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', color: 'var(--admin-accent)' }}>ENGLISH CONTENT</h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label className="admin-label">Product Name</label>
                        <input className="admin-input" value={printer.name} onChange={(e) => updatePrinter(printer.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="admin-label">Description (EN)</label>
                        <textarea className="admin-input" style={{ height: '100px' }} value={printer.descEn} onChange={(e) => updatePrinter(printer.id, 'descEn', e.target.value)} />
                      </div>

                      {/* Features (EN) */}
                      <div>
                        <label className="admin-label">Features (Bullet Points)</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(printer.featuresEn || []).map((feat: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                              <input className="admin-input" value={feat} onChange={(e) => {
                                const newFeats = [...(printer.featuresEn || [])];
                                newFeats[idx] = e.target.value;
                                updatePrinter(printer.id, 'featuresEn', newFeats);
                              }} />
                              <button onClick={() => updatePrinter(printer.id, 'featuresEn', printer.featuresEn.filter((_, i) => i !== idx))} aria-label="Remove feature" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => updatePrinter(printer.id, 'featuresEn', [...(printer.featuresEn || []), ''])} style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>+ Add Custom Feature</button>
                            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>|</span>
                            <select 
                              onChange={(e) => {
                                if (e.target.value) {
                                  updatePrinter(printer.id, 'featuresEn', [...(printer.featuresEn || []), e.target.value]);
                                  e.target.value = '';
                                }
                              }} 
                              className="admin-input" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', flex: 1, cursor: 'pointer' }}
                            >
                              <option value="">+ Select a preset feature...</option>
                              {COMMON_FEATURES_EN.map(f => (
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
                          {Object.entries(printer.specsEn || {}).map(([key, val]) => (
                            <div key={key} style={{ display: 'flex', gap: '8px' }}>
                              <input className="admin-input" style={{ flex: 1 }} defaultValue={key} onBlur={(e) => {
                                const newKey = e.target.value;
                                if (newKey && newKey !== key) {
                                  const newSpecs = { ...printer.specsEn };
                                  delete newSpecs[key];
                                  newSpecs[newKey] = val;
                                  updatePrinter(printer.id, 'specsEn', newSpecs);
                                }
                              }} placeholder="Key (e.g. Print Speed)" />
                              <input className="admin-input" style={{ flex: 2 }} value={val as string} onChange={(e) => {
                                updatePrinter(printer.id, 'specsEn', { ...printer.specsEn, [key]: e.target.value });
                              }} placeholder="Value" />
                              <button onClick={() => {
                                const newSpecs = { ...printer.specsEn };
                                delete newSpecs[key];
                                updatePrinter(printer.id, 'specsEn', newSpecs);
                              }} aria-label="Remove specification" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={() => updatePrinter(printer.id, 'specsEn', { ...(printer.specsEn || {}), [`New Spec ${Date.now()}`]: '' })} style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: 'fit-content' }}>+ Add Specification</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arabic Info */}
                  <div style={{ direction: 'rtl' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', color: 'var(--admin-accent)', textAlign: 'right' }}>المحتوى العربي</h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>اسم المنتج</label>
                        <input className="admin-input" value={printer.nameAr || printer.name} onChange={(e) => updatePrinter(printer.id, 'nameAr', e.target.value)} />
                      </div>
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>الوصف (AR)</label>
                        <textarea className="admin-input" style={{ height: '100px', fontFamily: 'var(--font-ibm-plex-arabic), sans-serif' }} value={printer.descAr} onChange={(e) => updatePrinter(printer.id, 'descAr', e.target.value)} />
                      </div>

                      {/* Features (AR) */}
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>المميزات (نقاط)</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(printer.featuresAr || []).map((feat: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', flexDirection: 'row-reverse' }}>
                              <input className="admin-input" style={{ fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', textAlign: 'right' }} value={feat} onChange={(e) => {
                                const newFeats = [...(printer.featuresAr || [])];
                                newFeats[idx] = e.target.value;
                                updatePrinter(printer.id, 'featuresAr', newFeats);
                              }} />
                              <button onClick={() => updatePrinter(printer.id, 'featuresAr', printer.featuresAr.filter((_, i) => i !== idx))} aria-label="حذف الميزة" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexDirection: 'row-reverse', marginLeft: 'auto' }}>
                            <button onClick={() => updatePrinter(printer.id, 'featuresAr', [...(printer.featuresAr || []), ''])} style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right' }}>+ إضافة ميزة يدوياً</button>
                            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>|</span>
                            <select 
                              onChange={(e) => {
                                if (e.target.value) {
                                  updatePrinter(printer.id, 'featuresAr', [...(printer.featuresAr || []), e.target.value]);
                                  e.target.value = '';
                                }
                              }} 
                              className="admin-input" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', cursor: 'pointer' }}
                              dir="rtl"
                            >
                              <option value="">+ اختر ميزة جاهزة...</option>
                              {COMMON_FEATURES_AR.map(f => (
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
                          {Object.entries(printer.specsAr || {}).map(([key, val]) => (
                            <div key={key} style={{ display: 'flex', gap: '8px', flexDirection: 'row-reverse' }}>
                              <input className="admin-input" style={{ flex: 1, fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', textAlign: 'right' }} defaultValue={key} onBlur={(e) => {
                                const newKey = e.target.value;
                                if (newKey && newKey !== key) {
                                  const newSpecs = { ...printer.specsAr };
                                  delete newSpecs[key];
                                  newSpecs[newKey] = val;
                                  updatePrinter(printer.id, 'specsAr', newSpecs);
                                }
                              }} placeholder="الخاصية (مثل سرعة الطباعة)" />
                              <input className="admin-input" style={{ flex: 2, fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', textAlign: 'right' }} value={val as string} onChange={(e) => {
                                updatePrinter(printer.id, 'specsAr', { ...printer.specsAr, [key]: e.target.value });
                              }} placeholder="القيمة" />
                              <button onClick={() => {
                                const newSpecs = { ...printer.specsAr };
                                delete newSpecs[key];
                                updatePrinter(printer.id, 'specsAr', newSpecs);
                              }} aria-label="حذف المواصفة" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={() => updatePrinter(printer.id, 'specsAr', { ...(printer.specsAr || {}), [`خاصية جديدة ${Date.now()}`]: '' })} style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', width: 'fit-content', marginLeft: 'auto' }}>+ إضافة مواصفة</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <MultiImageUploader
                  images={printer.images || []}
                  onImagesChange={(newImages) => updatePrinter(printer.id, 'images', newImages)}
                  productId={printer.id}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
