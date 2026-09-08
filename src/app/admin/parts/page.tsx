'use client';

import React from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ChevronDown, 
  ChevronUp,
  Settings,
  Flame,
  RotateCcw,
  ArrowRightLeft,
  Disc3,
  Cpu,
  ScanLine,
  LayoutGrid
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';
import type { PartsData } from '@/lib/supabase';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  fuser: <Flame size={18} />,
  pickup: <RotateCcw size={18} />,
  transfer: <ArrowRightLeft size={18} />,
  drum: <Disc3 size={18} />,
  formatter: <Cpu size={18} />,
  scanner: <ScanLine size={18} />,
  trays: <LayoutGrid size={18} />,
  maintenance: <Settings size={18} />,
};

export default function AdminPartsPage() {
  const [parts, setParts] = React.useState<PartsData>({});
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>('fuser');
  const { showToast } = useToast();
  // Serialized snapshot of the last loaded/saved state, held in state so the
  // dirty-check below doesn't read a ref during render.
  const [savedSnapshot, setSavedSnapshot] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/parts')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Unexpected response');
        // Every category must be an array — drop anything else so the
        // renderer's .length/.map never hits a non-array.
        const clean: PartsData = {};
        for (const [k, v] of Object.entries(data)) if (Array.isArray(v)) clean[k] = v as PartsData[string];
        setParts(clean);
        setSavedSnapshot(JSON.stringify(clean));
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load parts. Check your connection and refresh.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parts)
      });
      if (res.ok) {
        setSavedSnapshot(JSON.stringify(parts));
        showToast('Parts catalog updated successfully!', 'success');
      } else {
        showToast('Failed to save parts catalog. Please try again.', 'error');
      }
    } catch {
      showToast('Error saving parts.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = savedSnapshot !== null && JSON.stringify(parts) !== savedSnapshot;
  useUnsavedChanges(isDirty);

  const addPart = (category: string) => {
    const newPart = {
      nameEn: 'New Part Name',
      nameAr: 'اسم القطعة الجديدة',
      models: 'HP M402, M404'
    };
    setParts({
      ...parts,
      [category]: [...(parts[category] || []), newPart]
    });
  };

  const updatePart = (category: string, index: number, field: string, value: string) => {
    const updatedCategory = [...parts[category]];
    updatedCategory[index] = { ...updatedCategory[index], [field]: value };
    setParts({ ...parts, [category]: updatedCategory });
  };

  const deletePart = (category: string, index: number) => {
    if (confirm('Remove this part?')) {
      const updatedCategory = parts[category].filter((_, i) => i !== index);
      setParts({ ...parts, [category]: updatedCategory });
    }
  };

  if (loading) return <div>Loading parts catalog...</div>;

  return (
    <div style={{ animation: 'fadeIn var(--admin-duration-page) var(--admin-ease-out)' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Parts Inventory</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Manage printer spare parts, categories, and model compatibility.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.keys(parts).map((category) => {
          const isOpen = expandedCategory === category;
          return (
            <div key={category} className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
              <button 
                onClick={() => setExpandedCategory(isOpen ? null : category)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: isOpen ? '#F8FAFC' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: isOpen ? '1px solid #E2E8F0' : 'none'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(141, 184, 51, 0.1)', color: 'var(--admin-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {CATEGORY_ICONS[category]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'capitalize' }}>{category}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>{parts[category].length} items in category</p>
                </div>
                {isOpen ? <ChevronUp size={20} color="#94A3B8" /> : <ChevronDown size={20} color="#94A3B8" />}
              </button>

              {isOpen && (
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {parts[category].map((part, idx) => (
                      <div key={idx} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr 44px', 
                        gap: '12px', 
                        alignItems: 'center',
                        padding: '12px',
                        background: '#F8FAFC',
                        borderRadius: '12px'
                      }}>
                        <input 
                          className="admin-input" 
                          placeholder="Name (EN)" 
                          value={part.nameEn} 
                          onChange={(e) => updatePart(category, idx, 'nameEn', e.target.value)} 
                        />
                        <input 
                          className="admin-input" 
                          placeholder="Name (AR)" 
                          style={{ fontFamily: 'var(--font-ibm-plex-arabic), sans-serif', direction: 'rtl' }}
                          value={part.nameAr} 
                          onChange={(e) => updatePart(category, idx, 'nameAr', e.target.value)} 
                        />
                        <input 
                          className="admin-input" 
                          placeholder="Compatible Models" 
                          value={part.models} 
                          onChange={(e) => updatePart(category, idx, 'models', e.target.value)} 
                        />
                        <button
                          onClick={() => deletePart(category, idx)}
                          aria-label="Delete part"
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => addPart(category)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      background: 'none', 
                      border: '1px dashed #CBD5E1', 
                      padding: '10px 20px', 
                      borderRadius: '12px',
                      color: '#64748B',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    <Plus size={16} />
                    Add Item to {category}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
