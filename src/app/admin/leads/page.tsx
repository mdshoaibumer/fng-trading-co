'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Trash2,
  Download,
  Filter,
  Loader2,
  MessageCircle,
  Phone as PhoneIcon,
  Mail,
  Building2,
  ChevronDown,
  RefreshCw,
  MapPin,
  Briefcase,
  Hash,
  Tag
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed'] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  contacted: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
  qualified: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
  closed: { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748B' },
};

export const LEAD_CATEGORY_MAP: Record<string, { label: string; bg: string; color: string }> = {
  printer_request: { label: 'Printer Request', bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' },
  printer: { label: 'Printer Inquiry', bg: 'rgba(99, 102, 241, 0.1)', color: '#6366F1' },
  eco_inks: { label: 'Eco Inks', bg: 'rgba(16, 185, 129, 0.12)', color: '#059669' },
  printer_parts: { label: 'Spare Parts', bg: 'rgba(245, 158, 11, 0.12)', color: '#D97706' },
  office_equipment: { label: 'Office Equipment', bg: 'rgba(139, 92, 246, 0.12)', color: '#7C3AED' },
  sourcing: { label: 'China Sourcing', bg: 'rgba(14, 165, 233, 0.12)', color: '#0284C7' },
  contact: { label: 'Contact Form', bg: 'rgba(141, 184, 51, 0.14)', color: 'var(--admin-accent-text)' },
  general: { label: 'General Inquiry', bg: 'rgba(141, 184, 51, 0.14)', color: 'var(--admin-accent-text)' },
};

export function parseLeadMessage(rawMessage?: string) {
  if (!rawMessage) return { queryItem: null, messageText: '' };
  const match = rawMessage.match(/^\[Query:\s*([^\]]+)\]\s*\n?([\s\S]*)$/i);
  if (match) {
    return {
      queryItem: match[1].trim(),
      messageText: match[2].trim(),
    };
  }
  return { queryItem: null, messageText: rawMessage.trim() };
}

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  type?: string;
  status?: string;
  message?: string;
  country?: string;
  city?: string;
  industry?: string;
  quantity?: string;
  created_at?: string;
}

// Every value is quoted with embedded quotes doubled (RFC 4180), and cells
// that a spreadsheet would evaluate as a formula (=, +, -, @ ...) get a
// leading apostrophe - lead names/companies come straight from the public form.
function csvCell(value: unknown): string {
  let v = value == null ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } else {
        // A failed load (auth expiry, server/Supabase outage) must NOT read as
        // "0 leads" — that is a false, business-critical signal on a lead-gen
        // site. Surface a distinct, retryable error instead.
        setError(true);
        setLeads([]);
        showToast('Failed to load leads', 'error');
      }
    } catch {
      setError(true);
      setLeads([]);
      showToast('Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchLeads is intentionally shared with the search form and refresh
    // button below and already has full try/catch/finally handling —
    // duplicating the fetch logic just to satisfy this lint rule would be
    // worse, not better.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        showToast(`Lead status updated to "${status}"`, 'success');
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
        showToast('Lead deleted successfully', 'success');
      } else {
        showToast('Failed to delete lead', 'error');
      }
    } catch {
      showToast('Failed to delete lead', 'error');
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) {
      showToast('No leads to export', 'info');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Country', 'City', 'Industry', 'Quantity', 'Type', 'Status', 'Message', 'Date'];
    const rows = leads.map(l => [
      l.name, l.email, l.phone, l.company, l.country, l.city, l.industry, l.quantity, l.type, l.status, l.message,
      l.created_at ? new Date(l.created_at).toLocaleDateString() : ''
    ]);
    const csv = [headers.map(csvCell).join(','), ...rows.map(r => r.map(csvCell).join(','))].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fng-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully', 'success');
  };

  return (
    <div style={{ animation: 'fadeIn var(--admin-duration-page) var(--admin-ease-out)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Leads & Inquiries</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Manage all incoming leads from Contact and Printer Request forms.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={exportCSV} className="btn-admin" style={{ background: '#E2E8F0', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} />
            Export CSV
          </button>
          <button onClick={fetchLeads} disabled={loading} className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={18} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            aria-label="Search leads by name, email, phone, or company"
            placeholder="Search by name, email, phone, or company..."
            className="admin-input"
            style={{ paddingLeft: '48px', width: '100%', height: '44px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Filter size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
          <select
            className="admin-input"
            aria-label="Filter leads by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ paddingLeft: '40px', paddingRight: '40px', minWidth: '160px', height: '44px', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Leads Count */}
      <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '16px', fontWeight: 600 }}>
        {loading ? 'Loading...' : error ? '' : `${leads.length} lead${leads.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Leads Table */}
      {loading ? (
        <div role="status" aria-live="polite" style={{ display: 'flex', height: '30vh', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Loading leads…</span>
        </div>
      ) : error ? (
        <div className="admin-card" role="alert" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <MessageCircle size={40} color="#EF4444" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#0F172A', fontSize: '1rem', fontWeight: 700 }}>Couldn&apos;t load leads</p>
          <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '420px', margin: '4px auto 0' }}>
            There was a problem reaching the server. Your leads are safe — this is a loading error, not an empty inbox.
          </p>
          <button onClick={fetchLeads} className="btn-admin btn-admin-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      ) : leads.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <MessageCircle size={40} color="#CBD5E1" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: 600 }}>No leads found</p>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Incoming inquiries will appear here automatically.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leads.map(lead => {
            const initials = (lead.name || 'U').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
            const categoryConfig = LEAD_CATEGORY_MAP[lead.type || ''] || LEAD_CATEGORY_MAP.contact;
            const sc = STATUS_COLORS[lead.status || 'new'] || STATUS_COLORS.new;
            const parsed = parseLeadMessage(lead.message);

            return (
              <div key={lead.id} className="admin-card" style={{ padding: '18px 22px' }}>
                <div className="lead-card-inner" style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#475569', fontSize: '0.92rem', flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>{lead.name}</span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px',
                        background: categoryConfig.bg,
                        color: categoryConfig.color,
                        border: `1px solid ${categoryConfig.color}30`
                      }}>
                        {categoryConfig.label}
                      </span>
                      {parsed.queryItem && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '8px',
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          border: '1px solid #BFDBFE'
                        }}>
                          <Tag size={11} />
                          {parsed.queryItem}
                        </span>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 12px', fontSize: '0.84rem', color: '#475569', marginBottom: parsed.messageText ? '10px' : 0 }}>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#475569', textDecoration: 'none', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          <Mail size={13} color="#64748B" /> {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#475569', textDecoration: 'none', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          <PhoneIcon size={13} color="#64748B" /> {lead.phone}
                        </a>
                      )}
                      {lead.company && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          <Building2 size={13} color="#64748B" /> {lead.company}
                        </span>
                      )}
                      {(lead.country || lead.city) && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          <MapPin size={13} color="#64748B" /> {[lead.city, lead.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {lead.industry && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                          <Briefcase size={13} color="#64748B" /> {lead.industry}
                        </span>
                      )}
                      {lead.quantity && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', padding: '3px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }} title="Quantity requested">
                          <Hash size={13} color="#64748B" /> {lead.quantity}
                        </span>
                      )}
                    </div>

                    {/* Customer Message */}
                    {parsed.messageText && (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        background: '#FAFBF9',
                        borderRadius: '8px',
                        border: '1px solid #F0F2EB',
                        fontSize: '0.85rem',
                        color: '#334155',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                      }}>
                        &ldquo;{parsed.messageText}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Actions - Status + Date + Delete */}
                  <div className="lead-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginTop: '2px' }}>
                    {/* Status Dropdown */}
                    <div style={{ position: 'relative' }}>
                      <select
                        aria-label="Update lead status"
                        value={lead.status || 'new'}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        style={{
                          appearance: 'none',
                          padding: '8px 32px 8px 14px',
                          borderRadius: '10px',
                          border: `1px solid ${sc.text}30`,
                          background: sc.bg,
                          color: sc.text,
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronDown size={12} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: sc.text, pointerEvents: 'none' }} />
                    </div>

                    {/* Date */}
                    <div style={{ textAlign: 'right', minWidth: '85px' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#475569', lineHeight: 1.2 }}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.2 }}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteLead(lead.id)}
                      aria-label="Delete lead"
                      style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'color var(--admin-duration-fast)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#CBD5E1')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
