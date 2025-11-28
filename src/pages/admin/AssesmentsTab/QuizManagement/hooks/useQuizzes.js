import { useState, useEffect } from 'react';
import { getQuizzes } from '../../../../../../api/api';

export const useQuizzes = (departmentId) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getQuizzes(departmentId);

      const quizzesWithLinksArray = response.map((quiz) => ({
        ...quiz,
        pdf_links: quiz.pdf_link ? quiz.pdf_link.split(',') : [],
      }));

      setQuizzes(quizzesWithLinksArray);
      setError(null);
    } catch (err) {
      if (err.response?.status === 400) {
        setQuizzes([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch quizzes');
        console.error('Error fetching quizzes:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (departmentId) {
      fetchQuizzes();
    }
  }, [departmentId]);

  return {
    quizzes,
    loading,
    error,
    refetchQuizzes: fetchQuizzes,
  };
};