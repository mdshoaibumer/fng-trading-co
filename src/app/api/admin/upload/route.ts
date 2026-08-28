import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB — comfortably above real product photos

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileExt = ALLOWED_TYPES[file.type];
    if (!fileExt) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: PNG, JPEG, WebP, GIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File is too large. Maximum size is 8MB.' }, { status: 400 });
    }

    // Generate a unique filename to prevent overwriting. The extension comes
    // from the validated MIME type above, not the client-supplied file name.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload to Supabase Storage Bucket 'printer-images'
    const { data, error } = await supabaseAdmin
      .storage
      .from('printer-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from('printer-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error during upload' }, { status: 500 });
  }
}
