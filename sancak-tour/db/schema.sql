-- Sancak Tour: PostgreSQL / Supabase schema (target for production).
-- The app ships with a JSON-file store (lib/store.ts) for demos and single-server hosting.
-- To go multi-instance/serverless, implement the same functions from lib/store.ts against these tables.
create extension if not exists pgcrypto;

create type booking_status  as enum ('pending','confirmed','paid','cancelled','completed');
create type payment_status  as enum ('unpaid','awaiting','paid','refunded');
create type payment_method  as enum ('card','paypal','bank','arrival');
create type request_type    as enum ('transfer','vip','accommodation','contact');
create type request_status  as enum ('new','in_progress','quoted','done','closed');
create type staff_role      as enum ('owner','manager','editor','support');

-- Translated text is stored as {"en":"...","tr":"...","ar":"...","de":"..."} (jsonb)
create table tours (
  id text primary key, slug text unique not null, published boolean not null default false, featured boolean not null default false, sample boolean not null default false,
  title jsonb not null, summary jsonb not null, description jsonb not null,
  destination text not null, categories text[] not null, scene text, image_url text, gallery text[],
  days int not null default 1, hours numeric not null default 0,
  price_group numeric(10,2) not null default 0, price_private numeric(10,2) not null default 0, private_max_pax int not null default 4,
  child_discount_pct numeric(5,2) not null default 50, max_group int not null default 12, min_age int not null default 0,
  highlights jsonb, itinerary jsonb, included text[], excluded text[], pickup jsonb, meeting jsonb, lat double precision, lng double precision,
  accessibility jsonb, ages jsonb, cancellation_key text not null default 'standard', weekdays int[] not null default '{}', blackout date[] not null default '{}',
  reviews jsonb not null default '[]', related_ids text[] not null default '{}', created_at timestamptz not null default now()
);
create table extras (id text primary key, label jsonb not null, price numeric(10,2) not null, per_person boolean not null default false, active boolean not null default true);
create table promotions (id text primary key, code text unique not null, percent numeric(5,2) not null, title jsonb, valid_until date, active boolean not null default true);
create table accommodations (id text primary key, slug text unique not null, published boolean default false, sample boolean default false, name jsonb not null, description jsonb, type text, location text, guests int, price_per_night numeric(10,2), amenities text[], scene text, image_url text);
create table vehicles (id text primary key, name jsonb not null, note jsonb, category text, passengers int, suitcases int, price_from numeric(10,2) default 0, scene text, image_url text, active boolean default true);
create table posts (id text primary key, slug text unique not null, published boolean default false, category text, scene text, image_url text, date date, read_min int, title jsonb, excerpt jsonb, body jsonb, tour_ids text[]);

create table bookings (
  id text primary key, ref text unique not null, created_at timestamptz not null default now(), status booking_status not null default 'pending',
  lang text not null, tour_id text references tours(id) on delete set null, tour_title text not null, travel_date date not null,
  adults int not null check (adults >= 1), children int not null default 0, mode text not null check (mode in ('group','private')),
  extras jsonb not null default '[]', promo_code text, discount numeric(10,2) not null default 0, total numeric(10,2) not null, currency char(3) not null default 'EUR',
  payment_method payment_method not null, payment_status payment_status not null default 'unpaid', payment_ref text,
  customer_name text not null, customer_email text not null, customer_phone text not null, customer_country text, customer_notes text,
  internal_notes text, sample boolean default false
);
create index on bookings (status, created_at desc);
create index on bookings (lower(customer_email));
-- NOTE: no card data is ever stored. payment_ref holds only the provider's session id.

create table requests (
  id text primary key, ref text unique not null, type request_type not null, created_at timestamptz not null default now(), status request_status not null default 'new',
  lang text not null, name text not null, email text not null, phone text not null, data jsonb not null default '{}', internal_notes text
);
create table staff_users (id text primary key, email text unique not null, name text not null, role staff_role not null, password_hash text not null, active boolean not null default true, created_at timestamptz not null default now());
create table site_settings (id int primary key default 1 check (id = 1), data jsonb not null);          -- WhatsApp number, social links, payments config, SEO, homepage sections
create table translation_overrides (lang text not null, path text not null, value text not null, primary key (lang, path));

-- Row Level Security: the browser never talks to the database directly; all access goes through the server with the service role.
alter table bookings enable row level security; alter table requests enable row level security; alter table staff_users enable row level security;
alter table site_settings enable row level security; alter table translation_overrides enable row level security;
