import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PostgREST's .or() filter syntax treats `,`, `.`, `:`, `(` and `)` as
// structural characters. Wrapping a value in double quotes tells it to
// treat the contents as a literal instead — but the quoting itself must
// escape any backslash/double-quote the value contains, or a crafted
// search string could break out and inject additional filter clauses.
function escapePostgrestLiteral(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').slice(0, 200);
    const status = searchParams.get('status') || '';

    let query = supabaseAdmin
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      const safeSearch = escapePostgrestLiteral(search);
      query = query.or(
        `name.ilike."%${safeSearch}%",email.ilike."%${safeSearch}%",company.ilike."%${safeSearch}%",phone.ilike."%${safeSearch}%"`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Leads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Leads DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
