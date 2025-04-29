import { getCookie } from '@/utils/cookie';

const API_BASE_URL = 'http://localhost:5003';

export const fetchExamById = async (examId) => {
  try {
    const token = getCookie('token');
    
    const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exam: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching exam:', error);
    throw error;
  }
};

export const submitExamAnswers = async (examId, answers) => {
  try {
    const token = getCookie('token');
    
    const requestBody = {
      examId: examId,
      answers: answers,
    };

    const response = await fetch(`${API_BASE_URL}/exams/submit-answers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit exam: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting exam:', error);
    throw error;
  }
};