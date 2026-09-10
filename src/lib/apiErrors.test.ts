import { describe, it, expect, vi } from 'vitest';
import * as inquiriesModule from './inquiries';
import { POST as contactPost } from '../app/api/contact/route';
import { POST as printerRequestPost } from '../app/api/printer-request/route';

describe('API error sanitization (SEC-01 verification)', () => {
  it('/api/contact never exposes raw database error messages or PostgREST schema details', async () => {
    vi.spyOn(inquiriesModule, 'insertInquiry').mockResolvedValue({
      error: { message: 'relation "inquiries" does not exist (SQLSTATE 42P01)' },
      degraded: false,
    });

    const request = new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        company: 'Acme Corp',
        phone: '+966512345678',
        email: 'jane@acme.com',
        message: 'Enterprise inquiry',
      }),
    });

    const response = await contactPost(request);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error).toBeDefined();
    // Must NOT contain raw DB details
    expect(body.error).not.toContain('SQLSTATE');
    expect(body.error).not.toContain('inquiries');
    expect(body.error).not.toContain('relation');
    expect(body.error).not.toContain('Database error:');
    // Must be safe generic response
    expect(body.error).toContain('Unable to process your inquiry');
  });

  it('/api/printer-request never exposes raw database error messages or PostgREST schema details', async () => {
    vi.spyOn(inquiriesModule, 'insertInquiry').mockResolvedValue({
      error: { message: 'column "country" of relation "inquiries" does not exist' },
      degraded: false,
    });

    const request = new Request('http://localhost:3000/api/printer-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Smith',
        company: 'Global Logistics',
        phone: '+966598765432',
        email: 'john@global.com',
        message: 'Printer fleet request',
      }),
    });

    const response = await printerRequestPost(request);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body.error).toBeDefined();
    expect(body.error).not.toContain('relation');
    expect(body.error).not.toContain('column');
    expect(body.error).not.toContain('inquiries');
    expect(body.error).not.toContain('Database error:');
    expect(body.error).toContain('Unable to process your request');
  });
});
