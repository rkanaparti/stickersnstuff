import Link from 'next/link';
import { getSettings, aiSpend, maskKey } from '@/lib/settings';
import { saveAiSettings } from '../actions';
import { money, sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Setup({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const sp = await searchParams;
  const s = await getSettings();
  const spend = await aiSpend();
  const recent = (await sql`
    select prompt, cost_cents, created_at from ai_generations
    order by created_at desc limit 8
  `) as { prompt: string; cost_cents: number; created_at: string }[];

  return (
    <main>
      <h1 style={{ fontSize: '2rem' }}>Setup</h1>
      <p className="muted" style={{ marginTop: 0 }}>Dad stuff. She shouldn&apos;t need this screen.</p>

      {sp.saved === '1' && (
        <p className="card center" style={{ background: 'var(--accent)', fontWeight: 600 }}>Saved.</p>
      )}

      <div className="card">
        <div className="muted" style={{ fontSize: '0.78rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          AI spend
        </div>
        <p className="display" style={{ fontSize: '2.6rem', margin: '4px 0', color: 'var(--primary)' }}>
          {money(spend.this_month)}
        </p>
        <div className="muted" style={{ fontSize: '0.9rem' }}>
          this month &middot; {money(spend.all_time)} all time &middot; {spend.images} images made, {spend.kept} kept
        </div>
      </div>

      <form action={saveAiSettings}>
        <label htmlFor="k">OpenAI API key</label>
        <input id="k" name="openai_api_key" type="password" autoComplete="off"
          placeholder={s.openai_api_key ? maskKey(s.openai_api_key)! : 'sk-...'} />
        <p className="muted" style={{ fontSize: '0.84rem', marginTop: 6 }}>
          {s.openai_api_key
            ? 'A key is saved. Leave this blank to keep it, or paste a new one to replace it.'
            : 'Paste your key from platform.openai.com. It is stored in your database and never sent back to the browser.'}
        </p>

        <label htmlFor="c">Cost per image, in cents</label>
        <input id="c" name="cost_per_image_cents" type="number" min="0" step="1" inputMode="numeric"
          defaultValue={s.cost_per_image_cents} />
        <p className="muted" style={{ fontSize: '0.84rem', marginTop: 6 }}>
          Used to tally spend. Check current pricing on OpenAI and set it to match your model and quality.
        </p>

        <label htmlFor="q">Quality</label>
        <select id="q" name="ai_quality" defaultValue={s.ai_quality}>
          <option value="low">Low &mdash; cheapest</option>
          <option value="medium">Medium</option>
          <option value="high">High &mdash; priciest</option>
        </select>

        <div style={{ marginTop: 24 }}>
          <button className="btn">Save setup</button>
        </div>
      </form>

      {recent.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: '1.2rem' }}>Recent generations</h2>
          {recent.map((r, i) => (
            <div key={i} className="card" style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ flex: 1, fontSize: '0.92rem' }}>{r.prompt.slice(0, 70)}</span>
              <span className="muted" style={{ fontSize: '0.85rem' }}>{money(r.cost_cents)}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Link href="/boss/errors" className="btn ghost small">See error log</Link>
      </div>
    </main>
  );
}
