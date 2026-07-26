import { sql, money, STATUS_LABEL, NEXT_STATUS, NEXT_LABEL, Order } from '@/lib/db';
import { advanceOrder } from '../actions';

export const dynamic = 'force-dynamic';

export default async function Orders() {
  const orders = (await sql`
    select o.*, coalesce(json_agg(json_build_object(
      'name', i.name_snap, 'size', i.size, 'color', i.color, 'qty', i.qty
    )) filter (where i.id is not null), '[]') as items
    from orders o left join order_items i on i.order_id = o.id
    where o.status <> 'done'
    group by o.id
    order by o.created_at asc
  `) as (Order & { items: any[] })[];

  if (orders.length === 0)
    return (
      <div className="empty">
        <p className="muted">No orders right now. Go post a design.</p>
      </div>
    );

  return (
    <main>
      <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Orders</h1>

      {orders.map((o) => (
        <div key={o.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: '1.2rem' }}>{o.buyer_name}</strong>
            <span className="muted" style={{ fontSize: '0.8rem' }}>{o.code}</span>
          </div>

          {o.buyer_note && <div className="muted" style={{ fontSize: '0.92rem' }}>{o.buyer_note}</div>}

          <ul style={{ margin: '12px 0', paddingLeft: 18 }}>
            {o.items.map((i, n) => (
              <li key={n}>
                {i.qty}× {i.name}
                {(i.size || i.color) && (
                  <span className="muted"> — {[i.size, i.color].filter(Boolean).join(', ')}</span>
                )}
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{money(o.total_cents)}</div>
              <div className="muted" style={{ fontSize: '0.82rem' }}>
                {STATUS_LABEL[o.status]} · {o.channel === 'online' ? 'shipping' : 'school'}
              </div>
            </div>

            {NEXT_STATUS[o.status] && (
              <form action={advanceOrder}>
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="next" value={NEXT_STATUS[o.status]!} />
                <button className="btn small">{NEXT_LABEL[o.status]}</button>
              </form>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
