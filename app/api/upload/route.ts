import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isBoss } from '@/lib/auth';
import { logError } from '@/lib/errors';

export async function POST(req: Request) {
  if (!(await isBoss())) return NextResponse.json({ error: 'Nope.' }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file.' }, { status: 400 });
    if (!file.type.startsWith('image/'))
      return NextResponse.json({ error: 'Pictures only.' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024)
      return NextResponse.json({ error: 'That photo is too big — try under 8MB.' }, { status: 400 });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      await logError('upload', 'BLOB_READ_WRITE_TOKEN is not set — Blob storage was never provisioned');
      return NextResponse.json(
        { error: 'Photo storage isn\'t set up yet. Ask a grown-up to add Blob storage.' },
        { status: 500 }
      );
    }

    const blob = await put(`designs/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    await logError('upload', err);
    return NextResponse.json(
      { error: 'That photo didn\'t upload. Try a different one.' },
      { status: 500 }
    );
  }
}
