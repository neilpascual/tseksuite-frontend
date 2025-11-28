import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuestions, getOptions } from '../../../../../api/api';
import { getPdfLinks } from '../utils/pdfUtils';

export const useTestData = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [quizData, setQuizData] = useState(null);
  const [applicantData, setApplicantData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasPdfReference = getPdfLinks(quizData).length > 0;
  const hasQuestions = questions.length > 0;

  const fetchQuestions = useCallback(async (quizId) => {
    try {
      setLoading(true);
      const questionsData = await getQuestions(quizId);
      const answersData = await getOptions(quizId);

      const answersByQuestion = {};
      answersData.forEach((answer) => {
        if (!answersByQuestion[answer.question_id]) {
          answersByQuestion[answer.question_id] = [];
        }
        answersByQuestion[answer.question_id].push(answer);
      });

      const questionsWithOptions = questionsData.map((question) => {
        let options = answersByQuestion[question.question_id] || [];
        if (question.question_type === "DESC" && options.length === 0) {
          options = [{ answer_id: null, option_text: "", is_correct: true }];
        }

        return {
          ...question,
          options: options.map((opt) => ({
            answer_id: opt.answer_id,
            option_text: opt.option_text,
          })),
          explanation: question.explanation || "",
        };
      });

      setQuestions(questionsWithOptions);
      return questionsWithOptions;
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const selectedQuiz = location.state?.quizData || JSON.parse(localStorage.getItem("selectedQuiz") || "null");
        const applicant = location.state?.applicantData || JSON.parse(localStorage.getItem("applicantData") || "{}");

        console.log("Selected Quiz:", selectedQuiz);
        console.log("Applicant Data:", applicant);

        if (!selectedQuiz || !applicant.examiner_id) {
          setError("No quiz selected or applicant data missing");
          return;
        }

        setQuizData(selectedQuiz);
        setApplicantData(applicant);
        await fetchQuestions(selectedQuiz.quiz_id);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError(err.message);
      }
    };

    loadInitialData();
  }, [location, fetchQuestions]);

  return {
    quizData,
    applicantData,
    questions,
    loading,
    error,
    hasPdfReference,
    hasQuestions,
    fetchQuestions
  };
};