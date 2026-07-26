'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const KINDS = [
  { key: '', label: 'Everything' },
  { key: 'sticker', label: 'Stickers' },
  { key: 'shirt', label: 'T-shirts' },
  { key: 'hat', label: 'Hats' },
];

const WHO = [
  { key: '', label: 'Show all' },
  { key: 'girls', label: 'Girls' },
  { key: 'boys', label: 'Boys' },
];

export default function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  const kind = params.get('kind') || '';
  const who = params.get('who') || '';

  function go(next: Record<string, string>) {
    const q = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    if (navigator.vibrate) navigator.vibrate(8);
    start(() => router.push(q.toString() ? `/?${q}` : '/', { scroll: false }));
  }

  return (
    <nav className={`filterbar ${pending ? 'thinking' : ''}`} aria-label="Filter products">
      <div className="row">
        {KINDS.map((k) => (
          <button
            key={k.key}
            className={`pill ${kind === k.key ? 'on' : ''}`}
            aria-pressed={kind === k.key}
            onClick={() => go({ kind: k.key })}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="row sub">
        {WHO.map((w) => (
          <button
            key={w.key}
            className={`pill tiny ${who === w.key ? 'on' : ''}`}
            aria-pressed={who === w.key}
            onClick={() => go({ who: w.key })}
          >
            {w.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
