import Link from 'next/link';
import { sql, money } from '@/lib/db';
import { doSignOut } from './actions';
import { aiSpend } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const [totals] = (await sql`
    select
      coalesce(sum(total_cents) filter (where status <> 'new'), 0)::int as earned,
      coalesce(sum(total_cents) filter (where status = 'new'), 0)::int  as pending,
      count(*) filter (where status = 'new')::int                       as new_count,
      count(*) filter (where status in ('paid','ordered','ready'))::int as working
    from orders
  `) as any[];

  const [best] = (await sql`
    select oi.name_snap, sum(oi.qty)::int as sold
    from order_items oi join orders o on o.id = oi.order_id
    where o.status <> 'new'
    group by oi.name_snap order by sold desc limit 1
  `) as any[];

  const ai = await aiSpend();
  const level = Math.floor(totals.earned / 2500) + 1;
  const pct = ((totals.earned % 2500) / 2500) * 100;

  return (
    <main>
      <p className="muted" style={{ fontSize: '0.8rem', letterSpacing: '.14em', textTransform: 'uppercase', margin: 0 }}>
        You&apos;ve made
      </p>
      <p className="bignum display" style={{ color: 'var(--primary)' }}>{money(totals.earned)}</p>

      <div style={{ marginTop: 14 }}>
        <span className="badge">Level {level}</span>
        <div className="meter"><i style={{ width: `${pct}%` }} /></div>
        <div className="muted" style={{ fontSize: '0.82rem' }}>
          {money(2500 - (totals.earned % 2500))} to level {level + 1}
        </div>
      </div>

      {totals.pending > 0 && (
        <p className="muted" style={{ marginTop: 10 }}>
          {money(totals.pending)} more once you collect it
        </p>
      )}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginTop: 28 }}>
        <Link href="/boss/orders" className="card" style={{ textDecoration: 'none' }}>
          <div className="display" style={{ fontSize: '2.4rem' }}>{totals.new_count}</div>
          <div className="muted" style={{ fontSize: '0.9rem' }}>waiting on you</div>
        </Link>
        <div className="card">
          <div className="display" style={{ fontSize: '2.4rem' }}>{totals.working}</div>
          <div className="muted" style={{ fontSize: '0.9rem' }}>in progress</div>
        </div>
      </div>

      {best && (
        <div className="card">
          <div className="muted" style={{ fontSize: '0.8rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>
            Best seller
          </div>
          <strong style={{ fontSize: '1.15rem' }}>{best.name_snap}</strong>
          <div className="muted">{best.sold} sold</div>
        </div>
      )}

      {ai.images > 0 && (
        <Link href="/boss/setup" className="card" style={{ display: 'block', textDecoration: 'none' }}>
          <div className="muted" style={{ fontSize: '0.8rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>
            AI stickers this month
          </div>
          <strong style={{ fontSize: '1.15rem' }}>{money(ai.this_month)} spent</strong>
          <div className="muted">{ai.images} made &middot; {ai.kept} in the store</div>
        </Link>
      )}

      <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
        <Link href="/boss/make" className="btn">Make a sticker with AI</Link>
        <Link href="/boss/products/new" className="btn ghost">Add something by hand</Link>
        <Link href="/" className="btn ghost">See my store</Link>
        <Link href="/boss/setup" className="btn ghost small">Setup</Link>
        <form action={doSignOut}><button className="btn ghost small">Sign out</button></form>
      </div>
    </main>
  );
}
