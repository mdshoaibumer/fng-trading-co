import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  phone: z.string().min(5),
  city: z.string().optional(),
  quantity: z.string().optional(),
  email: z.string().optional().or(z.string().length(0)),
  industry: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid or missing required fields' }, { status: 400 });
    }

    const { name, company, phone, city, quantity, email, industry, message } = result.data;

    // Save to Supabase inquiries table
    const { error } = await supabaseAdmin
      .from('inquiries')
      .insert({
        type: 'contact',
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

    const web3Key = process.env.WEB3FORMS_ACCESS_KEY || null;

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      web3Key 
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
