'use client';

import React from 'react';
import { Save, Search } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

type ContentData = Record<string, Record<string, Record<string, unknown>>>;

export default function AdminContentPage() {
  const [data, setData] = React.useState<ContentData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'en' | 'ar'>('en');
  const { showToast } = useToast();

  React.useEffect(() => {
    fetch('/api/admin/content')
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load content. Check your connection and refresh.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) showToast('Content updated successfully!', 'success');
      else showToast('Failed to update content.', 'error');
    } catch {
      showToast('Error saving content.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (lang: string, section: string, key: string, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [lang]: {
          ...prev[lang],
          [section]: {
            ...prev[lang][section],
            [key]: value
          }
        }
      };
    });
  };

  if (loading) return <div>Loading translations...</div>;
  if (!data) return <div>Failed to load content. Refresh to try again.</div>;

  const sections = Object.keys(data.en).filter(s => s !== 'meta'); // Exclude meta for simpler UI for now

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Site Content Editor</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Edit all text and translations across the platform in real-time.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-admin btn-admin-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {saving ? 'Saving Changes...' : 'Save All Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          background: '#E2E8F0', 
          padding: '4px', 
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          <button 
            onClick={() => setActiveTab('en')}
            style={{
              padding: '8px 24px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'en' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'en' ? '#0F172A' : '#64748B',
              transition: 'all 0.2s'
            }}
          >
            English (EN)
          </button>
          <button 
            onClick={() => setActiveTab('ar')}
            style={{
              padding: '8px 24px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeTab === 'ar' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'ar' ? '#0F172A' : '#64748B',
              transition: 'all 0.2s'
            }}
          >
            Arabic (AR)
          </button>
        </div>

        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input 
            type="text" 
            placeholder="Search for translation keys or text..." 
            className="admin-input"
            style={{ paddingLeft: '48px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {sections.map(section => (
          <div key={section} className="admin-card">
            <h3 style={{ 
              textTransform: 'uppercase', 
              fontSize: '0.8rem', 
              letterSpacing: '1px', 
              color: '#64748B', 
              marginBottom: '20px',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '12px'
            }}>
              Section: <span style={{ color: '#8DB833', fontWeight: 800 }}>{section}</span>
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {Object.keys(data[activeTab][section]).map(key => {
                const value = data[activeTab][section][key];
                if (typeof value !== 'string') return null; // Handle nested objects if any later
                if (search && !key.toLowerCase().includes(search.toLowerCase()) && !value.toLowerCase().includes(search.toLowerCase())) return null;

                return (
                  <div key={key} style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', alignItems: 'flex-start' }}>
                    <div style={{ paddingTop: '10px' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B' }}>{key}</label>
                      <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '4px 0 0' }}>Internal Identifier</p>
                    </div>
                    <textarea 
                      className="admin-input"
                      style={{ 
                        minHeight: '44px', 
                        resize: 'vertical',
                        fontFamily: activeTab === 'ar' ? 'IBM Plex Sans Arabic, sans-serif' : 'inherit',
                        direction: activeTab === 'ar' ? 'rtl' : 'ltr'
                      }}
                      value={value}
                      onChange={(e) => updateValue(activeTab, section, key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
