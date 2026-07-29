-- Orders for the manual (pre payment gateway) checkout flow.
--
-- Every column the app writes is set server side. The browser never talks to
-- this table directly, so RLS is enabled with no policies: the anon and
-- authenticated roles get nothing, and the server uses the service_role key,
-- which bypasses RLS. If a public key ever leaks, it still cannot read
-- customer names or WhatsApp numbers out of here.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_slug text unique not null,
  template_slug text not null,
  status text not null default 'pending',
  customer_name text,
  customer_whatsapp text,
  price_idr integer,
  payload jsonb,
  asset_base text,
  paid_at timestamptz,
  admin_note text
);

create index if not exists orders_order_slug_idx on orders (order_slug);
create index if not exists orders_status_idx on orders (status);

-- Only these two states exist today. A payment gateway would add its own
-- (expired, failed), so this is a check rather than an enum to keep migrations
-- cheap later.
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending', 'paid'));

alter table orders enable row level security;

-- Explicit, so this migration does not depend on the project's "automatically
-- expose new tables" dashboard setting being on or off. service_role is the
-- only role the app authenticates as, and it bypasses RLS.
grant all privileges on table orders to service_role;

-- Belt and braces: make sure the public roles hold nothing here even if the
-- project was created with automatic exposure switched on.
revoke all privileges on table orders from anon, authenticated;
