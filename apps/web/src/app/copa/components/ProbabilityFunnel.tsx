'use client';

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { KnockoutPhase } from '@/lib/wc-data';
import styles from '../copa.module.css';

type Props = { phases: KnockoutPhase[] };

const SHORT: Record<string, string> = {
  'Fase de Grupos': 'Grupos',
  'Round of 32': 'R32',
  'Oitavas de final': 'Oitavas',
  'Quartas de final': 'Quartas',
  Semifinal: 'Semi',
  Final: 'Final',
};

export default function ProbabilityFunnel({ phases }: Props) {
  const data = phases.map((p) => ({
    name: SHORT[p.phase_label] ?? p.phase_label,
    prob: Math.round(p.reach_prob * 1000) / 10,
  }));

  return (
    <div className={`${styles.card} ${styles.chartCard}`}>
      <h3>Probabilidade de chegar a cada fase</h3>
      <p>Chance acumulada (%) de o Brasil alcançar cada etapa do torneio.</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 24, right: 8, left: -16, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#93a0b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#93a0b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: '#131c30',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#e8edf6',
            }}
            formatter={(v: number) => [`${v}%`, 'Chance de chegar']}
          />
          <Bar dataKey="prob" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={i === data.length - 1 ? '#ffdf00' : '#009739'} />
            ))}
            <LabelList
              dataKey="prob"
              position="top"
              formatter={(v: number) => `${v}%`}
              fill="#e8edf6"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
