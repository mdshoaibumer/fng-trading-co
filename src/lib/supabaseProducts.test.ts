import { describe, it, expect, vi, afterEach } from 'vitest';
import { supabaseAdmin } from './supabase';
import { getProducts, getProductById } from './supabase';

describe('supabase catalog data layer (ARCH-01 verification)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('in production, returns error: true and empty products on database query failure', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Connection timeout', code: 'PGRST000' } }),
      }),
    } as unknown as ReturnType<typeof supabaseAdmin.from>);

    const result = await getProducts('printer');
    expect(result.error).toBe(true);
    expect(result.products).toEqual([]);
  });

  it('in production, returns error: false and empty products for a legitimately empty catalog', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    } as unknown as ReturnType<typeof supabaseAdmin.from>);

    const result = await getProducts('printer');
    expect(result.error).toBe(false);
    expect(result.products).toEqual([]);
  });

  it('in production, returns error: false and mapped products on query success', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const mockRow = {
      id: 'hp-test-1',
      name: 'HP Test Printer',
      desc_en: 'Description EN',
      desc_ar: 'Description AR',
      images: ['/printers/test.png'],
      features_en: ['Feature 1'],
      features_ar: ['ميزة 1'],
      specs_en: { Speed: '40 ppm' },
      specs_ar: { السرعة: '40 صفحة' },
      available: true,
    };

    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [mockRow], error: null }),
      }),
    } as unknown as ReturnType<typeof supabaseAdmin.from>);

    const result = await getProducts('printer');
    expect(result.error).toBe(false);
    expect(result.products).toHaveLength(1);
    expect(result.products[0].id).toBe('hp-test-1');
    expect(result.products[0].name).toBe('HP Test Printer');
    expect(result.products[0].descEn).toBe('Description EN');
  });

  it('in production, getProductById returns null when query fails', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    vi.spyOn(supabaseAdmin, 'from').mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database failure', code: 'PGRST500' } }),
        }),
      }),
    } as unknown as ReturnType<typeof supabaseAdmin.from>);

    const result = await getProductById('hp-m428fdw');
    expect(result).toBeNull();
  });
});
