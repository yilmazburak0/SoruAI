import React from 'react';
import styles from './styles/exam-summary.module.css';

export const ExamSummary = ({ stats, onReturn, onSubmit }) => {
  return (
    <>
      <h1>Sınav Tamamlandı.</h1>

      <div className={styles.summary}>
        <p>
          <strong>Toplam Soru sayısı:</strong> {stats.totalQuestions}
        </p>
        <p>
          <strong>Cevaplanan Soru sayısı:</strong> {stats.answeredQuestions}
        </p>
        <p>
          <strong>Boş bırakılan Soru sayısı:</strong> {stats.unansweredQuestions}
        </p>
      </div>

      <div className={styles.examCompletedButtons}>
        <button
          className={`${styles.buttonSecondary} ${styles.returnButton}`}
          onClick={onReturn}>
          Sınava dön
        </button>

        <button className={styles.buttonPrimary} onClick={onSubmit}>
          Sınavı Gönder
        </button>
      </div>
    </>
  );
};