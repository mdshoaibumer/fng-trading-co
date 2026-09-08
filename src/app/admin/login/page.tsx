'use client';

import React from 'react';
import { Printer, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loggingIn, setLoggingIn] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        setError('Invalid administrative credentials');
        setLoggingIn(false);
      }
    } catch {
      setError('An error occurred during authentication');
      setLoggingIn(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0F172A',
      fontFamily: 'var(--font-inter), sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        background: '#1E293B',
        borderRadius: '32px',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        {/* Brand */}
        <div style={{
          width: '64px',
          height: '64px',
          background: 'var(--admin-accent)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 30px rgba(141, 184, 51, 0.3)'
        }}>
          <Printer size={32} color="#0F172A" />
        </div>

        <h1 style={{ color: '#F8FAFC', fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          FNG <span style={{ color: 'var(--admin-accent)' }}>Admin</span>
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '32px' }}>
          Secure access to platform controls
        </p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          {/* Single-password admin — no username field (there is one shared
              admin credential, so a disabled "admin" box only implied a
              multi-user system that does not exist). */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="admin-password" style={{ display: 'block', color: '#CBD5E1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', marginLeft: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                id="admin-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                autoComplete="current-password"
                aria-describedby={error ? 'admin-password-error' : undefined}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--admin-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  background: '#0F172A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  color: '#FFFFFF',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  transition: 'all var(--admin-duration-fast)'
                }}
              />
            </div>
            {error && <p id="admin-password-error" role="alert" style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '8px', marginLeft: '4px' }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--admin-accent)',
              color: '#0F172A',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: loggingIn ? 'not-allowed' : 'pointer',
              opacity: loggingIn ? 0.7 : 1,
              transition: 'all var(--admin-duration-fast)',
              boxShadow: '0 8px 24px rgba(141, 184, 51, 0.2)'
            }}
          >
            {loggingIn ? 'Signing in...' : 'Access Dashboard'}
          </button>
        </form>

        <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '32px' }}>
          &copy; 2026 Future Next Gen. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
