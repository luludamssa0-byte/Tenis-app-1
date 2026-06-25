'use client';

import { motion } from 'framer-motion';
import AnimatedStat from './AnimatedStat';
import styles from '../copa.module.css';

type Props = {
  championProb: number;
  rank: number;
  totalTeams: number;
  goalsFor: number;
};

export default function Hero({ championProb, rank, totalTeams, goalsFor }: Props) {
  return (
    <section className={styles.hero}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className={styles.kicker}>🇧🇷 Copa do Mundo 2026 · Simulação</span>
        <h1 className={styles.heroTitle}>
          O caminho do <em>Brasil</em> até a final
        </h1>
        <p className={styles.heroSub}>
          Probabilidades por fase, adversários projetados e como cada jogo do mata-mata
          tende a se desenrolar — da Round of 32 ao MetLife Stadium.
        </p>
        <div className={styles.heroChips}>
          <span className={styles.chip}>
            Grupo C: <b>{rank}º lugar</b>
          </span>
          <span className={styles.chip}>
            Odds de título: <b>+1300</b>
          </span>
          <span className={styles.chip}>
            Saldo no grupo: <b>+{goalsFor - 1}</b>
          </span>
        </div>
      </motion.div>

      <motion.div
        className={styles.gauge}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
      >
        <div className={styles.gaugeCard}>
          <div>
            <div className={styles.gaugeValue}>
              <AnimatedStat value={championProb * 100} decimals={1} suffix="%" />
            </div>
            <div className={styles.gaugeLabel}>
              probabilidade do Brasil ser <strong>campeão</strong> (mercado: 5º favorito de {totalTeams})
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
