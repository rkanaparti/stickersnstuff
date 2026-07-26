-- stickersnstuff.co  ·  run this once in the Neon SQL editor

create table if not exists theme (
  id            int primary key default 1,
  store_name    text not null default 'stickers n stuff',
  tagline       text not null default 'be whoever you want',
  logo_url      text,
  -- colors (any valid CSS color)
  c_paper       text not null default '#FBF7FF',
  c_ink         text not null default '#2C2438',
  c_primary     text not null default '#7C5CBF',
  c_accent      text not null default '#93B08A',
  c_highlight   text not null default '#EDE3FB',
  -- fonts (Google Font family names)
  f_display     text not null default 'Bricolage Grotesque',
  f_body        text not null default 'DM Sans',
  -- knobs
  radius_px     int  not null default 18,
  tilt_on       boolean not null default true,
  constraint theme_single check (id = 1)
);
insert into theme (id) values (1) on conflict do nothing;

create table if not exists products (
  id          serial primary key,
  slug        text unique not null,
  name        text not null,
  blurb       text,
  kind        text not null default 'sticker',   -- sticker | shirt | hat | other
  price_cents int not null,
  images      text[] not null default '{}',
  colors      text[] not null default '{}',      -- e.g. {'white','black','sage'}
  sizes       text[] not null default '{}',      -- e.g. {'YM','YL','S','M','L'}
  stock       int,                               -- null = unlimited
  active      boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists orders (
  id           serial primary key,
  code         text unique not null,             -- short human code, e.g. SNS-4T9K
  buyer_name   text not null,
  buyer_note   text,                             -- grade / homeroom / "ask for me at lunch"
  buyer_email  text,                             -- only collected on paid-online orders
  ship_address text,                             -- only collected on paid-online orders
  channel      text not null default 'pickup',   -- pickup | online
  status       text not null default 'new',      -- new | paid | ordered | ready | done
  total_cents  int not null default 0,
  stripe_id    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists order_items (
  id          serial primary key,
  order_id    int not null references orders(id) on delete cascade,
  product_id  int references products(id) on delete set null,
  name_snap   text not null,
  size        text,
  color       text,
  qty         int not null default 1,
  price_cents int not null
);

create index if not exists orders_status_idx on orders (status, created_at desc);
create index if not exists products_active_idx on products (active, sort, id);
