import Link from 'next/link';
import styles from './dashboard.module.css';

const stats = [
  { label: 'Vitórias', value: '0', icon: '🏆' },
  { label: 'Derrotas', value: '0', icon: '❌' },
  { label: 'Horas treinadas', value: '0h', icon: '⏱️' },
  { label: 'Partidas jogadas', value: '0', icon: '🎾' },
];

export default function DashboardPage() {
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
            <h1>Dashboard</h1>
            <p className={styles.sub}>Bem-vindo de volta! Aqui está seu resumo.</p>
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
          <div className={styles.empty}>
            <p>Nenhuma partida registrada ainda.</p>
            <Link href="/matches/new" className={styles.btnPrimary}>Registrar primeira partida</Link>
          </div>
        </section>

        <section className={styles.recentSection}>
          <h2>Últimos treinos</h2>
          <div className={styles.empty}>
            <p>Nenhum treino registrado ainda.</p>
            <Link href="/trainings/new" className={styles.btnPrimary}>Registrar primeiro treino</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
