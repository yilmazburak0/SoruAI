import styles from '../styles.module.css';

export function ExamSummary({ stats }) {
  const { totalQuestions, correctCount, wrongCount, emptyCount } = stats;
  
  return (
    <div className={styles.examSummary}>
      <h2 className={styles.sectionTitle}>Özet</h2>
      <div className={styles.statsContainer}>
        <StatItem label="Toplam Soru" value={totalQuestions} />
        <StatItem label="Doğru Cevap" value={correctCount} />
        <StatItem label="Yanlış Cevap" value={wrongCount} />
        <StatItem label="Boş Soru" value={emptyCount} />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className={styles.statItem}>
      <span className={styles.statLabel}>{label}:</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}