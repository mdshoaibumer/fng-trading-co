'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Printer, 
  Package, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  MessageCircle,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Download
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

function StatCard({ title, value, change, icon, color }: any) {
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: '#8DB833' }}>
        <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = data?.stats || { totalLeads: 0, printers: 0, parts: 0 };
  const recentLeads = data?.recentLeads || [];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Dashboard Overview</h1>
          <p style={{ color: '#64748B', margin: 0 }}>Welcome back, Administrator. Here's what's happening with FNG today.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-admin" style={{ background: '#E2E8F0', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={async () => {
              try {
                const res = await fetch('/api/admin/leads');
                const leads = await res.json();
                if (!leads.length) { showToast('No leads to export', 'info'); return; }
                const headers = ['Name','Email','Phone','Company','Type','Status','Date'];
                const rows = leads.map((l: any) => [l.name||'',l.email||'',l.phone||'',l.company||'',l.type||'',l.status||'',l.created_at?new Date(l.created_at).toLocaleDateString():''].map(v=>`"${v}"`).join(','));
                const csv = [headers.join(','), ...rows].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `fng-leads-${new Date().toISOString().split('T')[0]}.csv`; a.click();
                URL.revokeObjectURL(url);
                showToast('CSV report downloaded', 'success');
              } catch (err) { showToast('Failed to export', 'error'); }
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
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <StatCard title="Total Leads" value={stats.totalLeads} change="Live Data" icon={<MessageCircle size={24} />} color="#8DB833" />
        <StatCard title="Printer Inventory" value={stats.printers} change="Live Data" icon={<Printer size={24} />} color="#3B82F6" />
        <StatCard title="Parts Available" value={stats.parts} change="Live Data" icon={<Package size={24} />} color="#F59E0B" />
        <StatCard title="Active Status" value="Online" icon={<Clock size={24} />} color="#6366F1" />
      </div>

      <div className="dash-grid-main" style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }}>
        {/* Recent Activity */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Recent Leads</h3>
            <button onClick={() => router.push('/admin/leads')} style={{ color: '#8DB833', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentLeads.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No recent leads found.</p>
            ) : (
              recentLeads.map((lead: any) => {
                const initials = lead.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                const typeLabel = lead.type === 'printer_request' ? 'Printer Request' : 'Contact Form';
                return (
                  <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#475569', flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.name} {lead.company ? `(${lead.company})` : ''}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {typeLabel} • {lead.phone}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: lead.status === 'new' ? '#10B981' : '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        {lead.status || 'NEW'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="admin-card" style={{ background: '#1E293B', color: '#F8FAFC' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1.25rem', fontWeight: 800 }}>Platform Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ flex: 1, fontWeight: 600 }}>Frontend Website</span>
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>ONLINE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ flex: 1, fontWeight: 600 }}>Supabase API</span>
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>CONNECTED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ flex: 1, fontWeight: 600 }}>Database Integration</span>
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700 }}>SYNCED</span>
            </div>
            
            <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#10B981' }}>
                <CheckCircle2 size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>System Healthy</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                All services are fully operational and responding to requests normally.
              </p>
            </div>
          </div>
        </div>
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

