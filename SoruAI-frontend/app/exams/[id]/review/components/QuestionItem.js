import styles from '../styles.module.css';
import { OptionsList } from './OptionsList';
import { AnswerStatus } from './AnswerStatus';

export function QuestionItem({ question, questionNumber, isExpanded, onToggleSolution }) {
  const studentAnswer = question.student_answer;
  const isCorrect = question.is_correct;
  const isUnanswered = !studentAnswer;
  
  return (
    <div
      className={`${styles.questionItem} ${
        isCorrect
          ? styles.correct
          : isUnanswered
          ? styles.unanswered
          : styles.incorrect
      }`}>
      <div className={styles.questionMeta}>
        {question.topic && (
          <span className={`${styles.tag} ${styles.topicTag}`}>
            Konu: {question.topic}
          </span>
        )}
        {question.difficulty_level && (
          <span
            className={`${styles.tag} ${
              styles[`difficulty-${question.difficulty_level.toLowerCase()}`]
            }`}>
            Zorluk: {question.difficulty_level}
          </span>
        )}
      </div>
      <h3 className={styles.questionTitle}>
        Soru {questionNumber}: {question.question_text}
      </h3>
      <p className={styles.questionStem}>{question.question_stem}</p>

      <OptionsList
        options={["A", "B", "C", "D", "E"]}
        question={question}
        studentAnswer={studentAnswer}
      />

      <AnswerStatus
        isUnanswered={isUnanswered}
        isCorrect={isCorrect}
        studentAnswer={studentAnswer}
        correctAnswer={question.correct_answer}
        solutionExplanation={question.solution_explanation}
        isExpanded={isExpanded}
        onToggleSolution={onToggleSolution}
      />
    </div>
  );
}