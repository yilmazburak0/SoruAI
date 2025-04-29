'use client';

import { useParams, useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
import { useExam } from '@/hooks/use-exam';
import { ExamQuestion } from '@/components/exam/exam-question';
import { QuestionNav } from '@/components/exam/question-nav';
import { ExamSummary } from '@/components/exam/exam-summary';
import styles from './styles.module.css';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id);
  
  const {
    currentExam,
    currentQuestionIndex,
    answers,
    examCompleted,
    isLoading,
    error,
    
    handleAnswerSelect,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    handleSubmitExam,
    returnToExam,
    
    getExamStats
  } = useExam(examId);

  // Handle error state
  if (error) {
    return (
      <div className={styles.container}>
        <h1>Error</h1>
        <p>{error}</p>
        <button
          className={styles.buttonPrimary}
          onClick={() => router.push("/")}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Handle loading state
  if (isLoading || !currentExam || answers.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Sınav Yükleniyor...</h1>
        <Loading />
        <button
          className={styles.buttonPrimary}
          onClick={() => router.push("/")}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Handle exam completed state
  if (examCompleted) {
    const stats = getExamStats();
    return (
      <div className={styles.container}>
        <ExamSummary 
          stats={stats} 
          onReturn={returnToExam} 
          onSubmit={handleSubmitExam} 
        />
      </div>
    );
  }

  // Main exam UI
  const currentQuestion = currentExam.questions[currentQuestionIndex];
  const totalQuestions = currentExam.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className={styles.container}>
      <h1>{currentExam.title}</h1>

      <div className={styles.progressInfo}>
        <p>{currentQuestionIndex + 1}. Soru</p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Question navigation panel */}
        <QuestionNav 
          questions={currentExam.questions} 
          currentIndex={currentQuestionIndex}
          answers={answers}
          onQuestionSelect={goToQuestion}
        />

        {/* Current question */}
        <ExamQuestion 
          question={currentQuestion}
          selectedAnswer={answers[currentQuestionIndex]?.selectedAnswer}
          onAnswerSelect={(option) => handleAnswerSelect(option, currentQuestion)}
        />
      </div>

      <div className={styles.navigation}>
        <button
          className={styles.buttonSecondary}
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}>
          Önceki Soru
        </button>
        <button 
          className={styles.buttonPrimary} 
          onClick={() => goToNextQuestion(totalQuestions)}>
          {isLastQuestion ? "Sınavı bitir" : "Sonraki Soru"}
        </button>
      </div>
    </div>
  );
}