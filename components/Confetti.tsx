'use client';
import { useEffect, useState } from 'react';

export default function Confetti() {
  const [bits, setBits] = useState<{ l: number; d: number; c: string }[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const styles = getComputedStyle(document.documentElement);
    const palette = ['--primary', '--accent', '--highlight'].map((v) =>
      styles.getPropertyValue(v).trim() || '#7C5CBF'
    );
    setBits(
      Array.from({ length: 40 }, () => ({
        l: Math.random() * 100,
        d: Math.random() * 1.2,
        c: palette[Math.floor(Math.random() * palette.length)],
      }))
    );
    navigator.vibrate?.([10, 40, 10]);
  }, []);

  if (!bits.length) return null;
  return (
    <div className="confetti" aria-hidden>
      {bits.map((b, i) => (
        <i key={i} style={{ left: `${b.l}%`, background: b.c, animationDelay: `${b.d}s` }} />
      ))}
    </div>
  );
}
