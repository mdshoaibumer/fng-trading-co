import { describe, expect, it } from 'vitest';
import { ADMIN_HOME, safeAdminNext } from './safeAdminNext';

describe('safeAdminNext', () => {
  it('keeps same-site admin paths, including query and hash', () => {
    expect(safeAdminNext('/admin')).toBe('/admin');
    expect(safeAdminNext('/admin/leads')).toBe('/admin/leads');
    expect(safeAdminNext('/admin/leads?status=new&page=2')).toBe('/admin/leads?status=new&page=2');
    expect(safeAdminNext('/admin/printers#top')).toBe('/admin/printers#top');
    expect(safeAdminNext('/admin?tab=x')).toBe('/admin?tab=x');
  });

  it('falls back to the dashboard for missing or non-string input', () => {
    for (const v of [undefined, null, '', 42, {}, ['/admin/leads']]) {
      expect(safeAdminNext(v)).toBe(ADMIN_HOME);
    }
  });

  it('rejects off-site and protocol-relative destinations', () => {
    for (const v of [
      'https://evil.com',
      'https://evil.com/admin',
      'http:/evil.com',
      '//evil.com',
      '//evil.com/admin',
      '/\\evil.com',
      '/admin\\@evil.com',
      '\\\\evil.com',
      'javascript:alert(1)',
      ' /admin',
    ]) {
      expect(safeAdminNext(v)).toBe(ADMIN_HOME);
    }
  });

  it('rejects paths outside the admin area, including via normalization', () => {
    for (const v of [
      '/',
      '/en',
      '/administrator',
      '/admin.evil.com',
      '/admin/../en',
      '/admin/%2e%2e/en',
      '/admin/%2E%2E/%2E%2E/en',
      '/api/admin/leads',
    ]) {
      expect(safeAdminNext(v)).toBe(ADMIN_HOME);
    }
  });

  it('rejects control characters', () => {
    expect(safeAdminNext('/admin/leads\n//evil.com')).toBe(ADMIN_HOME);
    expect(safeAdminNext('/admin/\tleads')).toBe(ADMIN_HOME);
  });

  it('never sends a signed-in admin back to the login page', () => {
    expect(safeAdminNext('/admin/login')).toBe(ADMIN_HOME);
    expect(safeAdminNext('/admin/login?next=/admin/leads')).toBe(ADMIN_HOME);
    expect(safeAdminNext('/admin/login/')).toBe(ADMIN_HOME);
  });
});
