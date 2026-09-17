-- ============================================================
-- ResumeBuild — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- ============================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  country text,
  language text default 'en',
  pro boolean default false,
  pro_plan text,
  created_at timestamptz default now()
);

-- 2. Resumes (one row per saved resume; data is the full ResumeData JSON)
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled resume',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
create index if not exists resumes_user_idx on public.resumes(user_id);

-- 3. Cover letters
create table if not exists public.cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text,
  role text,
  body text not null,
  created_at timestamptz default now()
);

-- 4. Conversion events mirror (optional server-side log alongside GA4)
create table if not exists public.events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- Auto-create a profile row on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security — users see only their own rows
-- ============================================================
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.cover_letters enable row level security;
alter table public.events enable row level security;

drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "resumes owner all" on public.resumes;
drop policy if exists "letters owner all" on public.cover_letters;
drop policy if exists "events insert" on public.events;
drop policy if exists "events self read" on public.events;

create policy "profiles self read" on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);

create policy "resumes owner all" on public.resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "letters owner all" on public.cover_letters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "events insert" on public.events for insert with check (true);
create policy "events self read" on public.events for select using (auth.uid() = user_id);

-- ============================================================
-- Subscriptions & monetization
-- ============================================================
alter table public.profiles add column if not exists downloads_used int default 0;
alter table public.profiles add column if not exists pro_since timestamptz;

-- Plan ledger: one row per checkout. In production a Stripe webhook
-- (service-role Edge Function) writes here; the client only reads.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,                -- pro_monthly | pro_annual | pro_lifetime
  status text not null default 'active', -- active | canceled | past_due
  amount int not null default 0,         -- in cents
  currency text not null default 'usd',
  stripe_customer text,
  stripe_subscription text,
  stripe_invoice text,
  current_period_end timestamptz,
  created_at timestamptz default now()
);
create index if not exists subs_user_idx on public.subscriptions(user_id);

alter table public.subscriptions enable row level security;
drop policy if exists "subs owner all" on public.subscriptions;
create policy "subs owner all" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Recommended Auth settings (Dashboard → Authentication → Providers):
--   • Enable Email provider (confirm email: off during testing)
--   • Add your Vercel production URL to Redirect URLs
--
-- Payments (README §6): the demo checkout in /pricing flips the plan
-- client-side. For production, create Stripe Price IDs for pro_monthly
-- (USD 7/mo), pro_annual (USD 49/yr), pro_lifetime (USD 79 once), and
-- replace the pay() handler with a redirect to Stripe Checkout; a
-- webhook Edge Function then upserts public.subscriptions and profiles.
-- ============================================================
