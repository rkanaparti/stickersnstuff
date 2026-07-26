'use client';

export type BagItem = {
  product_id: number; name: string; price_cents: number;
  size?: string; color?: string; qty: number; image?: string;
};

const KEY = 'sns_bag';

export function readBag(): BagItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function writeBag(items: BagItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('bagchange'));
}

export function addToBag(item: BagItem) {
  const bag = readBag();
  const match = bag.find(
    (b) => b.product_id === item.product_id && b.size === item.size && b.color === item.color
  );
  if (match) match.qty += item.qty;
  else bag.push(item);
  writeBag(bag);
}

export const bagTotal = (b: BagItem[]) =>
  b.reduce((n, i) => n + i.price_cents * i.qty, 0);

export const bagCount = (b: BagItem[]) =>
  b.reduce((n, i) => n + i.qty, 0);
