import { useState, useEffect } from 'react';
import { getQuestions, getAnswers, addQuestion, updateQuestion, deleteQuestion, addAnswer, updateAnswer, deleteAnswer } from '../../../../../../api/api';
import toast from 'react-hot-toast';

export const useQuestions = (quizId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchQuestions = async () => {
    if (!quizId) return;
    
    setLoading(true);
    try {
      const questionsRes = await getQuestions(quizId);
      const answersRes = await getAnswers(quizId);

      const answersByQuestion = {};
      answersRes.forEach((answer) => {
        if (!answersByQuestion[answer.question_id]) {
          answersByQuestion[answer.question_id] = [];
        }
        answersByQuestion[answer.question_id].push(answer);
      });

      const withOptions = questionsRes.map((q) => {
        let options = answersByQuestion[q.question_id] || [];

        if (q.question_type === "DESC" && options.length === 0) {
          options = [{ option_text: "", is_correct: true }];
        }

        return { ...q, options };
      });

      setQuestions(withOptions);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = async (questionData, editingIndex) => {
    const q = questionData;
    if (!q.question_text.trim()) {
      toast.error("Question text required");
      return false;
    }

    if (
      (q.question_type === "MC" || q.question_type === "CB") &&
      (!q.options || q.options.length < 2)
    ) {
      toast.error("At least 2 options are required");
      return false;
    }

    setIsProcessing(true);

    try {
      if (editingIndex !== null) {
        // Update existing question
        await updateQuestion(quizId, q.question_id, q);
        toast.success("Question Updated!");

        const originalOptions = questions[editingIndex].options || [];
        const originalIds = originalOptions
          .map((o) => o.answer_id)
          .filter(Boolean);

        // Update or add options
        for (const opt of q.options) {
          if (opt.answer_id) {
            await updateAnswer(opt.answer_id, opt);
          } else {
            await addAnswer(q.question_id, opt);
          }
        }

        // Delete removed options
        for (const oldId of originalIds) {
          if (!q.options.find((o) => o.answer_id === oldId)) {
            await deleteAnswer(oldId);
          }
        }
      } else {
        // Add new question
        const { question_id } = await addQuestion(quizId, q);
        toast.success("Question Added!");
        
        // Add all options
        for (const opt of q.options) {
          await addAnswer(question_id, opt);
        }
      }

      await fetchQuestions();
      return true;
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save question");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteQuestionById = async (question) => {
    try {
      await deleteQuestion(quizId, question.question_id);
      toast.success("Question Deleted!");
      await fetchQuestions();
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Question Deletion Failed!");
      return false;
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  return {
    questions,
    loading,
    isProcessing,
    fetchQuestions,
    saveQuestion,
    deleteQuestion: deleteQuestionById,
  };
};