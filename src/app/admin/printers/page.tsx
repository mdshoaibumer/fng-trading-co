'use client';

import React from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Save,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import MultiImageUploader from '@/components/admin/MultiImageUploader';
import type { Product } from '@/lib/supabase';

// The admin form also lets editors set an Arabic name override, which isn't
// part of the Product type consumed by the public site (nothing currently
// reads it back out) — kept here as-is rather than scope-creeping into that.
type AdminProduct = Product & { nameAr?: string };

const COMMON_FEATURES_EN = [
  "Fully inspected & tested",
  "Vibrant Color Output",
  "OEM-grade components",
  "Factory-spec restoration",
  "High-volume trays",
  "Enterprise security",
  "Certified refurbished",
  "Wireless & duplex",
  "Quality guaranteed"
];

const COMMON_FEATURES_AR = [
  "مفحوصة ومختبرة بالكامل",
  "ألوان نابضة بالحياة",
  "مكونات بمعايير OEM",
  "استعادة بمواصفات المصنع",
  "أدراج عالية السعة",
  "أمان مؤسسي",
  "مُجددة معتمدة",
  "لاسلكية ومزدوجة",
  "جودة مضمونة"
];

export default function AdminPrintersPage() {
  const [printers, setPrinters] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const { showToast } = useToast();

  React.useEffect(() => {
    fetch('/api/admin/printers')
      .then(res => res.json())
      .then(data => {
        setPrinters(data);
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load printers. Check your connection and refresh.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/printers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(printers)
      });
      if (res.ok) showToast('Printers updated successfully!', 'success');
    } catch {
      showToast('Error saving printers.', 'error');
    } finally {
      setSaving(false);
    }
  };



  const addPrinter = () => {
    const newPrinter = {
      id: `hp-${Date.now()}`,
      name: 'New HP Printer',
      descEn: 'Product description goes here...',
      descAr: 'وصف المنتج هنا...',
      featuresEn: ['High Quality'],
      featuresAr: ['جودة عالية'],
      images: ['/placeholder.png'],
      specsEn: { 'Print Speed': '30 ppm' },
      specsAr: { 'سرعة الطباعة': '٣٠ صفحة' },
      available: true
    };
    setPrinters([...printers, newPrinter]);
    setEditingId(newPrinter.id);
  };

  const deletePrinter = (id: string) => {
    if (confirm('Are you sure you want to remove this printer?')) {
      setPrinters(printers.filter(p => p.id !== id));
    }
  };

  const updatePrinter = (id: string, field: string, value: unknown) => {
    setPrinters(printers.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) return <div>Loading printer catalog...</div>;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Printer Catalog</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Manage refurbished HP printers, descriptions, specs, and availability.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={addPrinter} className="btn-admin" style={{ background: '#1E293B', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            Add New Printer
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {printers.map((printer) => (
          <div key={printer.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header / Summary */}
            <div className="printer-card-header" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', background: editingId === printer.id ? '#F8FAFC' : '#fff' }}>
              <div style={{ width: '72px', height: '72px', background: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                {printer.images?.[0] ? <img src={printer.images[0]} alt={printer.name || ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageIcon color="#94A3B8" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{printer.name}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>ID: {printer.id}</p>
              </div>
              
              {/* Availability Toggle */}
              <div className="printer-availability-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', background: printer.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '99px', flexShrink: 0 }}>
                {printer.available ? <CheckCircle2 size={15} color="#10B981" /> : <XCircle size={15} color="#EF4444" />}
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: printer.available ? '#10B981' : '#EF4444' }}>
                  {printer.available ? 'AVAILABLE' : 'OUT OF STOCK'}
                </span>
                <button 
                  onClick={() => updatePrinter(printer.id, 'available', !printer.available)}
                  style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'underline', flexShrink: 0 }}
                >
                  Toggle
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setEditingId(editingId === printer.id ? null : printer.id)} className="btn-admin" style={{ background: '#F1F5F9', padding: '8px 12px' }}>
                  {editingId === printer.id ? <ChevronUp size={18} /> : <Edit3 size={18} />}
                </button>
                <button onClick={() => deletePrinter(printer.id)} className="btn-admin" style={{ background: '#FEF2F2', color: '#EF4444', padding: '8px 12px' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Detailed Editor */}
            {editingId === printer.id && (
              <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', background: '#FFFFFF' }}>
                <div className="admin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
                  {/* English Info */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', color: '#8DB833' }}>ENGLISH CONTENT</h4>
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
                              <button onClick={() => updatePrinter(printer.id, 'featuresEn', printer.featuresEn.filter((_, i) => i !== idx))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button onClick={() => updatePrinter(printer.id, 'featuresEn', [...(printer.featuresEn || []), ''])} style={{ fontSize: '0.8rem', color: '#8DB833', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>+ Add Custom Feature</button>
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
                              }} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={() => updatePrinter(printer.id, 'specsEn', { ...(printer.specsEn || {}), [`New Spec ${Date.now()}`]: '' })} style={{ fontSize: '0.8rem', color: '#8DB833', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: 'fit-content' }}>+ Add Specification</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arabic Info */}
                  <div style={{ direction: 'rtl' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', color: '#8DB833', textAlign: 'right' }}>المحتوى العربي</h4>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>اسم المنتج</label>
                        <input className="admin-input" value={printer.nameAr || printer.name} onChange={(e) => updatePrinter(printer.id, 'nameAr', e.target.value)} />
                      </div>
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>الوصف (AR)</label>
                        <textarea className="admin-input" style={{ height: '100px', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} value={printer.descAr} onChange={(e) => updatePrinter(printer.id, 'descAr', e.target.value)} />
                      </div>

                      {/* Features (AR) */}
                      <div>
                        <label className="admin-label" style={{ textAlign: 'right', display: 'block' }}>المميزات (نقاط)</label>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {(printer.featuresAr || []).map((feat: string, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', flexDirection: 'row-reverse' }}>
                              <input className="admin-input" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', textAlign: 'right' }} value={feat} onChange={(e) => {
                                const newFeats = [...(printer.featuresAr || [])];
                                newFeats[idx] = e.target.value;
                                updatePrinter(printer.id, 'featuresAr', newFeats);
                              }} />
                              <button onClick={() => updatePrinter(printer.id, 'featuresAr', printer.featuresAr.filter((_, i) => i !== idx))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexDirection: 'row-reverse', marginLeft: 'auto' }}>
                            <button onClick={() => updatePrinter(printer.id, 'featuresAr', [...(printer.featuresAr || []), ''])} style={{ fontSize: '0.8rem', color: '#8DB833', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right' }}>+ إضافة ميزة يدوياً</button>
                            <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>|</span>
                            <select 
                              onChange={(e) => {
                                if (e.target.value) {
                                  updatePrinter(printer.id, 'featuresAr', [...(printer.featuresAr || []), e.target.value]);
                                  e.target.value = '';
                                }
                              }} 
                              className="admin-input" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer' }}
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
                              <input className="admin-input" style={{ flex: 1, fontFamily: 'IBM Plex Sans Arabic, sans-serif', textAlign: 'right' }} defaultValue={key} onBlur={(e) => {
                                const newKey = e.target.value;
                                if (newKey && newKey !== key) {
                                  const newSpecs = { ...printer.specsAr };
                                  delete newSpecs[key];
                                  newSpecs[newKey] = val;
                                  updatePrinter(printer.id, 'specsAr', newSpecs);
                                }
                              }} placeholder="الخاصية (مثل سرعة الطباعة)" />
                              <input className="admin-input" style={{ flex: 2, fontFamily: 'IBM Plex Sans Arabic, sans-serif', textAlign: 'right' }} value={val as string} onChange={(e) => {
                                updatePrinter(printer.id, 'specsAr', { ...printer.specsAr, [key]: e.target.value });
                              }} placeholder="القيمة" />
                              <button onClick={() => {
                                const newSpecs = { ...printer.specsAr };
                                delete newSpecs[key];
                                updatePrinter(printer.id, 'specsAr', newSpecs);
                              }} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                          ))}
                          <button onClick={() => updatePrinter(printer.id, 'specsAr', { ...(printer.specsAr || {}), [`خاصية جديدة ${Date.now()}`]: '' })} style={{ fontSize: '0.8rem', color: '#8DB833', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', width: 'fit-content', marginLeft: 'auto' }}>+ إضافة مواصفة</button>
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
