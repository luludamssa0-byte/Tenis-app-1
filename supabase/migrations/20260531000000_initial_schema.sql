-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Players
create table public.players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  level text check (level in ('iniciante','intermediário','avançado','profissional')),
  club text,
  created_at timestamptz default now()
);

alter table public.players enable row level security;

create policy "Users can manage their own player profile"
  on public.players
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Matches
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.players not null,
  opponent_name text not null,
  date date not null,
  score text not null,
  result text check (result in ('vitória','derrota','WO')) not null,
  location text,
  notes text,
  created_at timestamptz default now()
);

alter table public.matches enable row level security;

create policy "Users can manage their own matches"
  on public.matches
  for all
  using (
    player_id in (select id from public.players where user_id = auth.uid())
  )
  with check (
    player_id in (select id from public.players where user_id = auth.uid())
  );

-- Trainings
create table public.trainings (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.players not null,
  date date not null,
  duration_minutes int not null check (duration_minutes > 0),
  type text check (type in ('técnico','tático','físico','jogo')) not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.trainings enable row level security;

create policy "Users can manage their own trainings"
  on public.trainings
  for all
  using (
    player_id in (select id from public.players where user_id = auth.uid())
  )
  with check (
    player_id in (select id from public.players where user_id = auth.uid())
  );
