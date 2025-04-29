import styles from '../styles.module.css';

export function AnswerStatus({
  isUnanswered,
  isCorrect,
  studentAnswer,
  correctAnswer,
  solutionExplanation,
  isExpanded,
  onToggleSolution
}) {
  return (
    <div className={styles.answerStatus}>
      {isUnanswered ? (
        <p className={styles.unansweredText}>Boş</p>
      ) : isCorrect ? (
        <p className={styles.correctText}>Cevabın: {studentAnswer} (Doğru)</p>
      ) : (
        <div>
          <p className={styles.incorrectText}>
            Cevabın: {studentAnswer}
          </p>
          <p className={styles.correctText}>
            Doğru Cevap: {correctAnswer}
          </p>
        </div>
      )}
      
      {solutionExplanation && (
        <div className={styles.solutionContainer}>
          <button 
            className={styles.solutionToggle}
            onClick={onToggleSolution}
          >
            {isExpanded ? 'Çözümü Gizle' : 'Çözümü Göster'}
          </button>
          
          {isExpanded && (
            <div className={styles.solutionText}>
              {solutionExplanation.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}