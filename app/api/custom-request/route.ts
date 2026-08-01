import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { sql } from '@/lib/db';
import { SHIRT_COLORS, SHIRT_SIZES, FIT_TYPES, GARMENT_TYPES, PLACEMENTS } from '@/lib/constants';
import { logError } from '@/lib/errors';

const FIT_KEYS = FIT_TYPES.map((t) => t.key);
const GARMENT_KEYS = GARMENT_TYPES.map((t) => t.key);
const PLACEMENT_KEYS = PLACEMENTS.map((t) => t.key);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get('name') || '').trim().slice(0, 80);
    const email = String(form.get('email') || '').trim().slice(0, 120) || null;
    const phone = String(form.get('phone') || '').trim().slice(0, 40) || null;
    const note = String(form.get('note') || '').trim().slice(0, 500) || null;
    const color = String(form.get('shirt_color') || '');
    const size = String(form.get('size') || '');
    const fit = String(form.get('fit_type') || '');
    const garment = String(form.get('shirt_type') || '');
    const placement = String(form.get('placement') || '');
    const file = form.get('image') as File | null;

    if (name.length < 2)
      return NextResponse.json({ error: 'Your name is required.' }, { status: 400 });
    if (!(SHIRT_COLORS as readonly string[]).includes(color))
      return NextResponse.json({ error: 'Pick a shirt color.' }, { status: 400 });
    if (!(SHIRT_SIZES as readonly string[]).includes(size))
      return NextResponse.json({ error: 'Pick a size.' }, { status: 400 });
    if (!FIT_KEYS.includes(fit as any))
      return NextResponse.json({ error: 'Pick a fit.' }, { status: 400 });
    if (!GARMENT_KEYS.includes(garment as any))
      return NextResponse.json({ error: 'Pick a shirt type.' }, { status: 400 });
    if (!PLACEMENT_KEYS.includes(placement as any))
      return NextResponse.json({ error: 'Pick where the design goes.' }, { status: 400 });
    if (!file) return NextResponse.json({ error: 'Add a picture of your design.' }, { status: 400 });
    if (!file.type.startsWith('image/'))
      return NextResponse.json({ error: 'Pictures only.' }, { status: 400 });
    if (file.size > 8 * 1024 * 1024)
      return NextResponse.json({ error: 'That photo is too big — try under 8MB.' }, { status: 400 });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      await logError('custom-request', 'BLOB_READ_WRITE_TOKEN is not set — Blob storage was never provisioned');
      return NextResponse.json(
        { error: "Photo storage isn't set up yet. Ask a grown-up to add Blob storage." },
        { status: 500 }
      );
    }

    const blob = await put(`custom-requests/${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    await sql`
      insert into custom_requests
        (name, email, phone, note, image_url, shirt_color, size, fit_type, shirt_type, placement)
      values
        (${name}, ${email}, ${phone}, ${note}, ${blob.url}, ${color}, ${size}, ${fit}, ${garment}, ${placement})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    await logError('custom-request', err);
    return NextResponse.json(
      { error: "That didn't go through. Try again." },
      { status: 500 }
    );
  }
}
