export const calculateProgress = (questions, selectedAnswers, descriptiveAnswers) => {
  if (questions.length === 0) return 0;
  
  const answeredCount = Object.keys(selectedAnswers).filter(k => 
    selectedAnswers[k] !== null && 
    selectedAnswers[k] !== undefined && 
    (Array.isArray(selectedAnswers[k]) ? selectedAnswers[k].length > 0 : true)
  ).length + Object.keys(descriptiveAnswers).filter(k => 
    descriptiveAnswers[k]?.trim()
  ).length;

  return (answeredCount / questions.length) * 100;
};

export const getUnansweredQuestions = (questions, selectedAnswers, descriptiveAnswers) => {
  return questions.filter((question, index) => {
    if (question.question_type === "DESC") {
      return !descriptiveAnswers[index]?.trim();
    } else if (question.question_type === "CB") {
      return !selectedAnswers[index] || selectedAnswers[index].length === 0;
    } else {
      return selectedAnswers[index] === null;
    }
  });
};