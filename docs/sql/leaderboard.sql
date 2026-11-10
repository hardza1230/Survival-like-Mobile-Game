-- v8.1.55 ทำเนียบ (Leaderboard) · รันใน Supabase โปรเจกต์ mochi-mayhem (SQL editor หรือ migration)
-- ผู้เล่นทุกคนอ่านได้ · เขียน/แก้ได้เฉพาะแถวของตัวเอง (auth.uid() = user_id)
create table if not exists public.leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 3 and 14),
  hero text,
  s_sugar bigint not null default 0,
  s_levels int not null default 0,
  s_rank int not null default 0,
  s_stars int not null default 0,
  s_kills bigint not null default 0,
  s_bestiary int not null default 0,
  s_chests int not null default 0,
  s_style int not null default 0,
  updated_at timestamptz not null default now()
);
-- v8.1.67 กันค่ามั่วเบื้องต้น (ยังไม่ใช่การกันโกงจริง — ต้องตรวจฝั่งเซิร์ฟเวอร์ก่อนเปิดเกม)
alter table public.leaderboard drop constraint if exists leaderboard_sane;
alter table public.leaderboard add constraint leaderboard_sane check (s_sugar between 0 and 999999999 and s_levels between 0 and 6000 and s_rank between 0 and 9999 and s_stars between 0 and 45 and s_kills between 0 and 99999999 and s_bestiary between 0 and 500 and s_chests between 0 and 9999999 and s_style between 0 and 500 and name ~ '^[A-Za-z0-9_ .#-]{3,14}$');
alter table public.leaderboard enable row level security;
drop policy if exists "leaderboard read" on public.leaderboard;
create policy "leaderboard read" on public.leaderboard for select to anon, authenticated using (true);
drop policy if exists "leaderboard insert own" on public.leaderboard;
create policy "leaderboard insert own" on public.leaderboard for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "leaderboard update own" on public.leaderboard;
create policy "leaderboard update own" on public.leaderboard for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists leaderboard_sugar on public.leaderboard (s_sugar desc);
create index if not exists leaderboard_levels on public.leaderboard (s_levels desc);
create index if not exists leaderboard_rank on public.leaderboard (s_rank desc);
create index if not exists leaderboard_stars on public.leaderboard (s_stars desc);
create index if not exists leaderboard_kills on public.leaderboard (s_kills desc);
create index if not exists leaderboard_bestiary on public.leaderboard (s_bestiary desc);
create index if not exists leaderboard_chests on public.leaderboard (s_chests desc);
create index if not exists leaderboard_style on public.leaderboard (s_style desc);
