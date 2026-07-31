// Plain constants only — safe to import from client components (no DB, no server env).

export const SHIRT_COLORS = ['black', 'white', 'gray', 'navy'] as const;

export const SHIRT_COLOR_SWATCH: Record<string, string> = {
  black: '#1a1a1a', white: '#ffffff', gray: '#9a9a9a', navy: '#1f2a4d',
};

export const SHIRT_TYPES = [
  { key: 'girly', label: 'Girly fit' },
  { key: 'hoodie', label: 'Hoodie' },
] as const;
