'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchExams } from '@/stores/exam-store/index.jsx';

export function useExams(isInitializing, isAuthenticated, checkTokenExists) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items: exams, status, error } = useSelector((state) => state.exams);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // After initialization, respond to exam status changes
    if (!isInitializing) {
      const hasToken = checkTokenExists();
      
      if (status === 'idle' && hasToken && isAuthenticated) {
        dispatch(fetchExams());
      } else if (status === 'failed' && error === 'No authentication token found') {
        if (hasToken && isAuthenticated) {
          dispatch(fetchExams());
        }
      }
    }
  }, [status, dispatch, error, isAuthenticated, isInitializing, checkTokenExists]);

  const handleViewExam = (examId) => {
    setIsNavigating(true);
    router.push(`/exams/${examId}/review`);
  };

  const handleTakeExam = (examId) => {
    localStorage.setItem(`exam_${examId}_currentIndex`, '0');
    setIsNavigating(true);
    router.push(`/exams/${examId}`);
  };

  return {
    exams,
    status,
    error,
    isNavigating,
    handleViewExam,
    handleTakeExam,
    fetchExams: () => dispatch(fetchExams())
  };
}