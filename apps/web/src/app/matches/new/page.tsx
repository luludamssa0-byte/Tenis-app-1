'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
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
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!player) { setError('Perfil não encontrado.'); setLoading(false); return; }

    const { error: insertError } = await supabase.from('matches').insert({
      player_id: player.id,
      ...form,
    });

    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
    router.push('/dashboard');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>🎾 Nova Partida</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <label className={styles.label}>
            Adversário *
            <input name="opponent_name" value={form.opponent_name} onChange={handleChange}
              required placeholder="Nome do adversário" className={styles.input} />
          </label>

          <label className={styles.label}>
            Data *
            <input type="date" name="date" value={form.date} onChange={handleChange}
              required className={styles.input} />
          </label>

          <label className={styles.label}>
            Placar *
            <input name="score" value={form.score} onChange={handleChange}
              required placeholder='ex: 6-4, 3-6, 7-5' className={styles.input} />
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
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="Clube, quadra, etc." className={styles.input} />
          </label>

          <label className={styles.label}>
            Observações
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="Notas sobre a partida..." className={styles.textarea} rows={3} />
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
