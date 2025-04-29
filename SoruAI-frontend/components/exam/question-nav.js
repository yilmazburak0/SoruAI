import React from 'react';
import styles from './styles/question-nav.module.css';

export const QuestionNav = ({ questions, currentIndex, answers, onQuestionSelect }) => {
  return (
    <div className={styles.questionNav}>
      <h3>Sorular</h3>
      <div className={styles.questionNavBoxes}>
        {questions.map((_, index) => (
          <div
            key={index}
            className={`
            ${styles.questionBox} 
            ${currentIndex === index ? styles.currentQuestion : ""} 
            ${answers[index]?.selectedAnswer ? styles.answeredQuestion : ""}
          `}
            onClick={() => onQuestionSelect(index)}>
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};