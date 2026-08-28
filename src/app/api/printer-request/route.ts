import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';
import { rateLimit, getClientIp, tooManyRequests } from '@/lib/rateLimit';

const printerRequestSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  phone: z.string().min(5),
  city: z.string().optional(),
  quantity: z.string().optional(),
  email: z.string().optional().or(z.string().length(0)),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const { allowed, retryAfterSeconds } = rateLimit(`printer-request:${getClientIp(request)}`, 5, 10 * 60 * 1000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);

    const body = await request.json();

    // Validate request body
    const result = printerRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid or missing required fields' }, { status: 400 });
    }

    const { name, company, phone, city, quantity, email, message } = result.data;

    // Save to Supabase inquiries table
    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        type: 'printer_request',
        name,
        company,
        phone,
        city,
        quantity,
        status: 'new'
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
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `New Printer Request Lead - ${name} (${company})`,
            from_name: 'FNG Website',
            name,
            company,
            phone,
            email: email || 'N/A',
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
