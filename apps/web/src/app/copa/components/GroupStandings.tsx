'use client';

import { motion } from 'framer-motion';
import type { GroupMatch, GroupStanding } from '@/lib/wc-data';
import styles from '../copa.module.css';

type Props = { standings: GroupStanding[]; matches: GroupMatch[] };

export default function GroupStandings({ standings, matches }: Props) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Seleção</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>GP</th>
              <th>GC</th>
              <th>SG</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s) => (
              <tr
                key={s.team}
                className={`${styles.row} ${s.is_brazil ? styles.rowBrazil : ''}`}
              >
                <td>
                  {s.position <= 2 ? <span className={styles.qual}>{s.position}</span> : s.position}
                </td>
                <td>
                  <span className={styles.teamCell}>
                    <span>{s.flag_emoji}</span>
                    {s.team}
                  </span>
                </td>
                <td>{s.played}</td>
                <td>{s.won}</td>
                <td>{s.drawn}</td>
                <td>{s.lost}</td>
                <td>{s.goals_for}</td>
                <td>{s.goals_against}</td>
                <td>{s.goals_for - s.goals_against > 0 ? '+' : ''}{s.goals_for - s.goals_against}</td>
                <td>{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.results}>
        {matches.map((m, i) => (
          <div key={i} className={styles.result}>
            <span>{m.home}</span>
            <span className={styles.sc}>
              {m.home_score} – {m.away_score}
            </span>
            <span>{m.away}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
