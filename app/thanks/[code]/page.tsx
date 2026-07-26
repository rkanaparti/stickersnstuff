import Link from 'next/link';
import { notFound } from 'next/navigation';
import { sql, money, Order } from '@/lib/db';
import Confetti from '@/components/Confetti';

export const dynamic = 'force-dynamic';

export default async function Thanks({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const rows = (await sql`select * from orders where code = ${code} limit 1`) as Order[];
  const o = rows[0];
  if (!o) notFound();

  return (
    <main className="wrap center" style={{ maxWidth: 520, paddingTop: 60 }}>
      <Confetti />
      <div className="bignum pop" aria-hidden style={{ color: 'var(--accent)' }}>✓</div>
      <h1 style={{ fontSize: '2.2rem', marginTop: 10 }}>
        {o.channel === 'online' ? "You're all set" : "It's reserved"}
      </h1>

      <p className="muted" style={{ marginTop: 14 }}>
        {o.channel === 'online'
          ? 'Your order is paid and will ship soon.'
          : `Bring ${money(o.total_cents)} in cash. She'll find you at school.`}
      </p>

      <div className="card" style={{ marginTop: 26 }}>
        <p className="muted" style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          Your order code
        </p>
        <p className="display" style={{ fontSize: '2rem', margin: '6px 0 0' }}>{o.code}</p>
      </div>

      <p style={{ marginTop: 26 }}>
        <Link href="/" className="btn ghost">Back to the store</Link>
      </p>
    </main>
  );
}
