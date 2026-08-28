'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Menu,
  X
} from 'lucide-react';
import { ToastProvider } from '@/components/admin/Toast';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Leads', icon: <MessageCircle size={20} />, path: '/admin/leads' },
    { name: 'Site Content', icon: <FileText size={20} />, path: '/admin/content' },
    { name: 'Printers', icon: <Printer size={20} />, path: '/admin/printers' },
    { name: 'Printer Parts', icon: <Package size={20} />, path: '/admin/parts' },
    { name: 'Office Equipment', icon: <Monitor size={20} />, path: '/admin/equipment' },
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
              <div style={{ width: '32px', height: '32px', background: '#8DB833', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Printer size={18} color="#0F172A" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>FNG <span style={{ color: '#8DB833' }}>Admin</span></span>
            </div>
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
                background: '#8DB833',
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
                  FNG <span style={{ color: '#8DB833' }}>Admin</span>
                </span>
              )}
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
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
                  try {
                    await fetch('/api/admin/auth/logout', { method: 'POST' });
                    window.location.href = '/admin/login';
                  } catch (err) {
                    console.error('Logout failed');
                  }
                }}
                className="nav-item logout-btn"
              >
                <LogOut size={20} className="nav-icon" />
                {(isSidebarOpen || isMobileMenuOpen) && <span className="nav-text">Logout</span>}
              </button>
            </div>

            {/* Desktop Toggle Button */}
            <button
              className="sidebar-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: #F8FAFC;
        }

        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          color: #1E293B;
        }

        /* Mobile Top Bar */
        .mobile-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          padding: 16px 20px;
          border-bottom: 1px solid #E2E8F0;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 90;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .mobile-menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          z-index: 95;
          backdrop-filter: blur(4px);
        }

        /* Sidebar Layout */
        .admin-sidebar {
          background: #0F172A;
          color: #F8FAFC;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
          box-shadow: 4px 0 24px rgba(0,0,0,0.1);
        }

        .admin-sidebar.expanded { width: 280px; }
        .admin-sidebar.collapsed { width: 80px; }

        .sidebar-logo {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 20px;
        }

        .logo-text {
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: #94A3B8;
          margin-bottom: 4px;
          transition: all 0.2s ease;
          white-space: nowrap;
          overflow: hidden;
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #FFFFFF;
        }

        .nav-item.active {
          color: #FFFFFF;
          background: rgba(141, 184, 51, 0.2);
        }

        .nav-item.active .nav-icon { color: #8DB833; }
        .nav-text { font-weight: 600; font-size: 0.95rem; }

        .logout-btn { color: #EF4444; }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.1); color: #EF4444; }

        .sidebar-toggle {
          position: absolute;
          right: -12px;
          top: 32px;
          width: 24px;
          height: 24px;
          background: #8DB833;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .admin-sidebar.expanded .sidebar-toggle { transform: rotate(180deg); }

        /* Main Content */
        .admin-main {
          flex: 1;
          padding: 40px;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* Global Reusables */
        .admin-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }

        .btn-admin {
          padding: 10px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          white-space: nowrap;
        }

        .btn-admin-primary {
          background: #8DB833;
          color: #0F172A;
        }

        .btn-admin-primary:hover {
          background: #7DA62D;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(141, 184, 51, 0.3);
        }

        .admin-input {
          width: 100%;
          padding: 12px 16px;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #1E293B;
          outline: none;
          transition: border-color 0.2s;
        }

        .admin-input:focus {
          border-color: #8DB833;
          background: #FFFFFF;
        }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 768px) {
          .admin-wrapper {
            flex-direction: column;
            padding-top: 64px;
          }

          .mobile-topbar {
            display: flex;
          }

          .mobile-overlay {
            display: block;
          }

          .admin-sidebar {
            position: fixed;
            left: -300px;
            width: 280px !important;
            transition: left 0.3s ease;
          }

          .admin-sidebar.mobile-open {
            left: 0;
          }

          .sidebar-toggle {
            display: none;
          }

          .admin-main {
            padding: 20px 16px;
          }

          .admin-card {
            padding: 16px;
            border-radius: 16px;
          }

          /* Page headers stack vertically on mobile */
          .page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
          }

          .page-header-actions {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .page-header-actions .btn-admin {
            flex: 1;
            justify-content: center;
            min-width: 120px;
          }

          /* Dashboard grid stacks on mobile */
          .dash-grid-main {
            grid-template-columns: 1fr !important;
          }

          /* Filter bar stacks on mobile */
          .filter-bar {
            flex-direction: column !important;
            gap: 12px !important;
          }

          .filter-bar > * {
            width: 100% !important;
          }

          /* 2-column grids collapse to 1 column */
          .responsive-grid,
          .admin-grid-2 {
            grid-template-columns: 1fr !important;
          }

          .full-width {
            grid-column: 1 !important;
          }

          /* Leads cards reflow on mobile */
          .lead-card-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }

          .lead-card-actions {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          /* Printer card header reflows on mobile */
          .printer-card-header {
            flex-wrap: wrap !important;
            gap: 12px !important;
          }

          .printer-availability-badge {
            order: 3;
            width: 100%;
          }

          /* Stat cards 2-col grid on mobile */
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          /* Settings header stack */
          .settings-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }

        /* Extra small screens - single column stats */
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .admin-main {
            padding: 16px 12px;
          }
        }
      `}</style>
    </>
  );
}
