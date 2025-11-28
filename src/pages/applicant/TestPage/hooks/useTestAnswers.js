import { useState, useCallback } from 'react';

export const useTestAnswers = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [descriptiveAnswers, setDescriptiveAnswers] = useState({});

  const initializeAnswers = useCallback((questions) => {
    const initialSelectedAnswers = {};
    const initialDescriptiveAnswers = {};
    
    questions.forEach((question, index) => {
      if (question.question_type === "DESC") {
        initialDescriptiveAnswers[index] = "";
      } else if (question.question_type === "CB") {
        initialSelectedAnswers[index] = [];
      } else {
        initialSelectedAnswers[index] = null;
      }
    });

    setSelectedAnswers(initialSelectedAnswers);
    setDescriptiveAnswers(initialDescriptiveAnswers);
  }, []);

  const handleAnswerSelect = useCallback((questionIndex, answerId, questionType) => {
    if (questionType === "CB") {
      setSelectedAnswers(prev => {
        const currentAnswers = prev[questionIndex] || [];
        if (currentAnswers.includes(answerId)) {
          return {
            ...prev,
            [questionIndex]: currentAnswers.filter(id => id !== answerId)
          };
        } else {
          return {
            ...prev,
            [questionIndex]: [...currentAnswers, answerId]
          };
        }
      });
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answerId
      }));
    }
  }, []);

  const handleDescriptiveAnswer = useCallback((questionIndex, answer) => {
    setDescriptiveAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  }, []);

  return {
    selectedAnswers,
    descriptiveAnswers,
    handleAnswerSelect,
    handleDescriptiveAnswer,
    initializeAnswers
  };
};