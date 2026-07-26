import { NextResponse } from 'next/server';
import { sql, orderCode, Product } from '@/lib/db';
import { STRIPE_SECRET_KEY } from '@/lib/config';
import { logError } from '@/lib/errors';

export async function POST(req: Request) {
  try {
  const body = await req.json();
  const items: any[] = Array.isArray(body.items) ? body.items : [];
  const channel = body.channel === 'online' ? 'online' : 'pickup';

  if (items.length === 0) return NextResponse.json({ error: 'Bag is empty.' }, { status: 400 });
  if (channel === 'pickup' && String(body.buyer_name || '').trim().length < 2)
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });

  // Never trust prices from the browser — re-read them from the database.
  const ids = [...new Set(items.map((i) => Number(i.product_id)).filter(Boolean))];
  const rows = (await sql`
    select * from products where id = any(${ids}) and active = true
  `) as Product[];
  const byId = new Map(rows.map((r) => [r.id, r]));

  const clean = items
    .map((i) => {
      const p = byId.get(Number(i.product_id));
      if (!p) return null;
      const qty = Math.min(Math.max(parseInt(i.qty, 10) || 1, 1), 20);
      return {
        product_id: p.id,
        name_snap: p.name,
        size: p.sizes.includes(i.size) ? i.size : null,
        color: p.colors.includes(i.color) ? i.color : null,
        qty,
        price_cents: p.price_cents,
      };
    })
    .filter(Boolean) as any[];

  if (clean.length === 0)
    return NextResponse.json({ error: 'Those items are no longer available.' }, { status: 400 });

  const total = clean.reduce((n, i) => n + i.price_cents * i.qty, 0);
  const code = orderCode();

  const [order] = (await sql`
    insert into orders (code, buyer_name, buyer_note, channel, total_cents)
    values (${code}, ${String(body.buyer_name || 'Online order').slice(0, 60)},
            ${String(body.buyer_note || '').slice(0, 200)}, ${channel}, ${total})
    returning id, code
  `) as { id: number; code: string }[];

  for (const i of clean) {
    await sql`
      insert into order_items (order_id, product_id, name_snap, size, color, qty, price_cents)
      values (${order.id}, ${i.product_id}, ${i.name_snap}, ${i.size}, ${i.color}, ${i.qty}, ${i.price_cents})
    `;
  }

  if (channel === 'online' && STRIPE_SECRET_KEY) {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: clean.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency: 'usd',
          unit_amount: i.price_cents,
          product_data: {
            name: [i.name_snap, i.size, i.color].filter(Boolean).join(' · '),
          },
        },
      })),
      shipping_address_collection: { allowed_countries: ['US'] },
      success_url: `${site}/thanks/${order.code}`,
      cancel_url: `${site}/bag`,
      metadata: { order_code: order.code },
    });

    await sql`update orders set stripe_id = ${session.id} where id = ${order.id}`;
    return NextResponse.json({ code: order.code, checkout_url: session.url });
  }

  return NextResponse.json({ code: order.code });
  } catch (err) {
    await logError('order', err);
    return NextResponse.json(
      { error: "That order didn't go through. Try again." },
      { status: 500 }
    );
  }
}
