'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from './new-training.module.css';

const initialForm = {
  date: new Date().toISOString().split('T')[0],
  duration_minutes: '',
  type: 'técnico' as 'técnico' | 'tático' | 'físico' | 'jogo',
  notes: '',
};

export default function NewTrainingPage() {
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

    const { error: insertError } = await supabase.from('trainings').insert({
      player_id: player.id,
      date: form.date,
      duration_minutes: Number(form.duration_minutes),
      type: form.type,
      notes: form.notes,
    });

    setLoading(false);
    if (insertError) { setError(insertError.message); return; }
    router.push('/dashboard');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>💪 Novo Treino</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <label className={styles.label}>
            Data *
            <input type="date" name="date" value={form.date} onChange={handleChange}
              required className={styles.input} />
          </label>

          <label className={styles.label}>
            Duração (minutos) *
            <input type="number" name="duration_minutes" value={form.duration_minutes}
              onChange={handleChange} required min={1} placeholder="ex: 60" className={styles.input} />
          </label>

          <label className={styles.label}>
            Tipo *
            <select name="type" value={form.type} onChange={handleChange} className={styles.select}>
              <option value="técnico">Técnico</option>
              <option value="tático">Tático</option>
              <option value="físico">Físico</option>
              <option value="jogo">Jogo</option>
            </select>
          </label>

          <label className={styles.label}>
            Observações
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="Notas sobre o treino..." className={styles.textarea} rows={3} />
          </label>

          <div className={styles.actions}>
            <button type="button" onClick={() => router.back()} className={styles.btnCancel}>
              Cancelar
            </button>
            <button type="submit" disabled={loading} className={styles.btnSubmit}>
              {loading ? 'Salvando...' : 'Salvar treino'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
