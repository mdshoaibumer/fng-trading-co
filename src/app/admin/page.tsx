'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Printer,
  Package,
  TrendingUp,
  Clock,
  MessageCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Download,
  Monitor,
  Tag,
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';
import { LEAD_CATEGORY_MAP, parseLeadMessage } from './leads/page';

interface RecentLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  type?: string;
  status?: string;
  message?: string;
  created_at?: string;
}

interface DashboardData {
  stats: { totalLeads: number; printers: number; equipment?: number; parts: number };
  recentLeads: RecentLead[];
}

function StatCard({ title, value, change, icon, color }: {
  title: string; value: number | string; change?: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>{title}</p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{value}</h2>
        {change && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: change.startsWith('+') ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 700 }}>
            <TrendingUp size={14} />
            <span>{change}</span>
          </div>
        )}
      </div>
      <div style={{
        width: '48px',
        height: '48px',
        background: color + '15',
        color: color,
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setDbConnected(json.dbConnected !== false);
      } else {
        setDbConnected(false);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setDbConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchDashboardData is intentionally shared with the manual refresh
    // button below and already has full try/catch/finally handling —
    // duplicating the fetch logic just to satisfy this lint rule would be
    // worse, not better.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const stats = data?.stats || { totalLeads: 0, printers: 0, parts: 0 };
  const recentLeads = data?.recentLeads || [];

  return (
    <div style={{ animation: 'fadeIn var(--admin-duration-page) var(--admin-ease-out)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Dashboard Overview</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Welcome back, Administrator. Here&apos;s what&apos;s happening with FNG today.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-admin" style={{ background: '#E2E8F0', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={async () => {
              try {
                const res = await fetch('/api/admin/leads');
                const leads = await res.json();
                if (!leads.length) { showToast('No leads to export', 'info'); return; }
                const headers = ['Name','Email','Phone','Company','Type','Status','Date'];
                const rows = (leads as RecentLead[]).map((l) => [l.name||'',l.email||'',l.phone||'',l.company||'',l.type||'',l.status||'',l.created_at?new Date(l.created_at).toLocaleDateString():''].map(v=>`"${v}"`).join(','));
                const csv = [headers.join(','), ...rows].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `fng-leads-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                showToast('CSV report downloaded', 'success');
              } catch { showToast('Failed to export', 'error'); }
            }}
          >
            <Download size={18} />
            Download Reports
          </button>
          <button className="btn-admin btn-admin-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={fetchDashboardData}>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard title="Total Leads" value={stats.totalLeads} change="Live Data" icon={<MessageCircle size={24} />} color="var(--admin-accent)" />
        <StatCard title="Printer Inventory" value={stats.printers} change="Live Data" icon={<Printer size={24} />} color="#3B82F6" />
        <StatCard title="Office Equipment" value={stats.equipment ?? 0} change="Live Data" icon={<Monitor size={24} />} color="#8B5CF6" />
        <StatCard title="Parts Available" value={stats.parts} change="Live Data" icon={<Package size={24} />} color="#F59E0B" />
        <StatCard title="System Status" value="Online" icon={<Clock size={24} />} color="#10B981" />
      </div>

      <div className="dash-grid-main" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
        {/* Recent Activity */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Recent Leads</h3>
            <button onClick={() => router.push('/admin/leads')} style={{ color: 'var(--admin-accent)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentLeads.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No recent leads found.</p>
            ) : (
              recentLeads.map((lead: RecentLead) => {
                const initials = lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                const categoryConfig = LEAD_CATEGORY_MAP[lead.type || ''] || LEAD_CATEGORY_MAP.contact;
                const parsed = parseLeadMessage(lead.message);

                return (
                  <div key={lead.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 16px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #F1F5F9' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#475569', fontSize: '0.85rem', flexShrink: 0, marginTop: '2px' }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                          {lead.name}
                        </span>
                        {lead.company && (
                          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>
                            ({lead.company})
                          </span>
                        )}
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px',
                          background: categoryConfig.bg,
                          color: categoryConfig.color,
                          border: `1px solid ${categoryConfig.color}25`
                        }}>
                          {categoryConfig.label}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        {lead.phone && <span>{lead.phone}</span>}
                        {parsed.queryItem && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#1D4ED8', background: '#EFF6FF', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                            <Tag size={10} /> {parsed.queryItem}
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px', marginTop: '2px' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem', color: '#475569', lineHeight: 1.2 }}>
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'}
                      </p>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '4px',
                        fontSize: '0.7rem',
                        color: lead.status === 'new' ? '#10B981' : '#64748B',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {lead.status || 'NEW'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* System Status — reflects whether /api/admin/dashboard actually
            succeeded on the last fetch, not a hardcoded "all green" state */}
        <div className="admin-card" style={{ background: '#1E293B', color: '#F8FAFC' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800 }}>Platform Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ flex: 1, fontWeight: 600 }}>Frontend Website</span>
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>ONLINE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dbConnected ? '#10B981' : '#EF4444', boxShadow: dbConnected ? '0 0 10px #10B981' : '0 0 10px #EF4444' }} />
              <span style={{ flex: 1, fontWeight: 600 }}>Supabase API</span>
              <span style={{ color: dbConnected ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 700 }}>{dbConnected ? 'CONNECTED' : 'UNREACHABLE'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dbConnected ? '#10B981' : '#EF4444', boxShadow: dbConnected ? '0 0 10px #10B981' : '0 0 10px #EF4444' }} />
              <span style={{ flex: 1, fontWeight: 600 }}>Database Integration</span>
              <span style={{ color: dbConnected ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 700 }}>{dbConnected ? 'SYNCED' : 'ERROR'}</span>
            </div>

            <div style={{ marginTop: '20px', padding: '20px', background: dbConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: `1px solid ${dbConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: dbConnected ? '#10B981' : '#EF4444' }}>
                {dbConnected ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{dbConnected ? 'System Healthy' : 'Connection Problem'}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                {dbConnected
                  ? 'The dashboard successfully loaded live data from Supabase on the last refresh.'
                  : 'The last refresh could not load data from Supabase. Check your connection or Supabase project status, then hit Refresh.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

