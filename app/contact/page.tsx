import { getContact } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const c = await getContact();
  return { title: c.heading };
}

export default async function ContactPage() {
  const c = await getContact();
  const hasDetails = c.email || c.phone || c.address || c.hours;

  return (
    <main className="wrap" style={{ paddingBottom: 80 }}>
      <h1 style={{ fontSize: '2rem', margin: '26px 0 4px' }}>{c.heading}</h1>

      {c.body && (
        <div className="card" style={{ whiteSpace: 'pre-line' }}>
          {c.body}
        </div>
      )}

      {hasDetails && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {c.email && (
            <p style={{ margin: 0 }}>
              ✉️ <a href={`mailto:${c.email}`}>{c.email}</a>
            </p>
          )}
          {c.phone && (
            <p style={{ margin: 0 }}>
              📞 <a href={`tel:${c.phone}`}>{c.phone}</a>
            </p>
          )}
          {c.address && <p style={{ margin: 0 }}>📍 {c.address}</p>}
          {c.hours && <p style={{ margin: 0 }}>🕒 {c.hours}</p>}
        </div>
      )}
    </main>
  );
}
