export const getTypeLabel = (type) => {
  switch (type) {
    case "MC":
      return "Multiple Choice";
    case "CB":
      return "Checkbox";
    case "TF":
      return "True/False";
    case "DESC":
      return "Descriptive";
    default:
      return type;
  }
};

export const getTotalPoints = (questions) => {
  return questions.reduce((sum, q) => {
    if (q.question_type === "CB") {
      const correctAnswersCount = q.options?.filter((opt) => opt.is_correct === true).length || 0;
      return sum + q.points * correctAnswersCount;
    }
    return sum + (q.points || 0);
  }, 0);
};

export const validateQuestion = (question) => {
  if (!question.question_text.trim()) {
    return "Question text is required";
  }

  if ((question.question_type === "MC" || question.question_type === "CB") && 
      (!question.options || question.options.length < 2)) {
    return "At least 2 options are required";
  }

  return null;
};