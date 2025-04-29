import styles from '../styles.module.css';

export function ErrorDisplay({ error, onGoHome }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Hata</h1>
      <p>{error || 'Exam not found'}</p>
      <button 
        className={styles.buttonPrimary}
        onClick={onGoHome}
      >
        Ana sayfaya dön
      </button>
    </div>
  );
}