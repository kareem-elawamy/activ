import { NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';

// Determine writable upload directory
async function getUploadDir() {
  const publicUploads = path.join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(publicUploads, { recursive: true });
    await access(publicUploads, 2); // Check write permission (W_OK = 2)
    return { dir: publicUploads, urlBase: '/uploads' };
  } catch {
    // Fallback: use /tmp (files won't be served as static, but upload will succeed)
    const tmpUploads = '/tmp/activ-uploads';
    await mkdir(tmpUploads, { recursive: true });
    console.warn('[upload] Using /tmp/activ-uploads (public/uploads not writable)');
    return { dir: tmpUploads, urlBase: '/api/uploads' };
  }
}

// POST /api/upload
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate MIME type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم. المقبول: JPG, PNG, PDF' },
        { status: 400 }
      );
    }

    // Validate size (5 MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم الملف كبير جداً. الحد الأقصى 5 ميجا.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Safe filename: strip special chars, add timestamp
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(originalName) || '.jpg';
    const safeName = `proof_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;

    const { dir, urlBase } = await getUploadDir();
    const filePath = path.join(dir, safeName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `${urlBase}/${safeName}`,
      fileName: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error('[Upload error]', err);
    return NextResponse.json({ error: `Upload failed: ${err.message}` }, { status: 500 });
  }
}
