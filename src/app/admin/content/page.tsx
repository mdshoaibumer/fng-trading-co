'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Save,
  Search,
  ChevronDown,
  ChevronRight,
  Layers,
  Home,
  Package,
  Building2,
  Navigation,
  Scale,
  SlidersHorizontal,
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { useUnsavedChanges } from '@/lib/useUnsavedChanges';

type ContentData = Record<string, Record<string, unknown>>;

interface LeafField {
  fullPath: string[];
  section: string;
  keyPath: string;
  label: string;
  value: string;
}

type CategoryKey = 'sourcing' | 'home' | 'products' | 'company' | 'navigation' | 'legal' | 'all';

interface CategoryConfig {
  key: CategoryKey;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  description: string;
  sections: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'sourcing',
    label: 'Sourcing Page',
    icon: <Layers size={18} />,
    badge: 'China Sourcing',
    description: 'Hero, 7-Step Process, Categories, Enterprise Systems, Services & Value Pillars',
    sections: ['sourcingHero', 'sourcingProcess', 'sourcingCategories', 'sourcingSystems', 'sourcingServices', 'sourcingWhy', 'navSourcing'],
  },
  {
    key: 'home',
    label: 'Home Page',
    icon: <Home size={18} />,
    description: 'Hero, Free Printer Program, Eco Inks, How It Works, Industries & Testimonials',
    sections: ['hero', 'freePrinter', 'ecoInks', 'howItWorks', 'industries', 'sustainability', 'trust', 'maintenanceTeaser'],
  },
  {
    key: 'products',
    label: 'Products & Supplies',
    icon: <Package size={18} />,
    description: 'Eco-Toner cartridges and LaserJet replacement spare parts',
    sections: ['tonerProducts', 'printerPartsPage'],
  },
  {
    key: 'company',
    label: 'Company & Info',
    icon: <Building2 size={18} />,
    description: 'About Us, Industry Sectors, FAQ, Operating Countries & Contact Details',
    sections: ['aboutPage', 'industriesPage', 'faqPage', 'operatingCountries', 'contactPage', 'contact'],
  },
  {
    key: 'navigation',
    label: 'Nav & SEO',
    icon: <Navigation size={18} />,
    description: 'Header menus, footer columns, SEO metadata, and regional gates',
    sections: ['nav', 'footer', 'seo', 'gate', 'meta'],
  },
  {
    key: 'legal',
    label: 'Legal & Policies',
    icon: <Scale size={18} />,
    description: 'Privacy Policy and Terms of Service agreements',
    sections: ['privacyPage', 'termsPage'],
  },
  {
    key: 'all',
    label: 'All Sections',
    icon: <SlidersHorizontal size={18} />,
    description: 'Comprehensive directory of all website content across all pages',
    sections: [],
  },
];

const SECTION_METADATA: Record<string, { title: string; desc: string }> = {
  sourcingHero: { title: 'Sourcing: Hero & Stats', desc: 'Hero headline, kicker, subtitle, CTAs, and verified factory/MOQ stats' },
  sourcingProcess: { title: 'Sourcing: 7-Step Process', desc: 'End-to-end workflow steps (Inquiry, QC, Freight, SABER Customs, Delivery)' },
  sourcingCategories: { title: 'Sourcing: Product Categories', desc: 'Computers, Mobile Accessories, Chargers, Audio, Wearables, etc.' },
  sourcingSystems: { title: 'Sourcing: Enterprise Systems', desc: 'Enterprise Systems Catalog, ZATCA HS, CITC Type Approval & equipment groups' },
  sourcingServices: { title: 'Sourcing: Services & Operations', desc: 'Supplier verification, factory audits, sampling, and customs clearance' },
  sourcingWhy: { title: 'Sourcing: Why Source With Us', desc: 'Core advantages, local presence, and verified China supply chain pillars' },
  navSourcing: { title: 'Sourcing: Nav Link', desc: 'Navigation bar link text for electronics sourcing' },
  hero: { title: 'Home: Hero Section', desc: 'Main headline, subtitle, CTAs, and trust metrics' },
  freePrinter: { title: 'Home: Free Printer Model', desc: 'Free printer proposition, ink supply, and earning steps' },
  ecoInks: { title: 'Home: Eco-Friendly Inks', desc: 'Bio-toner specifications, benefits, and cartridge recycling' },
  howItWorks: { title: 'Home: How It Works', desc: 'Step-by-step printer request, delivery, and ink supply flow' },
  industries: { title: 'Home: Industries Served', desc: 'Key client sectors (Healthcare, Education, Legal, Government, etc.)' },
  sustainability: { title: 'Home: Sustainability & Vision 2030', desc: 'E-waste diverted, CO2 reduction, and circular economy metrics' },
  trust: { title: 'Home: Trust & Warranties', desc: 'Client testimonials, certifications, and maintenance guarantees' },
  maintenanceTeaser: { title: 'Home: Maintenance Teaser', desc: '24/7 service and preventive maintenance banner' },
  tonerProducts: { title: 'Products: Toner Cartridges', desc: 'Green toner and Premium cartridge line specs and features' },
  printerPartsPage: { title: 'Products: Printer Spare Parts', desc: 'Fusers, rollers, drums, formatters, and maintenance kits' },
  aboutPage: { title: 'Company: About Us', desc: 'Mission, Vision 2030 alignment, leadership, and company milestones' },
  industriesPage: { title: 'Company: Industries In-Depth', desc: 'Sector-specific solutions and case studies' },
  faqPage: { title: 'Company: FAQ', desc: 'Frequently asked questions about printers, ink, warranties, and shipping' },
  operatingCountries: { title: 'Company: Operating Regions', desc: 'Coverage across Saudi Arabia and GCC hubs' },
  contactPage: { title: 'Company: Contact Page', desc: 'Office locations, email, phone, and inquiry forms' },
  contact: { title: 'Global: Contact Snippets', desc: 'Floating buttons, footer contacts, and lead prompts' },
  nav: { title: 'Navigation: Header Menu', desc: 'Header menu labels, buttons, and mobile drawer items' },
  footer: { title: 'Navigation: Footer', desc: 'Footer columns, copyright, links, and disclaimers' },
  seo: { title: 'SEO: Meta Titles & Descriptions', desc: 'Page-level meta titles and OpenGraph descriptions' },
  gate: { title: 'System: Access Gate', desc: 'Regional/country routing and confirmation gates' },
  meta: { title: 'System: General Meta', desc: 'Brand naming and default site metadata' },
  privacyPage: { title: 'Legal: Privacy Policy', desc: 'Data protection and privacy terms' },
  termsPage: { title: 'Legal: Terms of Service', desc: 'Enterprise terms, rental conditions, and service level agreements' },
};

function formatFieldLabel(keyPath: string): string {
  const parts = keyPath.split('.');
  return parts
    .map((part) => {
      if (/^s\d+$/i.test(part)) {
        return `Step ${part.replace(/\D/g, '').padStart(2, '0')}`;
      }
      if (/^p\d+$/i.test(part)) {
        return `Point ${part.replace(/\D/g, '').padStart(2, '0')}`;
      }
      if (/^\d+$/.test(part)) {
        return `#${Number(part) + 1}`;
      }
      return part
        .replace(/([A-Z])/g, ' $1')
        .replace(/[_-]/g, ' ')
        .replace(/^\w/, (c) => c.toUpperCase())
        .trim();
    })
    .join(' › ');
}

function extractLeafFields(val: unknown, path: string[] = []): LeafField[] {
  const fields: LeafField[] = [];
  if (typeof val === 'string') {
    const section = path[0];
    const keyPath = path.slice(1).join('.');
    fields.push({
      fullPath: path,
      section,
      keyPath,
      label: formatFieldLabel(keyPath),
      value: val,
    });
  } else if (Array.isArray(val)) {
    val.forEach((item, idx) => {
      fields.push(...extractLeafFields(item, [...path, idx.toString()]));
    });
  } else if (val !== null && typeof val === 'object') {
    for (const k of Object.keys(val as Record<string, unknown>)) {
      fields.push(...extractLeafFields((val as Record<string, unknown>)[k], [...path, k]));
    }
  }
  return fields;
}

function AdminContentEditor() {
  const searchParams = useSearchParams();
  const urlPageParam = searchParams.get('page');

  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('sourcing');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (urlPageParam && CATEGORIES.some((c) => c.key === urlPageParam)) {
      setActiveCategory(urlPageParam as CategoryKey);
    }
  }, [urlPageParam]);

  useEffect(() => {
    fetch('/api/admin/content')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!body || typeof body !== 'object') throw new Error('Unexpected response');
        const loaded: ContentData = { en: body.en ?? {}, ar: body.ar ?? {} };
        setData(loaded);
        setSavedSnapshot(JSON.stringify(loaded));
        setLoading(false);
      })
      .catch(() => {
        showToast('Failed to load content. Check your connection and refresh.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSavedSnapshot(JSON.stringify(data));
        showToast('All translations updated and cached site refreshed!', 'success');
      } else {
        showToast('Failed to update content.', 'error');
      }
    } catch {
      showToast('Error saving content.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = savedSnapshot !== null && JSON.stringify(data) !== savedSnapshot;
  useUnsavedChanges(isDirty);

  const updateNestedValue = (lang: string, fullPath: string[], value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[lang]) copy[lang] = {};
      let cur = copy[lang];
      for (let i = 0; i < fullPath.length - 1; i++) {
        const segment = fullPath[i];
        if (!cur[segment] || typeof cur[segment] !== 'object') {
          const nextSegment = fullPath[i + 1];
          cur[segment] = /^\d+$/.test(nextSegment) ? [] : {};
        }
        cur = cur[segment];
      }
      cur[fullPath[fullPath.length - 1]] = value;
      return copy;
    });
  };

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Extract all leaf fields for active language
  const allLeafFields = useMemo(() => {
    if (!data || !data[activeTab]) return [];
    return extractLeafFields(data[activeTab]);
  }, [data, activeTab]);

  // Group leaf fields by section
  const fieldsBySection = useMemo(() => {
    const map = new Map<string, LeafField[]>();
    for (const f of allLeafFields) {
      if (!map.has(f.section)) {
        map.set(f.section, []);
      }
      map.get(f.section)!.push(f);
    }
    return map;
  }, [allLeafFields]);

  // Determine which sections to show based on selected Category and Search
  const currentCategoryConfig = CATEGORIES.find((c) => c.key === activeCategory) || CATEGORIES[0];

  const visibleSections = useMemo(() => {
    const allKnownSections = Array.from(fieldsBySection.keys());
    let filtered =
      currentCategoryConfig.key === 'all'
        ? allKnownSections
        : currentCategoryConfig.sections.filter((s) => allKnownSections.includes(s));

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((sec) => {
        if (sec.toLowerCase().includes(q)) return true;
        const meta = SECTION_METADATA[sec];
        if (meta && (meta.title.toLowerCase().includes(q) || meta.desc.toLowerCase().includes(q))) return true;
        const fields = fieldsBySection.get(sec) || [];
        return fields.some(
          (f) =>
            f.keyPath.toLowerCase().includes(q) ||
            f.label.toLowerCase().includes(q) ||
            f.value.toLowerCase().includes(q)
        );
      });
    }

    return filtered;
  }, [currentCategoryConfig, fieldsBySection, search]);

  const totalVisibleFields = useMemo(() => {
    let count = 0;
    const q = search.toLowerCase().trim();
    for (const sec of visibleSections) {
      const fields = fieldsBySection.get(sec) || [];
      if (!q) {
        count += fields.length;
      } else {
        count += fields.filter(
          (f) =>
            f.keyPath.toLowerCase().includes(q) ||
            f.label.toLowerCase().includes(q) ||
            f.value.toLowerCase().includes(q)
        ).length;
      }
    }
    return count;
  }, [visibleSections, fieldsBySection, search]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ fontWeight: 600 }}>Loading platform translations & sourcing catalogs...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
        <p style={{ fontWeight: 700 }}>Failed to load content. Please refresh or check connection.</p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn var(--admin-duration-page) var(--admin-ease-out)' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Site Content & Sourcing CMS
            </h1>
            {isDirty && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid #FDE68A',
                }}
              >
                ● Unsaved Changes
              </span>
            )}
          </div>
          <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
            Live content manager for all bilingual copy, product categories, 7-step sourcing process, and enterprise specs.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Switcher */}
          <div
            style={{
              display: 'flex',
              background: '#E2E8F0',
              padding: '4px',
              borderRadius: '12px',
            }}
          >
            <button
              onClick={() => setActiveTab('en')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: activeTab === 'en' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'en' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all var(--admin-duration-fast)',
              }}
            >
              English (EN)
            </button>
            <button
              onClick={() => setActiveTab('ar')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                background: activeTab === 'ar' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'ar' ? '#0F172A' : '#64748B',
                boxShadow: activeTab === 'ar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all var(--admin-duration-fast)',
              }}
            >
              العربية (AR)
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-admin btn-admin-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              fontSize: '0.92rem',
              fontWeight: 700,
            }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {/* Page / Category Navigation Tabs */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            scrollbarWidth: 'thin',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: isActive ? '1px solid var(--admin-accent)' : '1px solid #E2E8F0',
                  background: isActive ? 'var(--admin-accent)' : '#FFFFFF',
                  color: isActive ? '#0F172A' : '#475569',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 8px rgba(141,184,51,0.25)' : 'none',
                  transition: 'all var(--admin-duration-fast)',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.badge && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '8px',
                      background: isActive ? '#0F172A' : 'rgba(141,184,51,0.2)',
                      color: isActive ? '#FFFFFF' : 'var(--admin-accent-text)',
                    }}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div
          style={{
            marginTop: '12px',
            background: activeCategory === 'sourcing' ? 'rgba(141,184,51,0.08)' : '#F8FAFC',
            border: activeCategory === 'sourcing' ? '1px solid rgba(141,184,51,0.3)' : '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: activeCategory === 'sourcing' ? 'var(--admin-accent-text)' : '#64748B' }}>
              {currentCategoryConfig.icon}
            </span>
            <div>
              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>
                {currentCategoryConfig.label} Content
              </span>
              <span style={{ color: '#64748B', fontSize: '0.85rem', marginLeft: '8px' }}>
                — {currentCategoryConfig.description}
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
            Showing <strong>{visibleSections.length}</strong> sections ({totalVisibleFields} editable fields)
          </div>
        </div>
      </div>

      {/* Search Bar & Global Expand Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748B',
            }}
          />
          <input
            type="text"
            placeholder="Search keys, labels, process steps, categories, or text (e.g. 'SABER', 'MOQ', 'computers')..."
            className="admin-input"
            style={{ paddingLeft: '48px', height: '44px', fontSize: '0.9rem' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCollapsedSections({})}
            className="btn-admin btn-admin-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            Expand All
          </button>
          <button
            onClick={() => {
              const allCollapsed: Record<string, boolean> = {};
              visibleSections.forEach((s) => (allCollapsed[s] = true));
              setCollapsedSections(allCollapsed);
            }}
            className="btn-admin btn-admin-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Sections List */}
      {visibleSections.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
          <Search size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
            No matching fields found
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Try adjusting your search query or switch to another page category tab above.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {visibleSections.map((section) => {
            const isCollapsed = Boolean(collapsedSections[section]);
            const meta = SECTION_METADATA[section];
            const allFields = fieldsBySection.get(section) || [];
            const q = search.toLowerCase().trim();
            const fields = q
              ? allFields.filter(
                  (f) =>
                    f.keyPath.toLowerCase().includes(q) ||
                    f.label.toLowerCase().includes(q) ||
                    f.value.toLowerCase().includes(q)
                )
              : allFields;

            if (fields.length === 0) return null;

            const isSourcingSection = section.startsWith('sourcing') || section === 'navSourcing';

            return (
              <div
                key={section}
                className="admin-card"
                style={{
                  borderLeft: isSourcingSection ? '4px solid var(--admin-accent)' : undefined,
                  transition: 'all var(--admin-duration-fast)',
                }}
              >
                {/* Section Header */}
                <div
                  onClick={() => toggleSection(section)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    paddingBottom: isCollapsed ? 0 : '18px',
                    borderBottom: isCollapsed ? 'none' : '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        color: '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          {meta?.title || section}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            background: '#F1F5F9',
                            color: '#475569',
                            padding: '2px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {section}
                        </span>
                        {isSourcingSection && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              background: 'rgba(141,184,51,0.18)',
                              color: 'var(--admin-accent-text)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            SOURCING
                          </span>
                        )}
                      </div>
                      {meta?.desc && (
                        <p style={{ margin: '4px 0 0', fontSize: '0.83rem', color: '#64748B' }}>
                          {meta.desc}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#64748B',
                        background: '#F8FAFC',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      {fields.length} {fields.length === 1 ? 'field' : 'fields'}
                    </span>
                  </div>
                </div>

                {/* Section Content Fields */}
                {!isCollapsed && (
                  <div style={{ display: 'grid', gap: '18px', marginTop: '18px' }}>
                    {fields.map((field) => {
                      const isArabic = activeTab === 'ar';
                      const isMultiLine = field.value.length > 80 || field.keyPath.includes('desc') || field.keyPath.includes('subtitle');

                      return (
                        <div
                          key={field.fullPath.join('.')}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(200px, 280px) 1fr',
                            gap: '20px',
                            alignItems: 'flex-start',
                            padding: '12px 14px',
                            background: '#FAFBF9',
                            borderRadius: '8px',
                            border: '1px solid #F0F2EB',
                          }}
                        >
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                color: '#1E293B',
                                lineHeight: 1.3,
                              }}
                            >
                              {field.label}
                            </label>
                            <span
                              style={{
                                display: 'inline-block',
                                fontFamily: 'monospace',
                                fontSize: '0.72rem',
                                color: '#94A3B8',
                                marginTop: '4px',
                                wordBreak: 'break-all',
                              }}
                            >
                              {field.keyPath}
                            </span>
                          </div>

                          <div>
                            {isMultiLine ? (
                              <textarea
                                className="admin-input"
                                rows={Math.min(6, Math.max(2, Math.ceil(field.value.length / 70)))}
                                style={{
                                  fontFamily: isArabic ? 'var(--font-ibm-plex-arabic), sans-serif' : 'inherit',
                                  direction: isArabic ? 'rtl' : 'ltr',
                                  fontSize: '0.9rem',
                                  lineHeight: 1.45,
                                  resize: 'vertical',
                                  background: '#FFFFFF',
                                }}
                                value={field.value}
                                onChange={(e) => updateNestedValue(activeTab, field.fullPath, e.target.value)}
                              />
                            ) : (
                              <input
                                type="text"
                                className="admin-input"
                                style={{
                                  fontFamily: isArabic ? 'var(--font-ibm-plex-arabic), sans-serif' : 'inherit',
                                  direction: isArabic ? 'rtl' : 'ltr',
                                  fontSize: '0.9rem',
                                  height: '42px',
                                  background: '#FFFFFF',
                                }}
                                value={field.value}
                                onChange={(e) => updateNestedValue(activeTab, field.fullPath, e.target.value)}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminContentPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600 }}>Loading CMS editor...</p>
        </div>
      }
    >
      <AdminContentEditor />
    </Suspense>
  );
}
