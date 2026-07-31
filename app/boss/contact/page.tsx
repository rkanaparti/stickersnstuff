import { getContact } from '@/lib/db';
import { saveContact } from '../actions';

export const dynamic = 'force-dynamic';

export default async function ContactAdmin({
  searchParams,
}: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const c = await getContact();

  return (
    <main>
      <h1 style={{ fontSize: '2rem' }}>Contact page</h1>
      <p className="muted" style={{ marginTop: 0 }}>What shows on your Contact page.</p>

      {sp.saved === '1' && (
        <p className="card center" style={{ background: 'var(--accent)', fontWeight: 600 }}>Saved.</p>
      )}

      <form action={saveContact}>
        <label htmlFor="heading">Heading</label>
        <input id="heading" name="heading" defaultValue={c.heading} required />

        <label htmlFor="body">Message <span className="muted">(the main text on the page)</span></label>
        <textarea id="body" name="body" rows={5} defaultValue={c.body}
          placeholder="Say hi, tell people how ordering works, whatever you want here." />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" defaultValue={c.email || ''} placeholder="you@example.com" />

        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" defaultValue={c.phone || ''} placeholder="555-123-4567" />

        <label htmlFor="address">Address</label>
        <input id="address" name="address" defaultValue={c.address || ''} placeholder="optional" />

        <label htmlFor="hours">Hours</label>
        <input id="hours" name="hours" defaultValue={c.hours || ''} placeholder="Mon–Fri, 3–6pm" />

        <div style={{ marginTop: 24 }}>
          <button className="btn">Save contact page</button>
        </div>
      </form>
    </main>
  );
}
