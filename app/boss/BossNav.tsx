'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/boss', label: 'Money', icon: '💰' },
  { href: '/boss/orders', label: 'Orders', icon: '📦' },
  { href: '/boss/products', label: 'Stuff', icon: '🏷️' },
  { href: '/boss/make', label: 'Make', icon: '✨' },
  { href: '/boss/look', label: 'Look', icon: '🎨' },
];

export default function BossNav() {
  const pathname = usePathname();

  return (
    <nav className="tabbar">
      {TABS.map((t) => {
        const on = t.href === '/boss' ? pathname === '/boss' : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} className={on ? 'on' : ''} aria-current={on ? 'page' : undefined}>
            <span className="tabicon" aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
