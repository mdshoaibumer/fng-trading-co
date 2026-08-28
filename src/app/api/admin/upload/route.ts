import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB — comfortably above real product photos

// The browser-reported Content-Type is just a claim from the client — this
// checks the actual file bytes against each format's magic number so a
// mislabeled/spoofed upload (e.g. an HTML file sent as "image/png") gets
// rejected instead of stored and served back with a browser-trusted type.
function matchesFileSignature(mimeType: string, bytes: Uint8Array): boolean {
  switch (mimeType) {
    case 'image/png':
      return bytes.length >= 8 &&
        bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
        bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
    case 'image/jpeg':
      return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case 'image/gif':
      return bytes.length >= 6 &&
        bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38 &&
        (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61;
    case 'image/webp':
      return bytes.length >= 12 &&
        bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
    default:
      return false;
  }
}

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

    if (!matchesFileSignature(file.type, new Uint8Array(bytes))) {
      return NextResponse.json(
        { error: 'File content does not match its declared type.' },
        { status: 400 }
      );
    }

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
