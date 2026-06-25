-- World Cup 2026 simulation stats (Brazil's knockout path).
-- Presentation data only (no PII): RLS enabled with public read, no writes from clients.

-- Title odds per team
create table public.wc_title_odds (
  id uuid primary key default gen_random_uuid(),
  team text not null,
  code text not null,
  flag_emoji text not null,
  american_odds int not null,
  decimal_odds numeric(6,2) not null,
  implied_prob numeric(5,4) not null,
  is_brazil boolean not null default false,
  rank int not null
);

-- Group C final standings
create table public.wc_group_standings (
  id uuid primary key default gen_random_uuid(),
  position int not null,
  team text not null,
  flag_emoji text not null,
  played int not null,
  won int not null,
  drawn int not null,
  lost int not null,
  goals_for int not null,
  goals_against int not null,
  points int not null,
  is_brazil boolean not null default false
);

-- Group C results
create table public.wc_group_matches (
  id uuid primary key default gen_random_uuid(),
  matchday int not null,
  home text not null,
  away text not null,
  home_score int not null,
  away_score int not null
);

-- Brazil's projected knockout path (R32 -> Final)
create table public.wc_knockout_path (
  id uuid primary key default gen_random_uuid(),
  phase_order int not null,
  phase_label text not null,
  opponent_label text not null,
  opponent_flag text not null,
  date_label text not null,
  venue text not null,
  win_prob numeric(5,4) not null,
  reach_prob numeric(5,4) not null,
  predicted_score text not null,
  narrative text not null
);

alter table public.wc_title_odds enable row level security;
alter table public.wc_group_standings enable row level security;
alter table public.wc_group_matches enable row level security;
alter table public.wc_knockout_path enable row level security;

create policy "Public read title odds" on public.wc_title_odds for select using (true);
create policy "Public read standings" on public.wc_group_standings for select using (true);
create policy "Public read group matches" on public.wc_group_matches for select using (true);
create policy "Public read knockout path" on public.wc_knockout_path for select using (true);
