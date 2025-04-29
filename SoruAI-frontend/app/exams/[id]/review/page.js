'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './styles.module.css';
import { ExamReviewContainer } from './components/ExamReviewContainer';
import { useExamReview } from './hooks/useExamReview';

export default function ExamReviewPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.id);
  
  const { 
    examDetails,
    loading,
    error,
    expandedSolutions,
    currentPage,
    questionsPerPage,
    totalPages,
    indexOfFirstQuestion,
    indexOfLastQuestion,
    currentQuestions,
    stats,
    toggleSolution,
    paginate,
    goToHome
  } = useExamReview(examId);
  
  return (
    <ExamReviewContainer
      examDetails={examDetails}
      loading={loading}
      error={error}
      expandedSolutions={expandedSolutions}
      currentPage={currentPage}
      questionsPerPage={questionsPerPage}
      totalPages={totalPages}
      indexOfFirstQuestion={indexOfFirstQuestion}
      indexOfLastQuestion={indexOfLastQuestion}
      currentQuestions={currentQuestions}
      stats={stats}
      toggleSolution={toggleSolution}
      paginate={paginate}
      goToHome={() => router.push('/')}
    />
  );
}