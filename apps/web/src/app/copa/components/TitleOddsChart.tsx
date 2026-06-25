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
import type { TitleOdds } from '@/lib/wc-data';
import styles from '../copa.module.css';

type Props = { odds: TitleOdds[] };

export default function TitleOddsChart({ odds }: Props) {
  const data = [...odds]
    .sort((a, b) => b.implied_prob - a.implied_prob)
    .map((o) => ({
      name: `${o.flag_emoji} ${o.team}`,
      prob: Math.round(o.implied_prob * 1000) / 10,
      isBrazil: o.is_brazil,
    }));

  return (
    <div className={`${styles.card} ${styles.chartCard}`}>
      <h3>Favoritas ao título</h3>
      <p>Probabilidade implícita (%) derivada das odds de mercado.</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 36, left: 8, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 25]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#e8edf6', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={104}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: '#131c30',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#e8edf6',
            }}
            formatter={(v: number) => [`${v}%`, 'Chance de título']}
          />
          <Bar dataKey="prob" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.isBrazil ? '#ffdf00' : '#33415c'} />
            ))}
            <LabelList
              dataKey="prob"
              position="right"
              formatter={(v: number) => `${v}%`}
              fill="#93a0b8"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
