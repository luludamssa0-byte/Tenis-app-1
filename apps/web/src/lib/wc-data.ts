import { createServerSupabase, isSupabaseConfigured } from './supabase-server';

export type TitleOdds = {
  team: string;
  code: string;
  flag_emoji: string;
  american_odds: number;
  decimal_odds: number;
  implied_prob: number;
  is_brazil: boolean;
  rank: number;
};

export type GroupStanding = {
  position: number;
  team: string;
  flag_emoji: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  is_brazil: boolean;
};

export type GroupMatch = {
  matchday: number;
  home: string;
  away: string;
  home_score: number;
  away_score: number;
};

export type KnockoutPhase = {
  phase_order: number;
  phase_label: string;
  opponent_label: string;
  opponent_flag: string;
  date_label: string;
  venue: string;
  win_prob: number;
  reach_prob: number;
  predicted_score: string;
  narrative: string;
};

export type WorldCupData = {
  titleOdds: TitleOdds[];
  standings: GroupStanding[];
  groupMatches: GroupMatch[];
  knockoutPath: KnockoutPhase[];
  source: 'supabase' | 'fallback';
};

/**
 * Convert American moneyline odds to implied probability (0..1).
 * Positive odds: 100 / (odds + 100). Negative odds: -odds / (-odds + 100).
 */
export function americanToImplied(americanOdds: number): number {
  if (americanOdds === 0) return 0;
  return americanOdds > 0
    ? 100 / (americanOdds + 100)
    : -americanOdds / (-americanOdds + 100);
}

const FALLBACK_TITLE_ODDS: TitleOdds[] = [
  { team: 'França', code: 'FRA', flag_emoji: '🇫🇷', american_odds: 360, decimal_odds: 4.6, implied_prob: 0.2174, is_brazil: false, rank: 1 },
  { team: 'Espanha', code: 'ESP', flag_emoji: '🇪🇸', american_odds: 550, decimal_odds: 6.5, implied_prob: 0.1538, is_brazil: false, rank: 2 },
  { team: 'Inglaterra', code: 'ENG', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', american_odds: 600, decimal_odds: 7.0, implied_prob: 0.1429, is_brazil: false, rank: 3 },
  { team: 'Argentina', code: 'ARG', flag_emoji: '🇦🇷', american_odds: 650, decimal_odds: 7.5, implied_prob: 0.1333, is_brazil: false, rank: 4 },
  { team: 'Brasil', code: 'BRA', flag_emoji: '🇧🇷', american_odds: 1300, decimal_odds: 14.0, implied_prob: 0.0714, is_brazil: true, rank: 5 },
];

const FALLBACK_STANDINGS: GroupStanding[] = [
  { position: 1, team: 'Brasil', flag_emoji: '🇧🇷', played: 3, won: 2, drawn: 1, lost: 0, goals_for: 7, goals_against: 1, points: 7, is_brazil: true },
  { position: 2, team: 'Marrocos', flag_emoji: '🇲🇦', played: 3, won: 2, drawn: 1, lost: 0, goals_for: 6, goals_against: 3, points: 7, is_brazil: false },
  { position: 3, team: 'Escócia', flag_emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', played: 3, won: 1, drawn: 0, lost: 2, goals_for: 1, goals_against: 4, points: 3, is_brazil: false },
  { position: 4, team: 'Haiti', flag_emoji: '🇭🇹', played: 3, won: 0, drawn: 0, lost: 3, goals_for: 2, goals_against: 8, points: 0, is_brazil: false },
];

const FALLBACK_GROUP_MATCHES: GroupMatch[] = [
  { matchday: 1, home: 'Brasil', away: 'Marrocos', home_score: 1, away_score: 1 },
  { matchday: 1, home: 'Escócia', away: 'Haiti', home_score: 1, away_score: 0 },
  { matchday: 2, home: 'Brasil', away: 'Haiti', home_score: 3, away_score: 0 },
  { matchday: 2, home: 'Marrocos', away: 'Escócia', home_score: 1, away_score: 0 },
  { matchday: 3, home: 'Escócia', away: 'Brasil', home_score: 0, away_score: 3 },
  { matchday: 3, home: 'Marrocos', away: 'Haiti', home_score: 4, away_score: 2 },
];

const FALLBACK_KNOCKOUT: KnockoutPhase[] = [
  { phase_order: 1, phase_label: 'Fase de Grupos', opponent_label: 'Grupo C — 1º lugar', opponent_flag: '🇧🇷', date_label: '13–24/06', venue: 'EUA · Nova York, Filadélfia, Miami', win_prob: 1.0, reach_prob: 1.0, predicted_score: '7 pts', narrative: 'Brasil avançou em primeiro com 2 vitórias e 1 empate, sofrendo apenas 1 gol. Defesa sólida sob Ancelotti e ataque eficiente (Vinícius Jr., Raphinha, Neymar).' },
  { phase_order: 2, phase_label: 'Round of 32', opponent_label: 'Japão', opponent_flag: '🇯🇵', date_label: '29/06', venue: 'NRG Stadium · Houston', win_prob: 0.78, reach_prob: 1.0, predicted_score: '2-1', narrative: 'Japão é organizado e troca passes com qualidade, mas não tem o poder de fogo individual do Brasil. Cenário provável: o Brasil controla e a qualidade individual decide.' },
  { phase_order: 3, phase_label: 'Oitavas de final', opponent_label: 'Senegal / Costa do Marfim / Equador', opponent_flag: '🌍', date_label: '04–07/07', venue: 'A definir', win_prob: 0.65, reach_prob: 0.78, predicted_score: '2-0', narrative: 'Adversário físico e intenso, perigoso em bola parada, mas com menos repertório ofensivo. O Brasil tende a controlar com posse e profundidade pelos lados.' },
  { phase_order: 4, phase_label: 'Quartas de final', opponent_label: 'Inglaterra', opponent_flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', date_label: '09–11/07', venue: 'A definir', win_prob: 0.47, reach_prob: 0.51, predicted_score: '1-1 (pênaltis)', narrative: 'Jogo de margem fina contra um bloco inglês compacto. Paciência para furar a defesa, decisão em lance individual ou bola parada — possivelmente nos pênaltis.' },
  { phase_order: 5, phase_label: 'Semifinal', opponent_label: 'França / Espanha / Argentina', opponent_flag: '⭐', date_label: '14–15/07', venue: 'A definir', win_prob: 0.45, reach_prob: 0.24, predicted_score: '2-2 (pênaltis)', narrative: 'Duelo de gigantes contra uma das favoritas do torneio. Equilíbrio total, decidido por um detalhe — ataque brasileiro contra solidez europeia/sul-americana.' },
  { phase_order: 6, phase_label: 'Final', opponent_label: 'Sobrevivente Fra / Esp / Arg', opponent_flag: '🏆', date_label: '19/07', venue: 'MetLife Stadium · Nova Jersey', win_prob: 0.52, reach_prob: 0.11, predicted_score: 'decidido nos detalhes', narrative: 'A decisão. Nível de igualdade altíssimo entre as seleções de ponta — final provavelmente resolvida em detalhes táticos de Ancelotti ou nos pênaltis.' },
];

export function getFallbackData(): WorldCupData {
  return {
    titleOdds: FALLBACK_TITLE_ODDS,
    standings: FALLBACK_STANDINGS,
    groupMatches: FALLBACK_GROUP_MATCHES,
    knockoutPath: FALLBACK_KNOCKOUT,
    source: 'fallback',
  };
}

/**
 * Fetch the World Cup simulation data from Supabase when configured.
 * Falls back to the embedded seed data (so the page renders without a live DB).
 */
export async function getWorldCupData(): Promise<WorldCupData> {
  if (!isSupabaseConfigured()) return getFallbackData();

  try {
    const supabase = createServerSupabase();
    const [odds, standings, matches, knockout] = await Promise.all([
      supabase.from('wc_title_odds').select('*').order('rank'),
      supabase.from('wc_group_standings').select('*').order('position'),
      supabase.from('wc_group_matches').select('*').order('matchday'),
      supabase.from('wc_knockout_path').select('*').order('phase_order'),
    ]);

    if (odds.error || standings.error || matches.error || knockout.error) {
      return getFallbackData();
    }
    if (!odds.data?.length || !knockout.data?.length) {
      return getFallbackData();
    }

    return {
      titleOdds: odds.data as TitleOdds[],
      standings: standings.data as GroupStanding[],
      groupMatches: matches.data as GroupMatch[],
      knockoutPath: knockout.data as KnockoutPhase[],
      source: 'supabase',
    };
  } catch {
    return getFallbackData();
  }
}
