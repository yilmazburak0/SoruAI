'use client';

import styles from '../styles.module.css';
import { FaCheckCircle, FaEye, FaPencilAlt, FaCheck, FaTimes, FaDotCircle } from 'react-icons/fa';

export function ExamList({ exams, onViewExam, onTakeExam }) {
  return (
    <div>
      <h2 className={styles.subHeader}>TYT Türkçe Deneme Sınavları</h2>
      {exams.length === 0 ? (
        <p className={styles.noExams}>Sınav Bulunmamaktadır</p>
      ) : (
        <ul className={styles.examList}>
          {exams.map((exam) => (
            <li key={exam.id} className={styles.examItem}>
              <h3 className={styles.examTitle}>
                {exam.title}
                {exam.taken && (
                  <span className={styles.takenBadge}>
                    <FaCheckCircle style={{ marginRight: '5px' }} /> Çözüldü
                  </span>
                )}
              </h3>
              
              {exam.taken && exam.stats && (
                <div className={styles.examStats}>
                  <p>
                    <strong>İstatistikler:</strong> 
                    <span className={`${styles.statItem} ${styles.statCorrect}`}>
                      <FaCheck style={{ marginRight: '5px' }} /> 
                      {exam.stats.correct_count} doğru
                    </span>
                    <span className={`${styles.statItem} ${styles.statWrong}`}>
                      <FaTimes style={{ marginRight: '5px' }} /> 
                      {exam.stats.wrong_count} yanlış
                    </span>
                    <span className={`${styles.statItem} ${styles.statEmpty}`}>
                      <FaDotCircle style={{ marginRight: '5px' }} /> 
                      {exam.stats.empty_count} boş
                    </span>
                  </p>
                </div>
              )}
              
              {exam.taken ? (
                <button 
                  className={`${styles.button} ${styles.secondaryButton}`}
                  onClick={() => onViewExam(exam.id)}
                >
                  <FaEye /> Sınavı incele
                </button>
              ) : (
                <button 
                  className={`${styles.button} ${styles.primaryButton}`}
                  onClick={() => onTakeExam(exam.id)}
                >
                  <FaPencilAlt /> Sınavı çöz
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}