import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Errors() {
  const rows = (await sql`
    select id, source, message, detail, created_at
    from error_log order by created_at desc limit 40
  `) as { id: number; source: string; message: string; detail: string | null; created_at: string }[];

  return (
    <main>
      <h1 style={{ fontSize: '2rem' }}>Error log</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Dad stuff. Last 40 errors, newest first.
      </p>

      {rows.length === 0 && (
        <div className="empty"><p className="muted">Nothing logged. Good sign.</p></div>
      )}

      {rows.map((r) => (
        <details key={r.id} className="card">
          <summary style={{ cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'baseline' }}>
            <span className="badge" style={{ background: '#E7A0A0' }}>{r.source}</span>
            <strong style={{ fontSize: '0.95rem' }}>{r.message}</strong>
            <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
              {new Date(r.created_at).toLocaleString()}
            </span>
          </summary>
          {r.detail && (
            <pre style={{
              marginTop: 10, whiteSpace: 'pre-wrap', fontSize: '0.78rem',
              background: 'var(--highlight)', padding: 12, borderRadius: 10, overflowX: 'auto',
            }}>{r.detail}</pre>
          )}
        </details>
      ))}
    </main>
  );
}
