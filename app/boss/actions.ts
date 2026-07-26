'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql, slugify } from '@/lib/db';
import { isBoss, signIn, signOut } from '@/lib/auth';
import { setSetting } from '@/lib/settings';

async function guard() {
  if (!(await isBoss())) throw new Error('Not signed in.');
}

export async function doSignIn(_: any, form: FormData) {
  const ok = await signIn(String(form.get('password') || ''));
  if (!ok) return { error: "That's not it. Try again." };
  redirect('/boss');
}

export async function doSignOut() {
  await signOut();
  redirect('/boss');
}

const list = (v: FormDataEntryValue | null) =>
  String(v || '').split(',').map((s) => s.trim()).filter(Boolean);

export async function saveProduct(form: FormData) {
  await guard();
  const id = Number(form.get('id')) || null;
  const name = String(form.get('name') || '').trim();
  const price = Math.round(parseFloat(String(form.get('price') || '0')) * 100);
  const images = list(form.get('images'));
  const stockRaw = String(form.get('stock') || '').trim();
  const data = {
    name,
    blurb: String(form.get('blurb') || '').trim() || null,
    kind: String(form.get('kind') || 'sticker'),
    audience: String(form.get('audience') || 'everyone'),
    price_cents: price,
    images,
    colors: list(form.get('colors')),
    sizes: list(form.get('sizes')),
    stock: stockRaw === '' ? null : Number(stockRaw),
    active: form.get('active') === 'on',
  };

  if (id) {
    await sql`
      update products set name = ${data.name}, blurb = ${data.blurb}, kind = ${data.kind},
        audience = ${data.audience},
        price_cents = ${data.price_cents}, images = ${data.images}, colors = ${data.colors},
        sizes = ${data.sizes}, stock = ${data.stock}, active = ${data.active}
      where id = ${id}
    `;
  } else {
    await sql`
      insert into products (slug, name, blurb, kind, audience, price_cents, images, colors, sizes, stock, active)
      values (${slugify(name)}, ${data.name}, ${data.blurb}, ${data.kind}, ${data.audience}, ${data.price_cents},
              ${data.images}, ${data.colors}, ${data.sizes}, ${data.stock}, ${data.active})
    `;
  }
  revalidatePath('/');
  redirect('/boss/products');
}

export async function deleteProduct(form: FormData) {
  await guard();
  await sql`delete from products where id = ${Number(form.get('id'))}`;
  revalidatePath('/');
  redirect('/boss/products');
}

export async function advanceOrder(form: FormData) {
  await guard();
  const id = Number(form.get('id'));
  const next = String(form.get('next'));
  await sql`update orders set status = ${next}, updated_at = now() where id = ${id}`;
  revalidatePath('/boss/orders');
  revalidatePath('/boss');
}

export async function saveTheme(form: FormData) {
  await guard();
  await sql`
    update theme set
      store_name = ${String(form.get('store_name'))},
      tagline    = ${String(form.get('tagline'))},
      logo_url   = ${String(form.get('logo_url') || '') || null},
      c_paper    = ${String(form.get('c_paper'))},
      c_ink      = ${String(form.get('c_ink'))},
      c_primary  = ${String(form.get('c_primary'))},
      c_accent   = ${String(form.get('c_accent'))},
      c_highlight= ${String(form.get('c_highlight'))},
      f_display  = ${String(form.get('f_display'))},
      f_body     = ${String(form.get('f_body'))},
      radius_px  = ${Number(form.get('radius_px'))},
      tilt_on    = ${form.get('tilt_on') === 'on'}
    where id = 1
  `;
  revalidatePath('/', 'layout');
  redirect('/boss/look?saved=1');
}

export async function saveAiSettings(form: FormData) {
  await guard();
  const key = String(form.get('openai_api_key') || '').trim();
  if (key) await setSetting('openai_api_key', key);   // blank means "keep what's there"
  await setSetting('cost_per_image_cents', String(Number(form.get('cost_per_image_cents')) || 4));
  await setSetting('ai_quality', String(form.get('ai_quality') || 'medium'));
  revalidatePath('/boss/setup');
  redirect('/boss/setup?saved=1');
}

export async function keepSticker(form: FormData) {
  await guard();
  const name = String(form.get('name') || '').trim().slice(0, 60);
  const price = Math.round(parseFloat(String(form.get('price') || '3')) * 100);
  const image = String(form.get('image_url'));
  const cut = String(form.get('cut_svg_url') || '') || null;
  const border = String(form.get('border_on')) === 'true';

  await sql`
    insert into products (slug, name, kind, audience, price_cents, images, cut_svg_url, border_on, active)
    values (${slugify(name)}, ${name}, 'sticker', ${String(form.get('audience') || 'everyone')},
            ${price}, ${[image]}, ${cut}, ${border}, true)
  `;
  await sql`update ai_generations set kept = true where id = ${Number(form.get('gen_id'))}`;
  revalidatePath('/');
  redirect('/boss/products');
}
