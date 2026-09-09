'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Printer,
  Settings,
  LogOut,
  ChevronRight,
  Package,
  Eye,
  MessageCircle,
  Monitor,
  Globe2,
  Menu,
  X,
  Layers,
} from 'lucide-react';
import { ToastProvider } from '@/components/admin/Toast';
import { confirmDiscardIfDirty } from '@/lib/adminDirty';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close the mobile menu when navigating. Comparing against the previous
  // pathname during render (React's documented pattern for "adjust state
  // when a prop changes") instead of an effect avoids an extra render pass.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Leads', icon: <MessageCircle size={20} />, path: '/admin/leads' },
    { name: 'Fleet Content', icon: <FileText size={20} />, path: '/admin/content' },
    { name: 'Sourcing Content', icon: <Layers size={20} />, path: '/admin/content?page=sourcing' },
    { name: 'Printers', icon: <Printer size={20} />, path: '/admin/printers' },
    { name: 'Printer Parts', icon: <Package size={20} />, path: '/admin/parts' },
    { name: 'Office Equipment', icon: <Monitor size={20} />, path: '/admin/equipment' },
    { name: 'Regions', icon: <Globe2 size={20} />, path: '/admin/regions' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <>
      {pathname === '/admin/login' ? (
        children
      ) : (
        <div className="admin-wrapper">
          {/* Mobile Top Bar */}
          <div className="mobile-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--admin-accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Printer size={18} color="#0F172A" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>FNG <span style={{ color: 'var(--admin-accent)' }}>Admin</span></span>
            </div>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}>
              {isMobileMenuOpen ? <X size={24} color="#0F172A" /> : <Menu size={24} color="#0F172A" />}
            </button>
          </div>

          {/* Overlay for mobile */}
          {isMobileMenuOpen && (
            <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          )}

          {/* Sidebar */}
          <aside className={`admin-sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Logo Area */}
            <div className="sidebar-logo">
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--admin-accent)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Printer size={24} color="#0F172A" />
              </div>
              {(isSidebarOpen || isMobileMenuOpen) && (
                <span className="logo-text">
                  FNG <span style={{ color: 'var(--admin-accent)' }}>Admin</span>
                </span>
              )}
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
              {menuItems.map((item) => {
                const isSourcingLink = item.path.includes('page=sourcing');
                const isSiteContentLink = item.path === '/admin/content';
                const isActive = isSourcingLink
                  ? pathname === '/admin/content' && pageParam === 'sourcing'
                  : isSiteContentLink
                  ? pathname === '/admin/content' && pageParam !== 'sourcing'
                  : pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => { if (!confirmDiscardIfDirty()) e.preventDefault(); }}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {(isSidebarOpen || isMobileMenuOpen) && <span className="nav-text">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Link href="/" target="_blank" className="nav-item">
                <Eye size={20} className="nav-icon" />
                {(isSidebarOpen || isMobileMenuOpen) && <span className="nav-text">View Website</span>}
              </Link>
              <button
                onClick={async () => {
                  if (!confirmDiscardIfDirty()) return;
                  try {
                    await fetch('/api/admin/auth/logout', { method: 'POST' });
                    window.location.href = '/admin/login';
                  } catch {
                    console.error('Logout failed');
                  }
                }}
                className="nav-item logout-btn"
                aria-label="Logout"
              >
                <LogOut size={20} className="nav-icon" />
                {(isSidebarOpen || isMobileMenuOpen) && <span className="nav-text">Logout</span>}
              </button>
            </div>

            {/* Desktop Toggle Button */}
            <button
              className="sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronRight size={14} color="#0F172A" />
            </button>
          </aside>

          {/* Main Content */}
          <main className="admin-main">
            <ToastProvider>
              {children}
            </ToastProvider>
          </main>
        </div>
      )}
    </>
  );
}
