'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new-match.module.css';

const initialForm = {
  opponent_name: '',
  date: new Date().toISOString().split('T')[0],
  score: '',
  result: 'vitória' as 'vitória' | 'derrota' | 'WO',
  location: '',
  notes: '',
};

export default function NewMatchPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: persist to Supabase
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push('/dashboard');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎾 Nova Partida</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Adversário *
            <input
              name="opponent_name"
              value={form.opponent_name}
              onChange={handleChange}
              required
              placeholder="Nome do adversário"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Data *
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Placar *
            <input
              name="score"
              value={form.score}
              onChange={handleChange}
              required
              placeholder='ex: 6-4, 3-6, 7-5'
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Resultado *
            <select name="result" value={form.result} onChange={handleChange} className={styles.select}>
              <option value="vitória">Vitória</option>
              <option value="derrota">Derrota</option>
              <option value="WO">WO</option>
            </select>
          </label>

          <label className={styles.label}>
            Local
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Clube, quadra, etc."
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Observações
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notas sobre a partida..."
              className={styles.textarea}
              rows={3}
            />
          </label>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.btnCancel}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Salvando...' : 'Salvar partida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
