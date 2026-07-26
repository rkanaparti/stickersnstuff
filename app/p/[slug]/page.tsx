import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sql, money, Product } from '@/lib/db';
import Picker from './Picker';
import BagLink from '@/components/BagLink';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = (await sql`
    select * from products where slug = ${slug} and active = true limit 1
  `) as Product[];
  const p = rows[0];
  if (!p) notFound();

  return (
    <main className="wrap" style={{ paddingBottom: 100 }}>
      <p style={{ padding: '22px 0 6px' }}>
        <Link href="/" className="muted" style={{ textDecoration: 'none' }}>← everything else</Link>
      </p>

      <img
        className="shot"
        src={p.images[0] || ''}
        alt={p.name}
        style={{ borderRadius: 'var(--radius)', maxWidth: 460, margin: '0 auto' }}
      />

      {p.images.length > 1 && (
        <div className="chips" style={{ justifyContent: 'center', marginTop: 12 }}>
          {p.images.slice(1).map((src, i) => (
            <img key={i} src={src} alt="" style={{ width: 66, height: 66, objectFit: 'cover', borderRadius: 12 }} />
          ))}
        </div>
      )}

      <h1 style={{ fontSize: 'clamp(1.9rem,7vw,2.8rem)', marginTop: 22 }}>{p.name}</h1>
      <p style={{ fontSize: '1.3rem', marginTop: 6 }}>{money(p.price_cents)}</p>
      {p.blurb && <p className="muted">{p.blurb}</p>}

      <Picker product={JSON.parse(JSON.stringify(p))} />
      <BagLink />
    </main>
  );
}
