import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import { trace } from 'potrace';
import { sql } from '@/lib/db';
import { isBoss } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { logError } from '@/lib/errors';

export const maxDuration = 60;

const STYLES: Record<string, string> = {
  kawaii: 'chunky kawaii cartoon sticker, thick clean outlines, soft pastel fills, simple shapes',
  retro: 'retro 70s sticker art, warm muted palette, bold rounded linework',
  sparkle: 'glossy sparkly sticker, glitter highlights, bright saturated colors, playful',
  bold: 'bold vinyl decal, high contrast, flat colors, very thick outline, minimal detail',
};

function svgFromAlpha(png: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    trace(png, { threshold: 128, turdSize: 40, optCurve: true, color: 'none', background: 'none' },
      (err, svg) => (err ? reject(err) : resolve(svg)));
  });
}

export async function POST(req: Request) {
  if (!(await isBoss())) return NextResponse.json({ error: 'Nope.' }, { status: 401 });
  try {

  const { prompt, style = 'kawaii', border = true } = await req.json();
  if (!prompt || String(prompt).trim().length < 3)
    return NextResponse.json({ error: 'Describe your sticker in a few more words.' }, { status: 400 });

  const s = await getSettings();
  if (!s.openai_api_key)
    return NextResponse.json(
      { error: 'No API key saved yet. Add one in Boss → Setup.' }, { status: 400 });

  const fullPrompt =
    `A single die-cut sticker design: ${prompt}. ` +
    `${STYLES[style] || STYLES.kawaii}. ` +
    `Centered, one subject, no background, no drop shadow, no text unless asked, ` +
    `plenty of empty margin around the edges.`;

  // 1. generate with a genuinely transparent background
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${s.openai_api_key}`,
    },
    body: JSON.stringify({
      model: s.ai_model,
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: s.ai_quality,
      background: 'transparent',
      output_format: 'png',
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json(
      { error: `Image service said no. ${detail.slice(0, 200)}` }, { status: 502 });
  }

  const data = await res.json();
  const raw = Buffer.from(data.data[0].b64_json, 'base64');

  // 2. build the white offset border by dilating the alpha channel
  let art = raw;
  let cutMask: Buffer;

  const alpha = await sharp(raw)
    .ensureAlpha()
    .extractChannel('alpha')
    .png()
    .toBuffer();
  const grown = await sharp(alpha)
    .blur(14)
    .linear(6, -300)          // harden the blurred edge back into a solid shape
    .toColourspace('b-w')
    .png()
    .toBuffer();

  cutMask = grown;

  if (border) {
    const white = await sharp({
      create: { width: 1024, height: 1024, channels: 4, background: '#ffffff' },
    })
      .png()
      .composite([{ input: grown, blend: 'dest-in' }])
      .toBuffer();

    art = await sharp(white)
      .composite([{ input: raw, blend: 'over' }])
      .png()
      .toBuffer();
  }

  // 3. trace the outline into an SVG path — this is the Cricut cut line
  let svg = '';
  try {
    svg = await svgFromAlpha(grown);
  } catch {
    svg = '';
  }

  const stamp = Date.now();
  const [imgBlob, svgBlob] = await Promise.all([
    put(`ai/${stamp}.png`, art, { access: 'public', addRandomSuffix: true, contentType: 'image/png' }),
    svg
      ? put(`ai/${stamp}-cut.svg`, svg, {
          access: 'public', addRandomSuffix: true, contentType: 'image/svg+xml',
        })
      : Promise.resolve(null as any),
  ]);

  const [row] = (await sql`
    insert into ai_generations (prompt, style, image_url, cut_svg_url, border_on, cost_cents)
    values (${String(prompt).slice(0, 400)}, ${style}, ${imgBlob.url},
            ${svgBlob?.url || null}, ${border}, ${s.cost_per_image_cents})
    returning id
  `) as { id: number }[];

  return NextResponse.json({
    id: row.id,
    image_url: imgBlob.url,
    cut_svg_url: svgBlob?.url || null,
    cost_cents: s.cost_per_image_cents,
  });
  } catch (err) {
    await logError('ai/generate', err);
    return NextResponse.json(
      { error: 'The sticker maker hit a snag. Try again in a moment.' },
      { status: 500 }
    );
  }
}
