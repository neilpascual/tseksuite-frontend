import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { addResult, addBridge } from '../../../../../api/api';
import { countAnswer, formatAnswers } from '../../../../../helpers/helpers';
import { formatTime } from '../utils/timeUtils';

export const useTestTimer = (quizData, questions) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const updateProgress = useCallback((selectedAnswers, descriptiveAnswers) => {
    if (questions.length > 0) {
      const answeredCount = Object.keys(selectedAnswers).length + Object.keys(descriptiveAnswers).length;
      const percent = (answeredCount / questions.length) * 100;
      setPercentage(percent);
    }
  }, [questions.length]);

  const submitTest = useCallback(async (applicantData, selectedAnswers, descriptiveAnswers, hasPdfReference = false) => {
    if (!quizData || !applicantData) {
      throw new Error("Quiz or applicant data not found");
    }

    // Validate examiner_id exists
    if (!applicantData.examiner_id) {
      throw new Error("Applicant examiner_id is missing");
    }

    try {
      setIsSubmitting(true);

      let formattedAnswers = [];
      let answeredCount = 0;
      let status = "COMPLETED";

      if (hasPdfReference && questions.length === 0) {
        // PDF-only test
        formattedAnswers = [];
        answeredCount = 0;
        status = "COMPLETED";
      } else {
        const allAnswers = questions.map((question, index) => {
          if (question.question_type === "DESC") {
            return descriptiveAnswers[index] || "";
          } else if (question.question_type === "CB") {
            return selectedAnswers[index] || [];
          } else {
            return selectedAnswers[index] || null;
          }
        });

        formattedAnswers = formatAnswers(questions, allAnswers);
        answeredCount = countAnswer(formattedAnswers);
        status = answeredCount < questions.length ? "ABANDONED" : "COMPLETED";
      }

      const payload = {
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        answers: formattedAnswers,
        status: status,
      };

      console.log("Submitting test with payload:", payload);

      const resultData = await addResult(payload);
      
      // Create bridge record
      const bridgePayload = {
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        result_id: resultData.result_id,
      };

      console.log("Creating bridge with:", bridgePayload);
      await addBridge(bridgePayload);

      navigate("/completed-test", {
        state: {
          resultData: resultData,
          quizData: quizData,
          questions: questions,
          applicantData: applicantData,
        },
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [quizData, questions, navigate]);

  const handleTimeUp = useCallback(() => {
    if (isSubmitting) return;
    return {
      type: "timeup",
      title: "⏰ Time's Up",
      message: "Time is up! Your answers will be submitted automatically.",
    };
  }, [isSubmitting]);

  useEffect(() => {
    if (quizData) {
      setTimeRemaining(quizData.time_limit * 60);
    }
  }, [quizData]);

  useEffect(() => {
    if (timeRemaining <= 0 || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitting]);

  return {
    timeRemaining: formatTime(timeRemaining),
    rawTimeRemaining: timeRemaining,
    isSubmitting,
    percentage,
    handleTimeUp,
    submitTest,
    updateProgress
  };
};