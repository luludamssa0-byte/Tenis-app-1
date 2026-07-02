import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import styles from './dashboard.module.css';

async function getSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

export default async function DashboardPage() {
  const supabase = await getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: player } = await supabase
    .from('players')
    .select('id, name')
    .eq('user_id', user.id)
    .single();

  const [{ data: matches }, { data: trainings }] = await Promise.all([
    supabase.from('matches').select('*').eq('player_id', player?.id ?? '').order('date', { ascending: false }),
    supabase.from('trainings').select('*').eq('player_id', player?.id ?? '').order('date', { ascending: false }),
  ]);

  const wins = matches?.filter(m => m.result === 'vitória').length ?? 0;
  const losses = matches?.filter(m => m.result === 'derrota').length ?? 0;
  const totalMinutes = trainings?.reduce((sum, t) => sum + t.duration_minutes, 0) ?? 0;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const stats = [
    { label: 'Vitórias', value: String(wins), icon: '🏆' },
    { label: 'Derrotas', value: String(losses), icon: '❌' },
    { label: 'Horas treinadas', value: hours > 0 ? `${hours}h${mins > 0 ? mins + 'm' : ''}` : `${mins}m`, icon: '⏱️' },
    { label: 'Partidas jogadas', value: String((matches?.length ?? 0)), icon: '🎾' },
  ];

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <span className={styles.logo}>🎾 Tennis App</span>
        <div className={styles.navLinks}>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/matches">Partidas</Link>
          <Link href="/trainings">Treinos</Link>
        </div>
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>Olá, {player?.name?.split(' ')[0] ?? 'Jogador'} 👋</h1>
            <p className={styles.sub}>Aqui está seu resumo de desempenho.</p>
          </div>
          <div className={styles.quickActions}>
            <Link href="/matches/new" className={styles.btnPrimary}>+ Nova partida</Link>
            <Link href="/trainings/new" className={styles.btnSecondary}>+ Novo treino</Link>
          </div>
        </header>

        <section className={styles.statsGrid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </section>

        <section className={styles.recentSection}>
          <h2>Últimas partidas</h2>
          {!matches?.length ? (
            <div className={styles.empty}>
              <p>Nenhuma partida registrada ainda.</p>
              <Link href="/matches/new" className={styles.btnPrimary}>Registrar primeira partida</Link>
            </div>
          ) : (
            <ul className={styles.list}>
              {matches.slice(0, 5).map(m => (
                <li key={m.id} className={styles.listItem}>
                  <span className={m.result === 'vitória' ? styles.win : styles.loss}>
                    {m.result === 'vitória' ? '🏆' : m.result === 'derrota' ? '❌' : '➖'}
                  </span>
                  <div className={styles.listInfo}>
                    <strong>vs {m.opponent_name}</strong>
                    <span>{m.score}</span>
                  </div>
                  <span className={styles.listDate}>{new Date(m.date).toLocaleDateString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.recentSection}>
          <h2>Últimos treinos</h2>
          {!trainings?.length ? (
            <div className={styles.empty}>
              <p>Nenhum treino registrado ainda.</p>
              <Link href="/trainings/new" className={styles.btnPrimary}>Registrar primeiro treino</Link>
            </div>
          ) : (
            <ul className={styles.list}>
              {trainings.slice(0, 5).map(t => (
                <li key={t.id} className={styles.listItem}>
                  <span className={styles.trainingIcon}>💪</span>
                  <div className={styles.listInfo}>
                    <strong>{t.type.charAt(0).toUpperCase() + t.type.slice(1)}</strong>
                    <span>{t.duration_minutes} min{t.notes ? ` · ${t.notes.slice(0, 40)}` : ''}</span>
                  </div>
                  <span className={styles.listDate}>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
