'use client';
import { useState } from 'react';
import { SHIRT_COLORS, SHIRT_COLOR_SWATCH, SHIRT_TYPES } from '@/lib/constants';

export default function CustomForm() {
  const [color, setColor] = useState<string>(SHIRT_COLORS[0]);
  const [type, setType] = useState<string>(SHIRT_TYPES[0].key);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set('shirt_color', color);
    fd.set('shirt_type', type);
    try {
      const res = await fetch('/api/custom-request', { method: 'POST', body: fd });
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error(`That didn't go through (server said ${res.status}). Try again.`);
      }
      if (!res.ok) throw new Error(data?.error || "That didn't go through.");
      setDone(true);
    } catch (e: any) {
      setErr(e.message || "That didn't go through. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card center pop" style={{ background: 'var(--accent)' }}>
        <strong style={{ fontSize: '1.2rem' }}>Got it! 🎉</strong>
        <p style={{ marginTop: 6 }}>We&apos;ll take a look at your design and get back to you with a price.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 8 }}>
      <label htmlFor="name">Your name</label>
      <input id="name" name="name" required placeholder="Your name" />

      <label htmlFor="email">Email <span className="muted">(optional)</span></label>
      <input id="email" name="email" type="email" placeholder="you@example.com" />

      <label htmlFor="phone">Phone <span className="muted">(optional)</span></label>
      <input id="phone" name="phone" type="tel" placeholder="555-123-4567" />

      <label>Shirt color</label>
      <div className="chips">
        {SHIRT_COLORS.map((c) => (
          <label key={c} className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="radio" name="shirt_color_pick" checked={color === c} onChange={() => setColor(c)} />
            <span
              aria-hidden
              style={{
                width: 14, height: 14, borderRadius: '50%',
                background: SHIRT_COLOR_SWATCH[c], boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2)',
              }}
            />
            {c}
          </label>
        ))}
      </div>

      <label>Shirt type</label>
      <div className="chips">
        {SHIRT_TYPES.map((t) => (
          <label key={t.key} className="chip">
            <input type="radio" name="shirt_type_pick" checked={type === t.key} onChange={() => setType(t.key)} />
            {t.label}
          </label>
        ))}
      </div>

      <label htmlFor="image">Your design</label>
      <label className="btn ghost" style={{ cursor: 'pointer', minHeight: 64, borderStyle: 'dashed', margin: '6px 0 0' }}>
        {fileName || '📷 Upload your design'}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          style={{ display: 'none' }}
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
        />
      </label>

      <label htmlFor="note">Anything else we should know? <span className="muted">(optional)</span></label>
      <textarea id="note" name="note" rows={3} placeholder="Placement, size, timeline..." />

      {err && <p style={{ color: '#B4304A' }}>{err}</p>}

      <div style={{ marginTop: 26 }}>
        <button className="btn" disabled={busy}>{busy ? 'Sending…' : 'Send my design'}</button>
      </div>
    </form>
  );
}
