'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from '../auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    if (data.user) {
      await supabase.from('players').insert({
        user_id: data.user.id,
        name,
        level: 'iniciante',
      });
    }

    setLoading(false);
    router.push('/dashboard');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.logo}>🎾</span>
        <h1 className={styles.title}>Criar conta</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label className={styles.label}>
            Nome completo
            <input value={name} onChange={e => setName(e.target.value)}
              required placeholder="Seu nome" className={styles.input} />
          </label>
          <label className={styles.label}>
            E-mail
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="seu@email.com" className={styles.input} />
          </label>
          <label className={styles.label}>
            Senha
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6} placeholder="mínimo 6 caracteres" className={styles.input} />
          </label>
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
        <p className={styles.footer}>
          Já tem conta? <Link href="/auth/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
