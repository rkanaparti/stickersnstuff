'use client';
import { useState } from 'react';

export default function Uploader(
  { name, initial, single }: { name: string; initial?: string[]; single?: boolean }
) {
  const [urls, setUrls] = useState<string[]>(initial || []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setBusy(true); setErr('');
    try {
      for (const f of files) {
        const fd = new FormData();
        fd.append('file', f);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });

        let data: any = null;
        try {
          data = await res.json();
        } catch {
          // server sent something that wasn't JSON (a crash page, a timeout, etc.)
          throw new Error(`Upload failed (server said ${res.status}). Try again.`);
        }

        if (!res.ok) throw new Error(data?.error || 'That upload failed.');
        setUrls((u) => (single ? [data.url] : [...u, data.url]));
      }
    } catch (err: any) {
      setErr(err.message || 'That upload failed. Try again.');
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={urls.join(',')} />

      {urls.length > 0 && (
        <div className="chips" style={{ marginBottom: 12 }}>
          {urls.map((u, i) => (
            <div key={u} style={{ position: 'relative' }}>
              <img src={u} alt="" style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 12 }} />
              <button
                type="button"
                onClick={() => setUrls(urls.filter((_, n) => n !== i))}
                aria-label="Remove photo"
                style={{
                  position: 'absolute', top: -6, right: -6, width: 26, height: 26,
                  borderRadius: '50%', border: 0, background: 'var(--ink)', color: '#fff', cursor: 'pointer',
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      <label
        className="btn ghost"
        style={{ cursor: 'pointer', minHeight: 64, borderStyle: 'dashed', margin: 0 }}
      >
        {busy ? 'Uploading…' : urls.length ? (single ? 'Change it' : '+ Add another photo') : (single ? '📷 Upload your logo' : '📷 Add a photo')}
        <input type="file" accept="image/*" multiple={!single} onChange={pick} style={{ display: 'none' }} />
      </label>

      {err && <p style={{ color: '#B4304A' }}>{err}</p>}
    </div>
  );
}
