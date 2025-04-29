import { useState, useEffect } from 'react';
import { fetchExamDetails } from '../services/examService';

export function useExamReview(examId) {
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSolutions, setExpandedSolutions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;
  
  useEffect(() => {
    const getExamDetails = async () => {
      try {
        const data = await fetchExamDetails(examId);
        setExamDetails(data);
      } catch (err) {
        console.error('Error fetching exam details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    getExamDetails();
  }, [examId]);
  
  const toggleSolution = (questionId) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Calculate pagination values
  const totalPages = examDetails ? Math.ceil(examDetails.questions.length / questionsPerPage) : 0;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = examDetails?.questions 
    ? examDetails.questions.slice(indexOfFirstQuestion, indexOfLastQuestion) 
    : [];
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to the top of the questions list when changing pages
    document.querySelector(`.questionsList`)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const stats = calculateStats(examDetails);
  
  return {
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
    paginate
  };
}

function calculateStats(examDetails) {
  if (!examDetails?.questions || examDetails.questions.length === 0) {
    return {
      totalQuestions: 0,
      correctCount: 0,
      wrongCount: 0,
      emptyCount: 0
    };
  }
  
  const totalQuestions = examDetails.questions.length;
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;
  
  examDetails.questions.forEach(question => {
    if (!question.student_answer) {
      emptyCount++;
    } else if (question.is_correct) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });
  
  return {
    totalQuestions,
    correctCount,
    wrongCount,
    emptyCount
  };
}