'use client';
import { useState } from 'react';
import { saveTheme } from '../actions';
import Uploader from '@/components/Uploader';
import type { Theme } from '@/lib/db';

const PALETTES: { name: string; c: Partial<Theme> }[] = [
  { name: 'Lavender + Sage', c: { c_paper: '#FBF7FF', c_ink: '#2C2438', c_primary: '#7C5CBF', c_accent: '#93B08A', c_highlight: '#EDE3FB' } },
  { name: 'Deep Purple',     c: { c_paper: '#F6F2FA', c_ink: '#241A33', c_primary: '#5B2E8C', c_accent: '#C9A7E8', c_highlight: '#E7DCF3' } },
  { name: 'Sage + Cream',    c: { c_paper: '#F7F8F2', c_ink: '#2A3327', c_primary: '#6B8E5E', c_accent: '#C2CBA8', c_highlight: '#E4EADA' } },
  { name: 'Midnight',        c: { c_paper: '#1B1626', c_ink: '#F3EDFA', c_primary: '#A987E0', c_accent: '#8FBF9F', c_highlight: '#2E2640' } },
  { name: 'Cotton Candy',    c: { c_paper: '#FFF6FA', c_ink: '#3A2438', c_primary: '#D46FA8', c_accent: '#A8D8E8', c_highlight: '#FBE1EE' } },
  { name: 'Butter',          c: { c_paper: '#FFFBEF', c_ink: '#33301F', c_primary: '#C98A2E', c_accent: '#9FB88C', c_highlight: '#F6EBCC' } },
];

const FONTS = [
  'Bricolage Grotesque', 'DM Sans', 'Fraunces', 'Gloria Hallelujah', 'Quicksand',
  'Space Grotesk', 'Playfair Display', 'Nunito', 'Caprasimo', 'Poppins',
  'Lora', 'Chewy', 'Outfit', 'Karla', 'Rubik', 'Comfortaa',
];

const COLOR_FIELDS: [keyof Theme, string, string][] = [
  ['c_paper', 'Background', 'The color behind everything'],
  ['c_ink', 'Text', 'Your words'],
  ['c_primary', 'Buttons', 'The main pop of color'],
  ['c_accent', 'Highlights', 'Little badges and extras'],
  ['c_highlight', 'Soft edges', 'Outlines and empty spots'],
];

export default function Editor({ theme, saved }: { theme: Theme; saved: boolean }) {
  const [t, setT] = useState<Theme>(theme);
  const set = (k: keyof Theme, v: any) => setT((p) => ({ ...p, [k]: v }));

  const fontHref =
    'https://fonts.googleapis.com/css2?' +
    [...new Set(FONTS)].map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;800`).join('&') +
    '&display=swap';

  const preview: React.CSSProperties = {
    background: t.c_paper, color: t.c_ink,
    borderRadius: t.radius_px, padding: 22, textAlign: 'center',
    fontFamily: `'${t.f_body}', sans-serif`,
    boxShadow: '0 10px 30px -20px rgba(0,0,0,.6)',
  };

  return (
    <main>
      <link rel="stylesheet" href={fontHref} />
      <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>Make it yours</h1>
      <p className="muted" style={{ marginTop: 0 }}>Change anything. Nothing breaks.</p>

      {saved && (
        <p className="card center" style={{ background: 'var(--accent)', fontWeight: 600 }}>
          Saved — your store looks different now.
        </p>
      )}

      {/* live preview */}
      <div style={{ ...preview, marginBottom: 20 }}>
        <div style={{ fontFamily: `'${t.f_display}', sans-serif`, fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.05 }}>
          {t.store_name || 'your store'}
        </div>
        <div style={{ fontSize: '0.75rem', letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.6, marginTop: 8 }}>
          {t.tagline}
        </div>
        <div style={{
          background: '#fff', color: t.c_ink, borderRadius: t.radius_px - 4,
          padding: 12, margin: '18px auto 0', maxWidth: 200,
          transform: t.tilt_on ? 'rotate(-1.6deg)' : 'none',
          boxShadow: '0 8px 22px -14px rgba(0,0,0,.5)',
        }}>
          <div style={{ aspectRatio: '1', background: t.c_highlight, borderRadius: t.radius_px - 10 }} />
          <div style={{ fontWeight: 600, marginTop: 8, textAlign: 'left' }}>Sad Cat Sticker</div>
          <div style={{ opacity: 0.6, textAlign: 'left', fontSize: '0.9rem' }}>$3.00</div>
        </div>
        <div style={{
          background: t.c_primary, color: '#fff', borderRadius: t.radius_px - 4,
          padding: '13px 20px', marginTop: 16, fontWeight: 600, display: 'inline-block',
        }}>Add to bag</div>
      </div>

      <form action={saveTheme}>
        <label>Quick looks</label>
        <div className="chips">
          {PALETTES.map((p) => (
            <button
              key={p.name} type="button" className="chip"
              onClick={() => setT((prev) => ({ ...prev, ...p.c }))}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <span style={{ display: 'flex' }}>
                {[p.c.c_primary, p.c.c_accent, p.c.c_highlight].map((c) => (
                  <span key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c, marginLeft: -4, border: '2px solid #fff' }} />
                ))}
              </span>
              {p.name}
            </button>
          ))}
        </div>

        <label style={{ marginTop: 26 }}>Or pick every color yourself</label>
        {COLOR_FIELDS.map(([key, label, hint]) => (
          <div key={key} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
            <input
              type="color" name={key} value={t[key] as string}
              onChange={(e) => set(key, e.target.value)}
              style={{ width: 68, flex: 'none' }} aria-label={label}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{label}</div>
              <div className="muted" style={{ fontSize: '0.85rem' }}>{hint}</div>
            </div>
          </div>
        ))}

        <label htmlFor="fd">Big font (titles)</label>
        <select id="fd" name="f_display" value={t.f_display} onChange={(e) => set('f_display', e.target.value)}
          style={{ fontFamily: `'${t.f_display}', sans-serif`, fontSize: '1.1rem' }}>
          {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</option>)}
        </select>

        <label htmlFor="fb">Regular font (everything else)</label>
        <select id="fb" name="f_body" value={t.f_body} onChange={(e) => set('f_body', e.target.value)}
          style={{ fontFamily: `'${t.f_body}', sans-serif` }}>
          {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif` }}>{f}</option>)}
        </select>

        <label htmlFor="r">Corner roundness — {t.radius_px}px</label>
        <input id="r" name="radius_px" type="range" min="0" max="34" value={t.radius_px}
          onChange={(e) => set('radius_px', Number(e.target.value))} style={{ padding: 0, border: 0, minHeight: 30 }} />

        <label className="chip" style={{ display: 'inline-flex', gap: 8, marginTop: 8 }}>
          <input type="checkbox" name="tilt_on" checked={t.tilt_on} onChange={(e) => set('tilt_on', e.target.checked)} />
          Tilt the cards like real stickers
        </label>

        <label htmlFor="sn" style={{ marginTop: 24 }}>Store name</label>
        <input id="sn" name="store_name" value={t.store_name} onChange={(e) => set('store_name', e.target.value)} />

        <label htmlFor="tg">Tagline</label>
        <input id="tg" name="tagline" value={t.tagline} onChange={(e) => set('tagline', e.target.value)} />

        <label>Your logo</label>
        <Uploader name="logo_url" single initial={t.logo_url ? [t.logo_url] : []} />

        <div style={{ marginTop: 26 }}>
          <button className="btn">Save my look</button>
        </div>
      </form>
    </main>
  );
}
