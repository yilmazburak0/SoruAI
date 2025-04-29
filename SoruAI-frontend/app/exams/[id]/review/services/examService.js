import { getCookie } from '../utils/cookies';

export async function fetchExamDetails(examId) {
  const token = getCookie('token');
  
  const response = await fetch(`http://localhost:5003/exams/${examId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch exam details: ${response.statusText}`);
  }
  
  const data = await response.json();

  // Ensure stats object exists
  if (!data.stats) {
    data.stats = {
      correct_count: 0,
      wrong_count: 0,
      empty_count: 0
    };
  }
  
  // Make sure user_answers is initialized
  if (!data.user_answers) {
    data.user_answers = [];
  }

  return data;
}