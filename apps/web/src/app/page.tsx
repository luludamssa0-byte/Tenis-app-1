import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <span className={styles.badge}>🎾 Tennis App</span>
        <h1 className={styles.title}>Sua evolução no tênis começa aqui</h1>
        <p className={styles.subtitle}>
          Registre partidas, acompanhe treinos e veja sua evolução ao longo do tempo.
        </p>
        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.btnPrimary}>Acessar Dashboard</Link>
          <Link href="/auth/signup" className={styles.btnSecondary}>Criar conta</Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.card}>
          <span className={styles.icon}>🏆</span>
          <h3>Registre partidas</h3>
          <p>Placar, adversário, local e resultado em segundos.</p>
        </div>
        <div className={styles.card}>
          <span className={styles.icon}>💪</span>
          <h3>Acompanhe treinos</h3>
          <p>Duração, tipo e observações de cada sessão.</p>
        </div>
        <div className={styles.card}>
          <span className={styles.icon}>📈</span>
          <h3>Veja sua evolução</h3>
          <p>Dashboard com vitórias, derrotas e horas treinadas.</p>
        </div>
      </div>
    </main>
  );
}
