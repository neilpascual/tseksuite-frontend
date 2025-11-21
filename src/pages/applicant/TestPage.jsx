import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ClockIcon from "../../assets/Clock.svg";
import Footer from "../../components/applicant/Footer";
import { Breadcrumbs, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { getQuestions, getOptions, addResult, addBridge } from "../../../api/api";
import { countAnswer, formatAnswers, getQuestionTypeLabel } from "../../../helpers/helpers";

const ApplicantTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [applicantData, setApplicantData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percentage, setPercentage] = useState(50);

  // Modal states
  const [modalState, setModalState] = useState({
    open: false,
    type: '', 
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Helper function to open modal
  const openModal = (type, title, message, onConfirm, showCancel = false) => {
    setModalState({
      open: true,
      type,
      title,
      message,
      onConfirm,
      showCancel
    });
  };

  // Helper function to close modal
  const closeModal = () => {
    setModalState({
      open: false,
      type: '',
      title: '',
      message: '',
      onConfirm: null,
      showCancel: false
    });
  };

  useEffect(() => {
    const selectedQuiz =
      location.state?.quizData ||
      JSON.parse(localStorage.getItem("selectedQuiz") || "null");

    const applicant =
      location.state?.applicantData ||
      JSON.parse(localStorage.getItem("applicantData") || "{}");

    if (!selectedQuiz || !applicant.examiner_id) {
      openModal(
        'error',
        '⚠️ Error',
        'No quiz selected or applicant data missing. Redirecting...',
        () => {
          closeModal();
          navigate("/quiz-selection");
        }
      );
      return;
    }

    setQuizData(selectedQuiz);
    setApplicantData(applicant);
    setTimeRemaining(selectedQuiz.time_limit * 60);
    fetchQuestions(selectedQuiz.quiz_id);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0 || loading || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, loading, isSubmitting]);

  // Separate effect to handle timeout
  useEffect(() => {
    if (timeRemaining === 0 && !loading && !isSubmitting) {
      handleTimeUp();
    }
  }, [timeRemaining, loading, isSubmitting]);

  useEffect(() => {
    if (questions.length > 0) {
      const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
      setPercentage(percent);
    }
  }, [currentQuestionIndex, questions]);

  const fetchQuestions = async (quizId) => {
    try {
      setLoading(true);

      const questionsData = await getQuestions(quizId);

      const questionsWithOptions = await Promise.all(
        questionsData.map(async (question) => {
          try {
            const options = await getOptions(question.question_id)

            return {
              ...question,
              options: options.map((opt) => ({
                answer_id: opt.answer_id,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
              })),
              explanation: question.explanation || "",
            };
          } catch (err) {
            console.error(
              `Error fetching options for question ${question.question_id}:`,
              err
            );
            return { ...question, options: [], explanation: question.explanation || "" };
          }
        })
      );

      setQuestions(questionsWithOptions);
      setUserAnswers(new Array(questionsWithOptions.length).fill(null));
    } catch (error) {
      console.error("Error fetching questions:", error);
      openModal(
        'error',
        '⚠️ Error',
        'Failed to load questions. Please try again.',
        () => {
          closeModal();
          navigate("/quiz-selection");
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    openModal(
      'timeup',
      '⏰ Time\'s Up',
      'Time is up! Your answers will be submitted automatically.',
      async () => {
        closeModal();
        await submitTest();
      }
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerId) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.question_type === "CB") {
      setSelectedAnswers((prev) => {
        if (prev.includes(answerId)) {
          return prev.filter((id) => id !== answerId);
        } else {
          return [...prev, answerId];
        }
      });
    } else {
      setSelectedAnswer(answerId);
    }
  };

  const handleNext = () => {
    if (isSubmitting) return;

    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.question_type === "CB") {
      if (selectedAnswers.length === 0) {
        openModal(
          'validation',
          '⚠️ Selection Needed',
          'Please select at least one answer before proceeding.',
          closeModal
        );
        return;
      }
    } else if (currentQuestion.question_type !== "DESC") {
      if (selectedAnswer === null) {
        openModal(
          'validation',
          '⚠️ Answer Required',
          'Please select an answer before proceeding.',
          closeModal
        );
        return;
      }
    }

    const newUserAnswers = [...userAnswers];
    if (currentQuestion.question_type === "CB") {
      newUserAnswers[currentQuestionIndex] = selectedAnswers;
    } else {
      newUserAnswers[currentQuestionIndex] = selectedAnswer;
    }
    setUserAnswers(newUserAnswers);

    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
    } else {
      submitTest(newUserAnswers);
    }
  };

  const submitTest = async (answers = userAnswers) => {
    try {
      if (!quizData || !applicantData) {
        openModal(
          'error',
          '⚠️ Error',
          'Quiz or applicant data not found. Cannot submit test.',
          closeModal
        );
        return;
      }

      const formattedAnswers = formatAnswers(questions, answers)
      const answeredCount = countAnswer(formattedAnswers)

      const status = answeredCount < questions.length ? "ABANDONED" : "COMPLETED";

      const payload = {
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        answers: formattedAnswers,
        status: status,
      };

      const resultData = await addResult(payload)

      await addBridge({ examiner_id: applicantData.examiner_id, quiz_id: quizData.quiz_id, result_id: resultData.result_id })

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
      openModal(
        'error',
        '⚠️ Submission Error',
        error.response?.data?.message || 'Failed to submit test. Please try again.',
        closeModal
      );
    }
  };

  const handleBackToHome = () => {
    openModal(
      'exit',
      '⚠️ Exit Test',
      'Are you sure you want to exit? Your progress will be lost.',
      () => {
        closeModal();
        navigate("/test-instructions");
      },
      true // Show cancel button
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-6">
            This quiz doesn't have any questions yet.
          </p>
          <button
            onClick={() => navigate("/quiz-selection")}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const breadcrumbs = [
    <Typography 
      underline="hover" 
      key="1" 
      color="inherit" 
      sx={{ 
        fontSize: {
          xs: 14,
          sm: 16,
          md: 18
        }
      }}
    >
      {getQuestionTypeLabel(currentQuestion.question_type)}
    </Typography>,
    <Typography 
      key="2" 
      sx={{ 
        color: '#2E99B0', 
        fontSize: {
          xs: 14,
          sm: 16,
          md: 18
        } 
      }}
    >
      Question {currentQuestionIndex + 1} / {questions.length}
    </Typography>
  ];

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Progress Bar */}
      <div 
        className="sticky top-0 h-1.5 bg-[#2E99B0] transition-all duration-300 ease-out z-50"
        style={{ width: `${percentage}%` }}
      />
        
      {/* Header Section with consistent padding */}
      <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 pb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-normal text-base">Exit Test</span>
          </button>

          <div
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200"
            style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}
          >
            <img src={ClockIcon} className="w-5 h-5" alt="clock" />
            <span className="font-semibold text-gray-900 text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content with consistent padding and spacing */}
      <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs and Question Section */}
          <div className="mb-8">
            <Stack spacing={3}>
              <Breadcrumbs separator="›" sx={{ mb: 2 }}>
                {breadcrumbs}
              </Breadcrumbs>
              <Typography 
                sx={{ 
                  color: '#1a1a1a',
                  fontSize: {
                    xs: 20,
                    sm: 24,
                    md: 28,
                    lg: 32
                  },
                  fontWeight: 'bold',
                  lineHeight: 1.3
                }}
              >
                {currentQuestion.question_text}
              </Typography>
            </Stack>
          </div>

          {/* Options Grid with consistent spacing */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => {
                const isSelected =
                  currentQuestion.question_type === "CB"
                    ? selectedAnswers.includes(option.answer_id)
                    : selectedAnswer === option.answer_id;
                return (
                  <button
                    key={option.answer_id}
                    onClick={() => handleAnswerSelect(option.answer_id)}
                    className={`p-5 rounded-lg text-left text-base font-normal transition-all duration-200 border-2 ${
                      isSelected
                        ? "bg-cyan-50 text-black border-cyan-500"
                        : "bg-gray-50 text-black hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {currentQuestion.question_type === "CB" ? (
                        <div
                          className={`w-5 h-5 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-cyan-600 border-cyan-600"
                              : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <div
                          className={`w-5 h-5 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-cyan-600" : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
                          )}
                        </div>
                      )}
                      <span className="leading-relaxed">{option.option_text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button with consistent spacing */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-12 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-base ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  {currentQuestionIndex < questions.length - 1
                    ? "Next"
                    : "Submit"}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Modal Component */}
      <Dialog
        open={modalState.open}
        onClose={() => {
          // Only allow closing for validation and error modals
          if (modalState.type === 'validation' || modalState.type === 'error') {
            closeModal();
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '20px', 
          fontWeight: 'bold',
          color: '#1a1a1a',
          pb: 1
        }}>
          {modalState.title}
        </DialogTitle>
        
        <DialogContent>
          <Typography sx={{ fontSize: '16px', color: '#4a5568', lineHeight: 1.6 }}>
            {modalState.message}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ padding: '16px 24px' }}>
          {modalState.showCancel && (
            <Button 
              onClick={closeModal}
              sx={{ 
                color: '#6b7280',
                textTransform: 'none',
                fontSize: '15px',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              Cancel 
            </Button>
          )}
          
          <Button 
            onClick={modalState.onConfirm}
            variant="contained"
            sx={{ 
              bgcolor: modalState.type === 'exit' ? '#dc2626' : '#2E99B0',
              '&:hover': { 
                bgcolor: modalState.type === 'exit' ? '#b91c1c' : '#267a8d' 
              },
              textTransform: 'none',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.1)'
            }}
          >
            {modalState.type === 'exit' ? 'Exit Test' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicantTestPage;