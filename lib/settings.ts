import { sql } from './db';

export type Settings = {
  openai_api_key: string | null;
  cost_per_image_cents: number;
  ai_model: string;
  ai_quality: string;
};

export async function getSettings(): Promise<Settings> {
  const rows = (await sql`select key, value from settings`) as { key: string; value: string | null }[];
  const m = new Map(rows.map((r) => [r.key, r.value]));
  return {
    openai_api_key: m.get('openai_api_key') || process.env.OPENAI_API_KEY || null,
    cost_per_image_cents: Number(m.get('cost_per_image_cents') || 4),
    ai_model: m.get('ai_model') || 'gpt-image-1',
    ai_quality: m.get('ai_quality') || 'medium',
  };
}

/** Never send the real key to the browser. */
export function maskKey(k: string | null) {
  if (!k) return null;
  return `${k.slice(0, 7)}…${k.slice(-4)}`;
}

export async function setSetting(key: string, value: string | null) {
  await sql`
    insert into settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
}

export async function aiSpend() {
  const [r] = (await sql`
    select
      coalesce(sum(cost_cents), 0)::int as all_time,
      coalesce(sum(cost_cents) filter (where created_at >= date_trunc('month', now())), 0)::int as this_month,
      count(*)::int as images,
      count(*) filter (where kept)::int as kept
    from ai_generations
  `) as any[];
  return r as { all_time: number; this_month: number; images: number; kept: number };
}
