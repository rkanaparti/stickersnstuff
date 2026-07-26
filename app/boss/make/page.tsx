import Link from 'next/link';
import { getSettings, aiSpend, maskKey } from '@/lib/settings';
import Maker from './Maker';

export const dynamic = 'force-dynamic';

export default async function Make() {
  const s = await getSettings();
  const spend = await aiSpend();

  if (!s.openai_api_key) {
    return (
      <main>
        <h1 style={{ fontSize: '2rem' }}>Make a sticker</h1>
        <div className="card" style={{ marginTop: 18 }}>
          <p>This needs an API key before it can draw anything.</p>
          <Link href="/boss/setup" className="btn">Add the key</Link>
        </div>
      </main>
    );
  }

  return <Maker costPerImage={s.cost_per_image_cents} spentThisMonth={spend.this_month} />;
}
