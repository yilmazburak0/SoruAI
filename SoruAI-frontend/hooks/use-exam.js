import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchExams } from '@/stores/exam-store/index.jsx';
import { fetchExamById, submitExamAnswers } from '@/services/exam-service';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '@/utils/local-storage';

export const useExam = (examId) => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [examCompleted, setExamCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localExam, setLocalExam] = useState(null);
  const [error, setError] = useState(null);

  // Redux state
  const { items: exams, status } = useSelector((state) => state.exams);
  const exam = exams.find((exam) => exam.id === examId);

  // Storage keys
  const ANSWERS_KEY = `exam_${examId}_answers`;
  const INDEX_KEY = `exam_${examId}_currentIndex`;
  const COMPLETED_KEY = `exam_${examId}_completed`;

  // Initialize from Redux or fetch directly
  useEffect(() => {
    const fetchData = async () => {
      if (!exam && status !== "loading") {
        await dispatch(fetchExams());
      }
    };

    fetchData();
  }, [exam, dispatch, status]);

  // Load from localStorage
  useEffect(() => {
    const savedAnswers = getFromLocalStorage(ANSWERS_KEY);
    const savedIndex = getFromLocalStorage(INDEX_KEY);
    const savedCompleted = getFromLocalStorage(COMPLETED_KEY);

    if (savedAnswers) {
      setAnswers(savedAnswers);
    }

    if (savedIndex) {
      setCurrentQuestionIndex(parseInt(savedIndex));
    }

    if (savedCompleted === true) {
      setExamCompleted(true);
    }
  }, [ANSWERS_KEY, COMPLETED_KEY, INDEX_KEY]);

  // Initialize answers array
  useEffect(() => {
    if (exam && exam.questions) {
      // Only initialize if answers haven't been loaded from localStorage
      if (answers.length === 0) {
        const initialAnswers = exam.questions.map((q) => ({
          questionId: q.id,
          selectedAnswer: "",
          isCorrect: false,
        }));
        setAnswers(initialAnswers);
        saveToLocalStorage(ANSWERS_KEY, initialAnswers);
      }
      setIsLoading(false);
    }
  }, [exam, answers.length, ANSWERS_KEY]);

  // Save current state to localStorage whenever it changes
  useEffect(() => {
    if (answers.length > 0) {
      saveToLocalStorage(ANSWERS_KEY, answers);
      saveToLocalStorage(INDEX_KEY, currentQuestionIndex);
      saveToLocalStorage(COMPLETED_KEY, examCompleted);
    }
  }, [answers, currentQuestionIndex, examCompleted, ANSWERS_KEY, COMPLETED_KEY, INDEX_KEY]);

  // Fetch exam directly from API if not in Redux store
  useEffect(() => {
    const fetchExamDirectly = async () => {
      if (!exam && !localExam) {
        try {
          const data = await fetchExamById(examId);
          setLocalExam(data);
        } catch (err) {
          console.error("Error fetching exam:", err);
          setError(err.message);
        }
      }
    };

    fetchExamDirectly();
  }, [exam, examId, localExam]);

  // Actions
  const handleAnswerSelect = (optionKey, currentQuestion) => {
    const updatedAnswers = [...answers];
    const isCorrect = optionKey === currentQuestion.correct_answer;

    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      selectedAnswer: optionKey,
      isCorrect,
    };

    setAnswers(updatedAnswers);
  };

  const goToNextQuestion = (totalQuestions) => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setExamCompleted(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = async () => {
    try {
      await submitExamAnswers(examId, answers);
      
      // Clean up local storage
      removeFromLocalStorage(ANSWERS_KEY);
      removeFromLocalStorage(INDEX_KEY);
      removeFromLocalStorage(COMPLETED_KEY);

      // Refresh exams in Redux
      await dispatch(fetchExams());
      
      // Navigate home
      router.push("/");
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const returnToExam = () => {
    setExamCompleted(false);
  };

  // Calculations
  const getExamStats = () => {
    const currentExam = exam || localExam;
    if (!currentExam) return null;

    const answeredQuestions = answers.filter(
      (answer) => answer.selectedAnswer !== ""
    ).length;
    const unansweredQuestions = currentExam.questions.length - answeredQuestions;

    return {
      totalQuestions: currentExam.questions.length,
      answeredQuestions,
      unansweredQuestions
    };
  };

  return {
    // State
    currentExam: exam || localExam,
    currentQuestionIndex,
    answers,
    examCompleted,
    isLoading,
    error,
    
    // Actions
    handleAnswerSelect,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    handleSubmitExam,
    returnToExam,
    
    // Calculations
    getExamStats
  };
};