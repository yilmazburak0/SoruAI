import styles from '../styles.module.css';

export function OptionsList({ options, question, studentAnswer }) {
  return (
    <div className={styles.optionsContainer}>
      {options.map(option => (
        <div 
          key={option}
          className={`${styles.optionItem} 
            ${studentAnswer === option ? styles.selectedOption : ''} 
            ${question.correct_answer === option ? styles.correctOption : ''}`}
        >
          <span className={styles.optionKey}>{option}</span>
          <span className={styles.optionText}>
            {question[`option_${option.toLowerCase()}`]}
          </span>
        </div>
      ))}
    </div>
  );
}