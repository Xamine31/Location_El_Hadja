-- Location El hadja — schéma Supabase pour GitHub Pages + PWA
create extension if not exists pgcrypto;

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  registration text not null,
  brand text not null,
  model text not null,
  year integer check (year is null or year between 1950 and 2100),
  mileage integer not null default 0 check (mileage >= 0),
  purchase_price numeric(12,2) not null default 0 check (purchase_price >= 0),
  purchase_date date,
  status text not null default 'available' check (status in ('available','rented','maintenance','inactive')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, registration)
);

create table if not exists public.maintenance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  due_mileage integer check (due_mileage is null or due_mileage >= 0),
  completed_at timestamptz,
  cost numeric(12,2) not null default 0 check (cost >= 0),
  notify_days_before integer not null default 7 check (notify_days_before between 0 and 365),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (due_date is not null or due_mileage is not null)
);

create table if not exists public.revenues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  date date not null default current_date,
  category text not null default 'Location',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  date date not null default current_date,
  category text not null default 'Autre',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  maintenance_id uuid not null references public.maintenance(id) on delete cascade,
  subscription_id uuid not null references public.push_subscriptions(id) on delete cascade,
  notification_key text not null,
  sent_at timestamptz not null default now(),
  unique(maintenance_id, subscription_id, notification_key)
);

-- Empêche d'associer une ligne à un véhicule appartenant à un autre compte.
create or replace function public.owns_vehicle(v_id uuid, u_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.vehicles v where v.id=v_id and v.user_id=u_id); $$;
revoke all on function public.owns_vehicle(uuid,uuid) from public;
grant execute on function public.owns_vehicle(uuid,uuid) to authenticated;

alter table public.vehicles enable row level security;
alter table public.maintenance enable row level security;
alter table public.revenues enable row level security;
alter table public.expenses enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.notification_log enable row level security;

-- Relançable sans erreur.
drop policy if exists vehicles_select_own on public.vehicles;
drop policy if exists vehicles_insert_own on public.vehicles;
drop policy if exists vehicles_update_own on public.vehicles;
drop policy if exists vehicles_delete_own on public.vehicles;
create policy vehicles_select_own on public.vehicles for select to authenticated using (auth.uid() = user_id);
create policy vehicles_insert_own on public.vehicles for insert to authenticated with check (auth.uid() = user_id);
create policy vehicles_update_own on public.vehicles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy vehicles_delete_own on public.vehicles for delete to authenticated using (auth.uid() = user_id);

drop policy if exists maintenance_select_own on public.maintenance;
drop policy if exists maintenance_insert_own on public.maintenance;
drop policy if exists maintenance_update_own on public.maintenance;
drop policy if exists maintenance_delete_own on public.maintenance;
create policy maintenance_select_own on public.maintenance for select to authenticated using (auth.uid() = user_id);
create policy maintenance_insert_own on public.maintenance for insert to authenticated with check (auth.uid() = user_id and public.owns_vehicle(vehicle_id, auth.uid()));
create policy maintenance_update_own on public.maintenance for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_vehicle(vehicle_id, auth.uid()));
create policy maintenance_delete_own on public.maintenance for delete to authenticated using (auth.uid() = user_id);

drop policy if exists revenues_select_own on public.revenues;
drop policy if exists revenues_insert_own on public.revenues;
drop policy if exists revenues_update_own on public.revenues;
drop policy if exists revenues_delete_own on public.revenues;
create policy revenues_select_own on public.revenues for select to authenticated using (auth.uid() = user_id);
create policy revenues_insert_own on public.revenues for insert to authenticated with check (auth.uid() = user_id and public.owns_vehicle(vehicle_id, auth.uid()));
create policy revenues_update_own on public.revenues for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_vehicle(vehicle_id, auth.uid()));
create policy revenues_delete_own on public.revenues for delete to authenticated using (auth.uid() = user_id);

drop policy if exists expenses_select_own on public.expenses;
drop policy if exists expenses_insert_own on public.expenses;
drop policy if exists expenses_update_own on public.expenses;
drop policy if exists expenses_delete_own on public.expenses;
create policy expenses_select_own on public.expenses for select to authenticated using (auth.uid() = user_id);
create policy expenses_insert_own on public.expenses for insert to authenticated with check (auth.uid() = user_id and public.owns_vehicle(vehicle_id, auth.uid()));
create policy expenses_update_own on public.expenses for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id and public.owns_vehicle(vehicle_id, auth.uid()));
create policy expenses_delete_own on public.expenses for delete to authenticated using (auth.uid() = user_id);

drop policy if exists push_select_own on public.push_subscriptions;
drop policy if exists push_insert_own on public.push_subscriptions;
drop policy if exists push_update_own on public.push_subscriptions;
drop policy if exists push_delete_own on public.push_subscriptions;
create policy push_select_own on public.push_subscriptions for select to authenticated using (auth.uid() = user_id);
create policy push_insert_own on public.push_subscriptions for insert to authenticated with check (auth.uid() = user_id);
create policy push_update_own on public.push_subscriptions for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy push_delete_own on public.push_subscriptions for delete to authenticated using (auth.uid() = user_id);

-- Le navigateur peut seulement lire ses journaux. Les insertions sont faites par l'Edge Function avec service_role.
drop policy if exists log_select_own on public.notification_log;
create policy log_select_own on public.notification_log for select to authenticated using (auth.uid() = user_id);

create index if not exists vehicles_user_idx on public.vehicles(user_id);
create index if not exists maintenance_user_vehicle_idx on public.maintenance(user_id, vehicle_id);
create index if not exists maintenance_due_date_idx on public.maintenance(due_date) where completed_at is null;
create index if not exists revenues_vehicle_date_idx on public.revenues(vehicle_id, date);
create index if not exists expenses_vehicle_date_idx on public.expenses(vehicle_id, date);
create index if not exists subscriptions_user_idx on public.push_subscriptions(user_id);

create or replace view public.vehicle_profitability with (security_invoker=true) as
select v.id as vehicle_id, v.user_id, v.registration, v.brand, v.model,
       coalesce((select sum(r.amount) from public.revenues r where r.vehicle_id=v.id),0) as revenue,
       coalesce((select sum(e.amount) from public.expenses e where e.vehicle_id=v.id),0) +
       coalesce((select sum(m.cost) from public.maintenance m where m.vehicle_id=v.id and m.completed_at is not null),0) as expenses
from public.vehicles v;
