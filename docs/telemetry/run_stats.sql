-- v7.8.44 Share Play Stats (phase 1) · run in Supabase → SQL Editor → project mochi-mayhem
create table if not exists public.run_stats (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  install_id text not null check (char_length(install_id) <= 64),
  v text check (char_length(v) <= 16),
  hero text check (char_length(hero) <= 24),
  path text check (char_length(path) <= 24),
  mode text check (char_length(mode) <= 16),
  stage text check (char_length(stage) <= 16),
  diff int,
  result text check (char_length(result) <= 8),
  sec int,
  data jsonb,
  constraint run_stats_data_size check (octet_length(data::text) <= 40000)
);
create index if not exists run_stats_created_idx on public.run_stats (created_at desc);
create index if not exists run_stats_hero_idx on public.run_stats (v, hero, path, stage);
alter table public.run_stats enable row level security;
drop policy if exists run_stats_insert_only on public.run_stats;
create policy run_stats_insert_only on public.run_stats for insert to anon, authenticated with check (true);
revoke select, update, delete on public.run_stats from anon, authenticated;
grant insert on public.run_stats to anon, authenticated;
