import styles from '../styles.module.css';
import { QuestionItem } from './QuestionItem';

export function QuestionsList({ questions, indexOfFirstQuestion, expandedSolutions, toggleSolution }) {
  return (
    <>
      {questions.map((question, index) => {
        const questionNumber = indexOfFirstQuestion + index + 1;
        
        return (
          <QuestionItem
            key={question.id}
            question={question}
            questionNumber={questionNumber}
            isExpanded={expandedSolutions[question.id]}
            onToggleSolution={() => toggleSolution(question.id)}
          />
        );
      })}
    </>
  );
}