'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/dashboard');
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <span className={styles.logo}>🎾</span>
        <h1 className={styles.title}>Entrar</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <label className={styles.label}>
            E-mail
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              required placeholder="seu@email.com" className={styles.input} />
          </label>
          <label className={styles.label}>
            Senha
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="••••••••" className={styles.input} />
          </label>
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.footer}>
          Não tem conta? <Link href="/auth/signup">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
