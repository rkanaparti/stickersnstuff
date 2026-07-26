'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { readBag, bagCount } from './bag';

export default function BagLink() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const sync = () => setN(bagCount(readBag()));
    sync();
    window.addEventListener('bagchange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('bagchange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  if (n === 0) return null;
  return (
    <Link
      href="/bag"
      className="btn"
      style={{
        position: 'fixed', left: 20, right: 20, bottom: 18, width: 'auto',
        zIndex: 20, boxShadow: '0 12px 30px -10px rgba(0,0,0,.45)',
      }}
    >
      See my bag ({n})
    </Link>
  );
}
