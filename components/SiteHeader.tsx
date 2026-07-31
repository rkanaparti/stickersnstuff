'use client';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function SiteHeader({
  storeName, tagline, logoUrl,
}: { storeName: string; tagline: string; logoUrl: string | null }) {
  const pathname = usePathname();
  if (pathname.startsWith('/boss')) return null;

  return (
    <div className="wrap">
      <header className="masthead">
        {logoUrl && <img className="logo" src={logoUrl} alt="" />}
        <h1>{storeName}</h1>
        {tagline && <p className="tagline">{tagline}</p>}
      </header>
      <nav className="sitenav" aria-label="Main">
        <NavBar />
      </nav>
    </div>
  );
}
