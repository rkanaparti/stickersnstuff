'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { readBag, writeBag, bagTotal, BagItem } from '@/components/bag';

const money = (c: number) => `$${(c / 100).toFixed(2)}`;

export default function Checkout({ stripeOn }: { stripeOn: boolean }) {
  const router = useRouter();
  const [bag, setBag] = useState<BagItem[]>([]);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setBag(readBag()), []);

  function remove(i: number) {
    const next = bag.filter((_, n) => n !== i);
    setBag(next);
    writeBag(next);
  }

  async function submit(channel: 'pickup' | 'online') {
    if (channel === 'pickup' && name.trim().length < 2) {
      setError('Put your first name so she knows who to find.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: bag, buyer_name: name, buyer_note: note, channel }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Something went wrong (status ${res.status}). Try again.`);
      }

      if (!res.ok) throw new Error(data?.error || 'Something went wrong.');
      writeBag([]);
      if (data.checkout_url) window.location.href = data.checkout_url;
      else router.push(`/thanks/${data.code}`);
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  }

  if (bag.length === 0) {
    return (
      <main className="wrap">
        <div className="empty">
          <p className="muted">Your bag is empty.</p>
          <p><Link href="/" className="btn ghost small">Go pick something</Link></p>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ paddingBottom: 60 }}>
      <p style={{ padding: '22px 0 6px' }}>
        <Link href="/" className="muted" style={{ textDecoration: 'none' }}>← keep shopping</Link>
      </p>
      <h1 style={{ fontSize: 'clamp(1.9rem,7vw,2.6rem)' }}>Your bag</h1>

      {bag.map((i, n) => (
        <div key={n} className="card" style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          {i.image && <img src={i.image} alt="" style={{ width: 62, height: 62, objectFit: 'cover', borderRadius: 12 }} />}
          <div style={{ flex: 1 }}>
            <strong>{i.name}</strong>
            <div className="muted" style={{ fontSize: '0.9rem' }}>
              {[i.size, i.color, `×${i.qty}`].filter(Boolean).join(' · ')}
            </div>
          </div>
          <div>{money(i.price_cents * i.qty)}</div>
          <button className="btn ghost small" onClick={() => remove(n)} aria-label={`Remove ${i.name}`}>✕</button>
        </div>
      ))}

      <p style={{ fontSize: '1.35rem', textAlign: 'right', margin: '10px 4px 26px' }}>
        Total <strong>{money(bagTotal(bag))}</strong>
      </p>

      <div className="card">
        <h2 style={{ fontSize: '1.3rem' }}>Get it at school</h2>
        <p className="muted" style={{ fontSize: '0.92rem', marginTop: 6 }}>
          She&apos;ll bring it to you and you pay her cash. No card needed.
        </p>

        <label htmlFor="nm">Your first name</label>
        <input id="nm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mia" autoComplete="off" />

        <label htmlFor="nt">Where to find you</label>
        <input id="nt" value={note} onChange={(e) => setNote(e.target.value)} placeholder="6th grade, Ms. Patel's class" />

        <div style={{ marginTop: 22 }}>
          <button className="btn" onClick={() => submit('pickup')} disabled={busy}>
            {busy ? 'One sec…' : 'Reserve it'}
          </button>
        </div>
      </div>

      {stripeOn && (
        <div className="card">
          <h2 style={{ fontSize: '1.3rem' }}>Or pay now and get it shipped</h2>
          <p className="muted" style={{ fontSize: '0.92rem', marginTop: 6 }}>
            Card payment on the next screen. Ask a parent first.
          </p>
          <div style={{ marginTop: 18 }}>
            <button className="btn sage" onClick={() => submit('online')} disabled={busy}>
              Pay with card
            </button>
          </div>
        </div>
      )}

      {error && <p className="center" style={{ color: '#B4304A', fontWeight: 600 }}>{error}</p>}
    </main>
  );
}
