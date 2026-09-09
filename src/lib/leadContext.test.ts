import { describe, it, expect } from 'vitest';
import { parseLeadContext } from './leadContext';

describe('parseLeadContext', () => {
  it('returns null when query string is empty', () => {
    expect(parseLeadContext('')).toBeNull();
    expect(parseLeadContext('?')).toBeNull();
  });

  it('detects product inquiries and produces bilingual context', () => {
    const ctx = parseLeadContext('?product=HP%20LaserJet%20Pro%20M404dn');
    expect(ctx).not.toBeNull();
    expect(ctx?.sourceType).toBe('product');
    expect(ctx?.badgeEn).toContain('HP LaserJet Pro M404dn');
    expect(ctx?.badgeAr).toContain('HP LaserJet Pro M404dn');
    expect(ctx?.messageEn).toContain('HP LaserJet Pro M404dn');
    expect(ctx?.messageAr).toContain('HP LaserJet Pro M404dn');
  });

  it('detects spare parts inquiries from 3D exploded view', () => {
    const ctx = parseLeadContext('?inquiry=part&part=Fuser%20Assembly%20RM2-5679');
    expect(ctx).not.toBeNull();
    expect(ctx?.sourceType).toBe('part');
    expect(ctx?.badgeEn).toContain('Fuser Assembly RM2-5679');
    expect(ctx?.badgeAr).toContain('Fuser Assembly RM2-5679');
  });

  it('detects BOQ configurator fleet calculations and sets sensible quantity', () => {
    const ctx = parseLeadContext('?service=printers&workstations=25&volume=15000');
    expect(ctx).not.toBeNull();
    expect(ctx?.sourceType).toBe('boq');
    expect(ctx?.badgeEn).toContain('25 Workstations');
    expect(ctx?.badgeAr).toContain('25 محطة عمل');
    expect(ctx?.quantity).toBe('20');
  });

  it('detects sourcing radar cross-border procurement intent', () => {
    const ctx = parseLeadContext('?service=sourcing&stage=inspection');
    expect(ctx).not.toBeNull();
    expect(ctx?.sourceType).toBe('sourcing');
    expect(ctx?.badgeEn).toContain('Inspection');
    expect(ctx?.badgeAr).toContain('كوانزو');
  });
});
