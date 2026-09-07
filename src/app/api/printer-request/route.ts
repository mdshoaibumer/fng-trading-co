import { NextResponse } from 'next/server';
import { insertInquiry } from '@/lib/inquiries';
import { z } from 'zod';
import { rateLimit, globalRateLimit, getClientIp, tooManyRequests } from '@/lib/rateLimit';

const printerRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(5).max(40),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(120).optional(),
  quantity: z.string().trim().max(20).optional(),
  email: z.union([z.string().trim().email().max(254), z.literal('')]).optional(),
  message: z.string().trim().max(4000).optional(),
  website: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  try {
    const { allowed, retryAfterSeconds } = rateLimit(`printer-request:${getClientIp(request)}`, 5, 10 * 60 * 1000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);

    // Backstop against X-Forwarded-For spoofing (a fresh header value on
    // every request resets the per-IP bucket above) — ignores the claimed
    // IP entirely and caps total submissions across everyone, same pattern
    // as the admin login route.
    const global = globalRateLimit('printer-request', 50, 10 * 60 * 1000);
    if (!global.allowed) return tooManyRequests(global.retryAfterSeconds);

    const body = await request.json();

    // Validate request body
    const result = printerRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid or missing required fields' }, { status: 400 });
    }

    // Honeypot (same as /api/contact): pretend success, store nothing.
    if (result.data.website) {
      return NextResponse.json({ success: true, message: 'Printer request submitted' });
    }

    const { name, company, phone, country, city, quantity, email, message } = result.data;

    // Save to Supabase inquiries table
    const { error } = await insertInquiry({
      type: 'printer_request',
      name,
      company,
      phone,
      email: email || null,
      message: message || null,
      country: country || null,
      city: city || null,
      quantity: quantity || null,
      status: 'new',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // Forward to Web3Forms for email notification
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
      try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // api.web3forms.com sits behind Cloudflare, which serves a 403
            // "Just a moment..." bot-challenge (HTML, not JSON) to server-side
            // requests that arrive without a browser-like User-Agent — Node's
            // default undici UA gets challenged, silently dropping every lead
            // notification email. A real UA string clears the challenge.
            'User-Agent': 'Mozilla/5.0 (compatible; FNG-Website/1.0; +https://www.fngtradingco.com)'
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `New Printer Request Lead - ${name} (${company})`,
            from_name: 'FNG Website',
            name,
            company,
            phone,
            email: email || 'N/A',
            country: country || 'N/A',
            city: city || 'N/A',
            quantity: quantity || 'N/A',
            message: message || 'N/A'
          })
        });
        if (!web3Response.ok) {
          const errData = await web3Response.json();
          console.error('Web3Forms failed:', errData);
        }
      } catch (web3Err) {
        console.error('Web3Forms notification failed:', web3Err);
      }
    }

    return NextResponse.json({ success: true, message: 'Printer request submitted' });
  } catch (error) {
    console.error('Printer request API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
