import React from 'react';
import styles from './styles/exam-question.module.css';
import { FaQuestionCircle, FaBookOpen, FaCheck } from 'react-icons/fa';

export const ExamQuestion = ({ question, selectedAnswer, onAnswerSelect }) => {
  return (
    <div className={styles.question}>
      {question.question_text && (
        <div className={styles.questionHeader}>
          <FaQuestionCircle className={styles.questionIcon} />
          <h3>{question.question_text}</h3>
        </div>
      )}
      
      <div className={styles.stemContainer}>
        <FaBookOpen className={styles.stemIcon} />
        <p className={styles.questionStem}>{question.question_stem}</p>
      </div>

      <div className={styles.options}>
        {['A', 'B', 'C', 'D', 'E'].map((option) => (
          <div
            key={option}
            className={`${styles.option} ${
              selectedAnswer === option ? styles.selected : ""
            }`}
            onClick={() => onAnswerSelect(option)}>
            <span className={styles.optionKey}>{option}</span>
            <span className={styles.optionText}>
              {question[`option_${option.toLowerCase()}`]}
            </span>
            {selectedAnswer === option && (
              <FaCheck className={styles.checkIcon} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};