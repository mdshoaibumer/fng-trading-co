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
  Hash
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed'] as const;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  contacted: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
  qualified: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
  closed: { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748B' },
};

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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch {
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
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
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
            style={{ paddingLeft: '48px', width: '100%' }}
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
            style={{ paddingLeft: '40px', paddingRight: '40px', minWidth: '160px', cursor: 'pointer', appearance: 'none' }}
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
        {loading ? 'Loading...' : `${leads.length} lead${leads.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Leads Table */}
      {loading ? (
        <div style={{ display: 'flex', height: '30vh', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
            const typeLabel = lead.type === 'printer_request' ? 'Printer Request' : 'Contact Form';
            const sc = STATUS_COLORS[lead.status || 'new'] || STATUS_COLORS.new;

            return (
              <div key={lead.id} className="admin-card" style={{ padding: '16px 20px' }}>
                <div className="lead-card-inner" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#475569', fontSize: '0.9rem', flexShrink: 0
                  }}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>{lead.name}</span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '99px',
                        background: lead.type === 'printer_request' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(141, 184, 51, 0.1)',
                        color: lead.type === 'printer_request' ? '#6366F1' : 'var(--admin-accent)'
                      }}>
                        {typeLabel}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: '#64748B' }}>
                      {lead.email && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={13} /> {lead.email}
                        </span>
                      )}
                      {lead.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <PhoneIcon size={13} /> {lead.phone}
                        </span>
                      )}
                      {lead.company && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={13} /> {lead.company}
                        </span>
                      )}
                      {(lead.country || lead.city) && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={13} /> {[lead.city, lead.country].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {lead.industry && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Briefcase size={13} /> {lead.industry}
                        </span>
                      )}
                      {lead.quantity && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Printers requested">
                          <Hash size={13} /> {lead.quantity}
                        </span>
                      )}
                    </div>
                    {lead.message && (
                      <p style={{
                        margin: '8px 0 0', fontSize: '0.85rem', color: '#94A3B8',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        &quot;{lead.message}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions - Status + Date + Delete */}
                  <div className="lead-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
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
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteLead(lead.id)}
                      aria-label="Delete lead"
                      style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'color 0.2s' }}
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

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
