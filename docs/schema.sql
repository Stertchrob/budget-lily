create extension if not exists "pgcrypto";

create table if not exists public.statement_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  file_name text not null,
  name text,
  storage_path text not null unique,
  mime_type text,
  created_at timestamptz not null default now()
);

-- Add name column if table already exists: ALTER TABLE statement_uploads ADD COLUMN IF NOT EXISTS name text;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  statement_upload_id uuid references public.statement_uploads(id) on delete set null,
  transaction_date date not null,
  amount numeric(12,2) not null,
  merchant text,
  description text not null,
  category_name text not null default 'Other',
  category_edited boolean not null default false,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

-- Add category_edited if table exists: ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_edited boolean DEFAULT false;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create index if not exists idx_transactions_user_date on public.transactions(user_id, transaction_date);
create index if not exists idx_transactions_user_category on public.transactions(user_id, category_name);

alter table public.statement_uploads enable row level security;
alter table public.transactions enable row level security;
alter table public.categories enable row level security;

create policy "user owns statement uploads"
on public.statement_uploads for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns transactions"
on public.transactions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "user owns categories"
on public.categories for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
