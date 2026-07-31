'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Shop' },
  { href: '/custom', label: 'Custom Tee' },
  { href: '/contact', label: 'Contact' },
];

export default function NavBar() {
  const pathname = usePathname();
  if (pathname.startsWith('/boss')) return null;

  return (
    <nav className="sitenav" aria-label="Main">
      <div className="wrap sitenav-row">
        {LINKS.map((l) => {
          const on = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`pill tiny ${on ? 'on' : ''}`}
              aria-current={on ? 'page' : undefined}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
