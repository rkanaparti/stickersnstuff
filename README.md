# stickersnstuff.co

Next.js + Neon + Vercel. No monthly cost on Hobby + Neon free tier.

## Deploy (about 20 minutes)

1. **Neon** — create a project, open the SQL editor, paste in `schema.sql`, run it.
   Copy the **pooled** connection string.

2. **Vercel** — import this repo. Add environment variables:

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string |
   | `BOSS_PASSWORD` | whatever she picks |
   | `NEXT_PUBLIC_SITE_URL` | `https://stickersnstuff.co` |
   | `STRIPE_SECRET_KEY` | leave blank for now |

3. **Blob storage** — in the Vercel project, Storage → Create → Blob.
   It writes `BLOB_READ_WRITE_TOKEN` for you. This is what makes photo upload work.

4. **Domain** — point `stickersnstuff.co` at the project.

5. Go to `/boss`, sign in, and add the first design.

## Turning on card payments later

Set `STRIPE_SECRET_KEY` and redeploy. The "Pay with card" option appears on its own.
Until then the store runs pickup-only, which is the right default.

Note: Stripe requires the account holder to be 18+, so that account is yours, not hers.
Same for the Instagram/TikTok ad account.

## How it's wired

- `app/` — storefront (`/`, `/p/[slug]`, `/bag`) and admin (`/boss/*`)
- `lib/db.ts` — Neon client and shared types. Plain SQL, no ORM, no migration tool.
- Every color, font, and corner radius lives in the `theme` table and renders as CSS
  variables in `app/layout.tsx`. Changing the look is a database update, not a deploy.
- Prices are re-read from the database in `app/api/order/route.ts`. Nothing the browser
  sends about price or availability is trusted.

## Data collected

Pickup orders store a first name and a free-text note only — no email, no address.
Shipping details are collected by Stripe on paid orders, never by this app.

## Adding print-on-demand

Don't wire an API yet. When an order hits "Sent to printer," submit it manually in
Printify. At 5–10 orders a week that's three minutes and zero failure modes.
