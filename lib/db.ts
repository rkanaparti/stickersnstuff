import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from './config';

export const sql = neon(DATABASE_URL);

export type Theme = {
  store_name: string; tagline: string; logo_url: string | null;
  c_paper: string; c_ink: string; c_primary: string; c_accent: string; c_highlight: string;
  f_display: string; f_body: string; radius_px: number; tilt_on: boolean;
};

export type Product = {
  id: number; slug: string; name: string; blurb: string | null; kind: string;
  price_cents: number; images: string[]; colors: string[]; sizes: string[];
  stock: number | null; active: boolean; sort: number; audience: string;
};

export type Order = {
  id: number; code: string; buyer_name: string; buyer_note: string | null;
  buyer_email: string | null; ship_address: string | null;
  channel: string; status: string; total_cents: number; created_at: string;
};

export type Contact = {
  heading: string; body: string;
  email: string | null; phone: string | null; address: string | null; hours: string | null;
};

export type CustomRequest = {
  id: number; name: string; email: string | null; phone: string | null; note: string | null;
  image_url: string; shirt_color: string; size: string; fit_type: string; shirt_type: string;
  placement: string; status: string; created_at: string;
};

export async function getTheme(): Promise<Theme> {
  const rows = (await sql`select * from theme where id = 1`) as Theme[];
  return rows[0];
}

export async function getContact(): Promise<Contact> {
  const rows = (await sql`select * from contact where id = 1`) as Contact[];
  return rows[0];
}

export const money = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const KINDS = [
  { key: 'sticker', label: 'Stickers' },
  { key: 'shirt',   label: 'T-shirts' },
  { key: 'hat',     label: 'Hats' },
  { key: 'other',   label: 'Other' },
];

export const AUDIENCES = [
  { key: 'everyone', label: 'Everyone' },
  { key: 'girls',    label: 'Girls' },
  { key: 'boys',     label: 'Boys' },
];

export const STATUSES = ['new', 'paid', 'ordered', 'ready', 'done'] as const;

export const STATUS_LABEL: Record<string, string> = {
  new: 'New order',
  paid: 'Got paid',
  ordered: 'Sent to printer',
  ready: 'Ready to hand over',
  done: 'Delivered',
};

export const NEXT_STATUS: Record<string, string | null> = {
  new: 'paid', paid: 'ordered', ordered: 'ready', ready: 'done', done: null,
};

export const NEXT_LABEL: Record<string, string> = {
  new: 'Mark paid', paid: 'Sent to printer', ordered: 'It arrived', ready: 'Delivered!',
};

export const CUSTOM_STATUSES = ['new', 'reviewed', 'done'] as const;

export const CUSTOM_STATUS_LABEL: Record<string, string> = {
  new: 'New request', reviewed: 'Reviewed', done: 'Done',
};

export const CUSTOM_NEXT_STATUS: Record<string, string | null> = {
  new: 'reviewed', reviewed: 'done', done: null,
};

export const CUSTOM_NEXT_LABEL: Record<string, string> = {
  new: 'Mark reviewed', reviewed: 'Mark done',
};

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
    || 'thing-' + Math.random().toString(36).slice(2, 6);
}

export function orderCode() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)];
  return `SNS-${s}`;
}
