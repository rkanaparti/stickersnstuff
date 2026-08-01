import {
  sql, CustomRequest, CUSTOM_STATUS_LABEL, CUSTOM_NEXT_STATUS, CUSTOM_NEXT_LABEL,
} from '@/lib/db';
import { updateCustomRequestStatus } from '../actions';

export const dynamic = 'force-dynamic';

export default async function CustomRequests() {
  const reqs = (await sql`
    select * from custom_requests where status <> 'done' order by created_at asc
  `) as CustomRequest[];

  if (reqs.length === 0)
    return (
      <div className="empty">
        <p className="muted">No custom tee requests right now.</p>
      </div>
    );

  return (
    <main>
      <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Custom tee requests</h1>

      {reqs.map((r) => (
        <div key={r.id} className="card">
          <div style={{ display: 'flex', gap: 12 }}>
            <img src={r.image_url} alt="" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 12, flex: 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{r.name}</strong>
              {(r.email || r.phone) && (
                <div className="muted" style={{ fontSize: '0.85rem' }}>
                  {[r.email, r.phone].filter(Boolean).join(' · ')}
                </div>
              )}
              <div style={{ fontSize: '0.92rem', marginTop: 4 }}>
                {[r.shirt_color, r.size, r.fit_type, r.shirt_type, r.placement && `${r.placement} print`]
                  .filter(Boolean).join(' · ')}
              </div>
              {r.note && <div className="muted" style={{ fontSize: '0.88rem', marginTop: 4 }}>{r.note}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <span className="muted" style={{ fontSize: '0.82rem' }}>{CUSTOM_STATUS_LABEL[r.status]}</span>
            {CUSTOM_NEXT_STATUS[r.status] && (
              <form action={updateCustomRequestStatus}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="status" value={CUSTOM_NEXT_STATUS[r.status]!} />
                <button className="btn small">{CUSTOM_NEXT_LABEL[r.status]}</button>
              </form>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
