-- Seed: World Cup 2026 simulation — Brazil's path.
-- Data anchored to real group-stage results and market odds (25/06/2026),
-- with knockout opponents/probabilities estimated from press projections.

truncate table public.wc_title_odds restart identity;
truncate table public.wc_group_standings restart identity;
truncate table public.wc_group_matches restart identity;
truncate table public.wc_knockout_path restart identity;

insert into public.wc_title_odds (team, code, flag_emoji, american_odds, decimal_odds, implied_prob, is_brazil, rank) values
  ('França',     'FRA', '🇫🇷', 360,  4.60, 0.2174, false, 1),
  ('Espanha',    'ESP', '🇪🇸', 550,  6.50, 0.1538, false, 2),
  ('Inglaterra', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 600,  7.00, 0.1429, false, 3),
  ('Argentina',  'ARG', '🇦🇷', 650,  7.50, 0.1333, false, 4),
  ('Brasil',     'BRA', '🇧🇷', 1300, 14.00, 0.0714, true,  5);

insert into public.wc_group_standings (position, team, flag_emoji, played, won, drawn, lost, goals_for, goals_against, points, is_brazil) values
  (1, 'Brasil',   '🇧🇷', 3, 2, 1, 0, 7, 1, 7, true),
  (2, 'Marrocos', '🇲🇦', 3, 2, 1, 0, 6, 3, 7, false),
  (3, 'Escócia',  '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 3, 1, 0, 2, 1, 4, 3, false),
  (4, 'Haiti',    '🇭🇹', 3, 0, 0, 3, 2, 8, 0, false);

insert into public.wc_group_matches (matchday, home, away, home_score, away_score) values
  (1, 'Brasil',   'Marrocos', 1, 1),
  (1, 'Escócia',  'Haiti',    1, 0),
  (2, 'Brasil',   'Haiti',    3, 0),
  (2, 'Marrocos', 'Escócia',  1, 0),
  (3, 'Escócia',  'Brasil',   0, 3),
  (3, 'Marrocos', 'Haiti',    4, 2);

insert into public.wc_knockout_path (phase_order, phase_label, opponent_label, opponent_flag, date_label, venue, win_prob, reach_prob, predicted_score, narrative) values
  (1, 'Fase de Grupos', 'Grupo C — 1º lugar', '🇧🇷', '13–24/06', 'EUA · Nova York, Filadélfia, Miami', 1.0000, 1.0000, '7 pts',
     'Brasil avançou em primeiro com 2 vitórias e 1 empate, sofrendo apenas 1 gol. Defesa sólida sob Ancelotti e ataque eficiente (Vinícius Jr., Raphinha, Neymar).'),
  (2, 'Round of 32', 'Japão', '🇯🇵', '29/06', 'NRG Stadium · Houston', 0.7800, 1.0000, '2-1',
     'Japão é organizado e troca passes com qualidade, mas não tem o poder de fogo individual do Brasil. Cenário provável: o Brasil controla e a qualidade individual decide.'),
  (3, 'Oitavas de final', 'Senegal / Costa do Marfim / Equador', '🌍', '04–07/07', 'A definir', 0.6500, 0.7800, '2-0',
     'Adversário físico e intenso, perigoso em bola parada, mas com menos repertório ofensivo. O Brasil tende a controlar com posse e profundidade pelos lados.'),
  (4, 'Quartas de final', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '09–11/07', 'A definir', 0.4700, 0.5100, '1-1 (pênaltis)',
     'Jogo de margem fina contra um bloco inglês compacto. Paciência para furar a defesa, decisão em lance individual ou bola parada — possivelmente nos pênaltis.'),
  (5, 'Semifinal', 'França / Espanha / Argentina', '⭐', '14–15/07', 'A definir', 0.4500, 0.2400, '2-2 (pênaltis)',
     'Duelo de gigantes contra uma das favoritas do torneio. Equilíbrio total, decidido por um detalhe — ataque brasileiro contra solidez europeia/sul-americana.'),
  (6, 'Final', 'Sobrevivente Fra / Esp / Arg', '🏆', '19/07', 'MetLife Stadium · Nova Jersey', 0.5200, 0.1100, 'decidido nos detalhes',
     'A decisão. Nível de igualdade altíssimo entre as seleções de ponta — final provavelmente resolvida em detalhes táticos de Ancelotti ou nos pênaltis.');
