// Plain constants only — safe to import from client components (no DB, no server env).

export const SHIRT_COLORS = ['black', 'white', 'gray', 'navy'] as const;

export const SHIRT_COLOR_SWATCH: Record<string, string> = {
  black: '#1a1a1a', white: '#ffffff', gray: '#9a9a9a', navy: '#1f2a4d',
};

export const SHIRT_SIZES = ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL'] as const;

export const FIT_TYPES = [
  { key: 'masculine', label: 'Masculine' },
  { key: 'feminine', label: 'Feminine' },
] as const;

export const GARMENT_TYPES = [
  { key: 'tshirt', label: 'T-Shirt' },
  { key: 'hoodie', label: 'Hoodie' },
] as const;

export const PLACEMENTS = [
  { key: 'front', label: 'Front' },
  { key: 'back', label: 'Back' },
] as const;
