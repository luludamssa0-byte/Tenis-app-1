import Link from 'next/link';
import { getWorldCupData } from '@/lib/wc-data';
import AnimatedStat from './components/AnimatedStat';
import GroupStandings from './components/GroupStandings';
import Hero from './components/Hero';
import KnockoutTimeline from './components/KnockoutTimeline';
import ProbabilityFunnel from './components/ProbabilityFunnel';
import TitleOddsChart from './components/TitleOddsChart';
import styles from './copa.module.css';

export const metadata = {
  title: 'Brasil na Copa 2026 — Simulação de Estatísticas',
  description:
    'Probabilidades por fase, adversários projetados e narrativa de cada jogo do mata-mata do Brasil na Copa do Mundo 2026.',
};

export default async function CopaPage() {
  const data = await getWorldCupData();

  const brazil = data.standings.find((s) => s.is_brazil);
  const brazilOdds = data.titleOdds.find((o) => o.is_brazil);
  const finalPhase = data.knockoutPath.find((p) => p.phase_label === 'Final');
  const championProb = brazilOdds?.implied_prob ?? 0;
  const reachFinal = finalPhase?.reach_prob ?? 0;
  const matchesOnPath = data.knockoutPath.filter((p) => p.phase_order > 1).length;

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <span className={styles.brand}>
          🇧🇷 Brasil <b>2026</b>
        </span>
        <div className={styles.navLinks}>
          <Link href="/">Início</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/copa">Copa</Link>
        </div>
      </nav>

      <div className={styles.shell}>
        <Hero
          championProb={championProb}
          rank={brazil?.position ?? 1}
          totalTeams={48}
          goalsFor={brazil?.goals_for ?? 0}
        />

        <section className={styles.kpis}>
          <div className={styles.kpi}>
            <div className={`${styles.kpiValue} ${styles.kpiAccent}`}>
              <AnimatedStat value={championProb * 100} decimals={1} suffix="%" />
            </div>
            <div className={styles.kpiLabel}>Chance de título</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiValue}>
              <AnimatedStat value={reachFinal * 100} decimals={0} suffix="%" />
            </div>
            <div className={styles.kpiLabel}>Chance de chegar à final</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiValue}>
              <AnimatedStat value={matchesOnPath} suffix=" jogos" />
            </div>
            <div className={styles.kpiLabel}>Do mata-mata até a taça</div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiValue}>
              <AnimatedStat value={brazil?.goals_for ?? 0} />
              <span style={{ color: 'var(--night-muted)', fontSize: '1.1rem' }}>
                {' '}
                / {brazil?.goals_against ?? 0}
              </span>
            </div>
            <div className={styles.kpiLabel}>Gols pró / contra no grupo</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Probabilidades</h2>
            <p className={styles.sectionNote}>
              Estimativas baseadas nas odds de mercado e na dificuldade projetada da chave.
            </p>
          </div>
          <div className={styles.chartGrid}>
            <ProbabilityFunnel phases={data.knockoutPath} />
            <TitleOddsChart odds={data.titleOdds} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>O caminho até a final</h2>
            <p className={styles.sectionNote}>
              Adversário provável, como o jogo tende a se desenrolar e a chance de vitória em cada fase.
            </p>
          </div>
          <KnockoutTimeline phases={data.knockoutPath} />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Grupo C — como o Brasil se classificou</h2>
            <p className={styles.sectionNote}>Classificação final e resultados da fase de grupos.</p>
          </div>
          <GroupStandings standings={data.standings} matches={data.groupMatches} />
        </section>

        <p className={styles.footnote}>
          Resultados da fase de grupos e odds de título são reais (mercado em 25/06/2026). Os
          adversários e probabilidades do mata-mata são estimativas baseadas nas projeções da
          imprensa especializada — os jogos ainda vão acontecer.
          <span className={styles.sourceTag}>
            fonte dos dados: {data.source === 'supabase' ? 'Supabase' : 'seed local'}
          </span>
        </p>
      </div>
    </div>
  );
}
