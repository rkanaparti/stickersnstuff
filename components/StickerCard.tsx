'use client';
import Link from 'next/link';
import { useRef } from 'react';

export default function StickerCard({
  href, image, name, price, flag,
}: { href: string; image: string; name: string; price: string; flag?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function move(e: React.PointerEvent) {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rx', `${-y * 12}deg`);
    el.style.setProperty('--ry', `${x * 14}deg`);
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('--rx');
    el.style.removeProperty('--ry');
  }

  return (
    <Link
      ref={ref}
      href={href}
      className="sticker tiltable"
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerDown={() => navigator.vibrate?.(6)}
    >
      {flag && <span className="flag">{flag}</span>}
      <span className="shine" aria-hidden />
      <img className="shot" src={image} alt={name} />
      <div className="name">{name}</div>
      <div className="price">{price}</div>
    </Link>
  );
}
