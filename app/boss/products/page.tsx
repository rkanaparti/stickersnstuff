import Link from 'next/link';
import { sql, money, Product } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ProductList() {
  const items = (await sql`select * from products order by active desc, sort asc, id desc`) as Product[];

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem' }}>My stuff</h1>
        <Link href="/boss/products/new" className="btn small">+ New</Link>
      </div>

      {items.length === 0 && (
        <div className="empty"><p className="muted">Nothing yet. Add your first design.</p></div>
      )}

      {items.map((p) => (
        <Link key={p.id} href={`/boss/products/${p.id}`} className="card"
          style={{ display: 'flex', gap: 14, alignItems: 'center', textDecoration: 'none' }}>
          <img src={p.images[0] || ''} alt=""
            style={{ width: 58, height: 58, objectFit: 'cover', borderRadius: 12, background: 'var(--highlight)' }} />
          <div style={{ flex: 1 }}>
            <strong>{p.name}</strong>
            <div className="muted" style={{ fontSize: '0.88rem' }}>
              {money(p.price_cents)}{p.stock !== null && ` · ${p.stock} left`}{!p.active && ' · hidden'}
            </div>
          </div>
          <span className="muted">›</span>
        </Link>
      ))}
    </main>
  );
}
