'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { keepSticker } from '../actions';

const STYLES = [
  { key: 'kawaii', label: 'Cute' },
  { key: 'sparkle', label: 'Sparkly' },
  { key: 'retro', label: 'Retro' },
  { key: 'bold', label: 'Bold' },
];

const money = (c: number) => `$${(c / 100).toFixed(2)}`;

export default function Maker(
  { costPerImage, spentThisMonth }: { costPerImage: number; spentThisMonth: number }
) {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('kawaii');
  const [border, setBorder] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [made, setMade] = useState<
    { id: number; image_url: string; cut_svg_url: string | null } | null
  >(null);

  async function draw() {
    setBusy(true); setErr(''); setMade(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, border }),
      });

      let d: any = null;
      try {
        d = await res.json();
      } catch {
        throw new Error(`The server didn't finish responding (status ${res.status}). Try again.`);
      }

      if (!res.ok) throw new Error(d?.error || 'The sticker maker hit a snag.');
      setMade(d);
      navigator.vibrate?.([10, 40, 10]);
    } catch (e: any) {
      setErr(e.message);
    }
    setBusy(false);
  }

  return (
    <main>
      <h1 style={{ fontSize: '2rem' }}>Make a sticker</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Describe it. {money(costPerImage)} a try &middot; {money(spentThisMonth)} used this month.
      </p>

      <label htmlFor="p">What should it be?</label>
      <textarea id="p" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)}
        placeholder="a sad cat holding a boba tea" />

      <label>Style</label>
      <div className="chips">
        {STYLES.map((s) => (
          <button key={s.key} type="button"
            className={`pill ${style === s.key ? 'on' : ''}`}
            onClick={() => setStyle(s.key)}>
            {s.label}
          </button>
        ))}
      </div>

      <label className="chip" style={{ display: 'inline-flex', gap: 8, marginTop: 18 }}>
        <input type="checkbox" checked={border} onChange={(e) => setBorder(e.target.checked)} />
        White sticker border
      </label>
      <p className="muted" style={{ fontSize: '0.84rem', marginTop: 6 }}>
        Leave this on for Cricut. The white outline gives the blade room to be slightly off.
      </p>

      <div style={{ marginTop: 22 }}>
        <button className="btn" onClick={draw} disabled={busy || prompt.trim().length < 3}>
          {busy ? 'Drawing…' : made ? 'Try another' : 'Draw it'}
        </button>
      </div>

      {err && <p className="center" style={{ color: '#B4304A', fontWeight: 600 }}>{err}</p>}

      {made && (
        <div className="card pop" style={{ marginTop: 22, textAlign: 'center' }}>
          <img src={made.image_url} alt="" style={{
            width: '100%', maxWidth: 320, borderRadius: 'var(--radius)',
            background: 'var(--highlight)',
          }} />

          <form action={keepSticker} style={{ textAlign: 'left', marginTop: 12 }}>
            <input type="hidden" name="gen_id" value={made.id} />
            <input type="hidden" name="image_url" value={made.image_url} />
            <input type="hidden" name="cut_svg_url" value={made.cut_svg_url || ''} />
            <input type="hidden" name="border_on" value={String(border)} />

            <label htmlFor="nm">Name it</label>
            <input id="nm" name="name" required defaultValue={prompt.slice(0, 40)} />

            <label htmlFor="pr">Price</label>
            <input id="pr" name="price" type="number" step="0.25" min="0" inputMode="decimal" defaultValue="3.00" required />

            <label htmlFor="au">Who is it for</label>
            <select id="au" name="audience" defaultValue="everyone">
              <option value="everyone">Everyone</option>
              <option value="girls">Girls</option>
              <option value="boys">Boys</option>
            </select>

            <div style={{ marginTop: 20 }}>
              <button className="btn sage">Put it in my store</button>
            </div>
          </form>

          {made.cut_svg_url && (
            <a className="btn ghost small" href={made.cut_svg_url} download
              style={{ marginTop: 12 }}>
              Download Cricut cut file
            </a>
          )}
        </div>
      )}
    </main>
  );
}
