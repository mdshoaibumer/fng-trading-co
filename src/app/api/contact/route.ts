import { NextResponse } from 'next/server';
import { insertInquiry } from '@/lib/inquiries';
import { z } from 'zod';
import { rateLimit, globalRateLimit, getClientIp, tooManyRequests } from '@/lib/rateLimit';

// Every field is length-capped: these land in the database and in a
// notification email, so an unbounded body is a storage/spam problem.
const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  company: z.string().trim().min(2, 'Company must be at least 2 characters').max(160),
  phone: z.string().trim()
    .min(7, 'Phone number must be at least 7 digits')
    .max(40, 'Phone number is too long')
    .refine((val) => /^\+?[\d\s\-()]{7,30}$/.test(val), 'Invalid phone number format'),
  country: z.string().trim().max(80).optional(),
  city: z.string().trim().max(120).optional(),
  quantity: z.string().trim().max(20).optional(),
  email: z.union([z.string().trim().email('Invalid email address').max(254), z.literal('')]).optional(),
  industry: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
  website: z.string().max(500).optional(),
  _hp_company_fax: z.string().max(500).optional(),
  category: z.string().trim().max(60).optional(),
  queryItem: z.string().trim().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const { allowed, retryAfterSeconds } = rateLimit(`contact:${getClientIp(request)}`, 30, 10 * 60 * 1000);
    if (!allowed) return tooManyRequests(retryAfterSeconds);

    const global = globalRateLimit('contact', 100, 10 * 60 * 1000);
    if (!global.allowed) return tooManyRequests(global.retryAfterSeconds);

    const body = await request.json();

    // Validate request body
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const issueMsg = result.error.issues.map(i => i.message).join('. ');
      return NextResponse.json({ error: issueMsg || 'Invalid or missing required fields' }, { status: 400 });
    }

    // Only trip honeypot if dedicated hidden bot field is filled
    if (result.data._hp_company_fax) {
      return NextResponse.json({ success: true, message: 'Form submitted successfully' });
    }

    const { name, company, phone, country, city, quantity, email, industry, message, category, queryItem } = result.data;
    const leadType = (category || 'contact') as import('@/lib/inquiries').InquiryRow['type'];

    let finalMessage = message || '';
    if (queryItem && !finalMessage.includes(queryItem)) {
      finalMessage = `[Query: ${queryItem}]\n${finalMessage}`.trim();
    }

    // Save to Supabase inquiries table
    const { error: dbError } = await insertInquiry({
      type: leadType,
      name,
      company,
      phone,
      email: email || null,
      industry: industry || null,
      message: finalMessage || null,
      country: country || null,
      city: city || null,
      quantity: quantity || null,
      status: 'new',
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }

    // Forward to Web3Forms for email notification (server-side, matching
    // /api/printer-request — the access key never reaches the browser).
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
            subject: `New Lead [${leadType.toUpperCase()}] - ${name} (${company})`,
            from_name: 'FNG Website',
            category: leadType,
            query_item: queryItem || 'N/A',
            name,
            company,
            phone,
            email: email || 'N/A',
            industry: industry || 'N/A',
            message: finalMessage || 'N/A',
            country: country || 'N/A',
            city: city || 'N/A',
            quantity: quantity || '1'
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

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
