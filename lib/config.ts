// Real config comes entirely from Vercel environment variables.
// Set DATABASE_URL, BOSS_PASSWORD, and (optionally) STRIPE_SECRET_KEY under
// Project → Settings → Environment Variables.

export const DATABASE_URL = process.env.DATABASE_URL || '';

export const BOSS_PASSWORD = process.env.BOSS_PASSWORD || '';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

if (!DATABASE_URL || !BOSS_PASSWORD) {
  // Fails loudly at build/runtime instead of silently falling back to a
  // stale hardcoded value — missing env vars should be visible, not masked.
  console.warn('[config] DATABASE_URL or BOSS_PASSWORD is not set in the environment.');
}
