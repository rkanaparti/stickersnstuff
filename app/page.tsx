import { Suspense } from 'react';
import { sql, money, Product } from '@/lib/db';
import BagLink from '@/components/BagLink';
import FilterBar from '@/components/FilterBar';
import StickerCard from '@/components/StickerCard';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: { searchParams: Promise<{ kind?: string; who?: string }> }) {
  const sp = await searchParams;
  const kind = ['sticker', 'shirt', 'hat', 'other'].includes(sp.kind || '') ? sp.kind! : null;
  const who = ['girls', 'boys'].includes(sp.who || '') ? sp.who! : null;

  const items = (await sql`
    select * from products
    where active = true
      and (${kind}::text is null or kind = ${kind})
      and (${who}::text is null or audience = ${who} or audience = 'everyone')
    order by sort asc, id desc
  `) as Product[];

  return (
    <main className="wrap wrap-wide">
      <Suspense fallback={<div style={{ height: 96 }} />}>
        <FilterBar />
      </Suspense>

      <BagLink />

      <div className="sheet">
        <StickerCard
          href="/custom"
          icon="👕"
          name="Design your own Tee"
          price="Request a quote"
          flag="Custom"
        />
        {items.map((p) => (
          <StickerCard
            key={p.id}
            href={`/p/${p.slug}`}
            image={p.images[0] || ''}
            name={p.name}
            price={money(p.price_cents)}
            flag={p.stock !== null && p.stock <= 3 && p.stock > 0 ? `${p.stock} left` : undefined}
          />
        ))}
      </div>

      {items.length === 0 && (
        <p className="muted center" style={{ padding: '10px 0 50px' }}>
          Nothing else matches that yet. Try another filter.
        </p>
      )}

      <footer className="center muted" style={{ padding: '30px 0 50px', fontSize: '0.85rem' }}>
        <p>Order here, pay me at school &mdash; or pay online and I&apos;ll ship it.</p>
      </footer>
    </main>
  );
}
