'use client';

import { motion } from 'framer-motion';
import type { KnockoutPhase } from '@/lib/wc-data';
import styles from '../copa.module.css';

type Props = { phases: KnockoutPhase[] };

export default function KnockoutTimeline({ phases }: Props) {
  return (
    <div className={styles.timeline}>
      {phases.map((p, i) => {
        const isFinal = p.phase_label === 'Final';
        return (
          <motion.div
            key={p.phase_order}
            className={`${styles.phase} ${isFinal ? styles.phaseFinal : ''}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
          >
            <span className={styles.phaseFlag}>{p.opponent_flag}</span>
            <div>
              <div className={styles.phaseLabel}>{p.phase_label}</div>
              <div className={styles.phaseOpp}>{p.opponent_label}</div>
              <div className={styles.phaseMeta}>
                {p.date_label} · {p.venue}
              </div>
              <p className={styles.phaseNarr}>{p.narrative}</p>
            </div>
            <div className={styles.phaseRight}>
              <span className={styles.phaseScore}>{p.predicted_score}</span>
              <span className={styles.prob}>
                <span className={styles.probValue}>{Math.round(p.win_prob * 100)}%</span>
                <span className={styles.probLabel}>chance no jogo</span>
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
