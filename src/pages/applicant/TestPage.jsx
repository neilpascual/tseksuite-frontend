import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';

import ClockIcon from "../../assets/Clock.svg";
import Footer from "../../components/applicant/Footer";
import { Breadcrumbs, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { getQuestions, getOptions, addResult, addBridge } from "../../../api/api";
import { countAnswer, formatAnswers, getQuestionTypeLabel } from "../../../helpers/helpers";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ApplicantTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [descriptiveAnswer, setDescriptiveAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [applicantData, setApplicantData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percentage, setPercentage] = useState(50);
  
  // NEW STATE: Toggle for all questions view
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // PDF states
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [pdfScale, setPdfScale] = useState(1.0);

  // Modal states
  const [modalState, setModalState] = useState({
    open: false,
    type: '', 
    title: '',
    message: '',
    onConfirm: null,
    showCancel: false
  });

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Toggle between single question and all questions view
  const toggleQuestionView = () => {
    setShowAllQuestions(!showAllQuestions);
  };

  // Initial data loading
  useEffect(() => {
    const selectedQuiz = location.state?.quizData || JSON.parse(localStorage.getItem("selectedQuiz") || "null");
    const applicant = location.state?.applicantData || JSON.parse(localStorage.getItem("applicantData") || "{}");

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
  }, [location.state, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0 || loading || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, loading, isSubmitting]);

  // Progress bar percentage
  useEffect(() => {
    if (questions.length > 0) {
      const percent = ((currentQuestionIndex + 1) / questions.length) * 100;
      setPercentage(percent);
    } else if (quizData?.pdf_link) {
      setPercentage(100);
    }
  }, [currentQuestionIndex, questions, quizData]);

  // Load saved answer when question changes
  useEffect(() => {
    if (questions.length === 0 || showAllQuestions) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const savedAnswer = userAnswers[currentQuestionIndex];
    
    if (currentQuestion.question_type === "DESC") {
      setDescriptiveAnswer(savedAnswer || "");
    } else if (currentQuestion.question_type === "CB") {
      setSelectedAnswers(savedAnswer || []);
    } else {
      setSelectedAnswer(savedAnswer || null);
    }
  }, [currentQuestionIndex, questions, userAnswers, showAllQuestions]);

  // Handle answer selection for specific question (for all questions view)
  const handleAnswerSelectForQuestion = (questionIndex, answerId) => {
    const question = questions[questionIndex];
    
    if (question.question_type === "CB") {
      const currentAnswers = userAnswers[questionIndex] || [];
      const newAnswers = currentAnswers.includes(answerId) 
        ? currentAnswers.filter(id => id !== answerId)
        : [...currentAnswers, answerId];
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[questionIndex] = newAnswers;
      setUserAnswers(newUserAnswers);
    } else {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[questionIndex] = answerId;
      setUserAnswers(newUserAnswers);
    }
  };

  // Handle descriptive answer change for specific question
  const handleDescriptiveAnswerChange = (questionIndex, value) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[questionIndex] = value;
    setUserAnswers(newUserAnswers);
  };

  // Jump to specific question from all questions view
  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowAllQuestions(false);
  };

  const fetchQuestions = async (quizId) => {
    try {
      setLoading(true);
      const questionsData = await getQuestions(quizId);

      const questionsWithOptions = await Promise.all(
        questionsData.map(async (question) => {
          try {
            const options = await getOptions(question.question_id);
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
            console.error(`Error fetching options for question ${question.question_id}:`, err);
            return { ...question, options: [], explanation: question.explanation || "" };
          }
        })
      );

      setQuestions(questionsWithOptions);
      setUserAnswers(new Array(questionsWithOptions.length).fill(null));
    } catch (error) {
      console.error("Error fetching questions:", error);
      if (!quizData?.pdf_link) {
        openModal(
          'error',
          '⚠️ Error',
          'Failed to load questions. Please try again.',
          () => {
            closeModal();
            navigate("/quiz-selection");
          }
        );
      } else {
        setQuestions([]);
        setUserAnswers([]);
      }
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

    if (quizData?.pdf_link && questions.length === 0) {
      submitTest();
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Validation based on question type
    if (currentQuestion.question_type === "DESC") {
      if (!descriptiveAnswer.trim()) {
        openModal(
          'validation',
          '⚠️ Answer Required',
          'Please provide an answer before proceeding.',
          closeModal
        );
        return;
      }
    } else if (currentQuestion.question_type === "CB") {
      if (selectedAnswers.length === 0) {
        openModal(
          'validation',
          '⚠️ Selection Needed',
          'Please select at least one answer before proceeding.',
          closeModal
        );
        return;
      }
    } else {
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

    // Save answer
    const newUserAnswers = [...userAnswers];
    if (currentQuestion.question_type === "DESC") {
      newUserAnswers[currentQuestionIndex] = descriptiveAnswer.trim();
    } else if (currentQuestion.question_type === "CB") {
      newUserAnswers[currentQuestionIndex] = selectedAnswers;
    } else {
      newUserAnswers[currentQuestionIndex] = selectedAnswer;
    }
    setUserAnswers(newUserAnswers);

    localStorage.setItem('userAnswers', JSON.stringify(newUserAnswers));

    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setDescriptiveAnswer("");
    } else {
      submitTest(newUserAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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

      let formattedAnswers = [];
      let answeredCount = 0;
      let status = "COMPLETED";

      if (quizData.pdf_link && questions.length === 0) {
        formattedAnswers = [];
        answeredCount = 0;
        status = "COMPLETED";
      } else {
        formattedAnswers = formatAnswers(questions, answers);
        answeredCount = countAnswer(formattedAnswers);
        status = answeredCount < questions.length ? "ABANDONED" : "COMPLETED";
      }

      const payload = {
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        answers: formattedAnswers,
        status: status,
      };

      const resultData = await addResult(payload);
      await addBridge({ 
        examiner_id: applicantData.examiner_id, 
        quiz_id: quizData.quiz_id, 
        result_id: resultData.result_id 
      });

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
      true
    );
  };

  // PDF handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfError("Failed to load PDF document. You can still view it by opening the link in a new tab.");
    setPdfLoading(false);
  };

  const goToPreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setPdfScale(prev => Math.min(prev + 0.25, 2.0));
  };

  const zoomOut = () => {
    setPdfScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setPdfScale(1.0);
  };

  // Convert Google Drive link to embeddable PDF link
  const getDirectPdfLink = (driveLink) => {
    if (!driveLink) return null;
    
    const match = driveLink.match(/\/d\/([^\/]+)/);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    return driveLink;
  };

  // Render single question view
  const renderSingleQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 flex flex-col overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">Progress</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-600">
              Q{currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Type Badge */}
        <div className="mb-3 sm:mb-4">
          <span className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
            {getQuestionTypeLabel(currentQuestion.question_type)}
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="flex-1 mb-4 sm:mb-6">
          {currentQuestion.question_type === "DESC" ? (
            <div>
              <textarea
                value={descriptiveAnswer}
                onChange={(e) => setDescriptiveAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-3 sm:p-4 rounded-xl text-sm sm:text-base border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none resize-none transition-all"
                rows={isMobile ? 8 : 12}
                style={{ minHeight: isMobile ? '200px' : '300px' }}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs sm:text-sm text-gray-500">Characters: {descriptiveAnswer.length}</p>
                <p className="text-xs text-gray-400 hidden sm:block">Press Tab to format</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.question_type === "CB" 
                  ? selectedAnswers.includes(option.answer_id)
                  : selectedAnswer === option.answer_id;
                
                return (
                  <button
                    key={option.answer_id}
                    onClick={() => handleAnswerSelect(option.answer_id)}
                    className={`w-full p-3 sm:p-4 rounded-xl text-left text-sm sm:text-base transition-all duration-200 border-2 ${
                      isSelected 
                        ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-500 shadow-md sm:transform sm:scale-[1.02]" 
                        : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      {currentQuestion.question_type === "CB" ? (
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected ? "bg-cyan-600 border-cyan-600" : "border-gray-400"
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? "border-cyan-600 bg-cyan-600" : "border-gray-400"
                        }`}>
                          {isSelected && (
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                      )}
                      <span className={`leading-relaxed ${isSelected ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                        {option.option_text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation and Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={toggleQuestionView}
              className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              All Questions
            </button>
            
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
            )}
          </div>
          
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm sm:text-base">Submitting...</span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-base">
                  {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
                </span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render all questions view
  const renderAllQuestions = () => {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 flex flex-col overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">All Questions</h2>
          <button
            onClick={toggleQuestionView}
            className="w-full sm:w-auto px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Single View
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 max-h-[60vh] sm:max-h-[600px] overflow-y-auto">
          {questions.map((question, index) => (
            <div key={question.question_id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-cyan-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-semibold">
                    Q{index + 1}
                  </span>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                    {getQuestionTypeLabel(question.question_type)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => jumpToQuestion(index)}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-medium transition-colors"
                  >
                    Go to Question
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-3 line-clamp-2">
                {question.question_text}
              </h3>

              {question.question_type === "DESC" ? (
                <textarea
                  value={userAnswers[index] || ""}
                  onChange={(e) => handleDescriptiveAnswerChange(index, e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-200 focus:outline-none resize-none text-sm"
                  rows={3}
                />
              ) : (
                <div className="space-y-2">
                  {question.options.map((option) => {
                    const isSelected = question.question_type === "CB" 
                      ? (userAnswers[index] || []).includes(option.answer_id)
                      : userAnswers[index] === option.answer_id;
                    
                    return (
                      <div
                        key={option.answer_id}
                        className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? "bg-cyan-50 border-cyan-500" 
                            : "bg-gray-50 border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => handleAnswerSelectForQuestion(index, option.answer_id)}
                      >
                        <div className="flex items-start gap-2">
                          {question.question_type === "CB" ? (
                            <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center ${
                              isSelected ? "bg-cyan-600 border-cyan-600" : "border-gray-400"
                            }`}>
                              {isSelected && (
                                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          ) : (
                            <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-cyan-600" : "border-gray-400"
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>}
                            </div>
                          )}
                          <span className="text-xs sm:text-sm text-gray-700 line-clamp-2">{option.option_text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
                {userAnswers[index] ? (
                  <span className="text-green-600">✓ Answered</span>
                ) : (
                  <span className="text-red-500">✗ Not answered</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={() => submitTest()}
            disabled={isSubmitting}
            className={`w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 sm:px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm sm:text-base">Submitting...</span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-base">Submit Quiz</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render PDF Viewer for mobile
  const renderPdfViewer = () => {
    const directPdfLink = getDirectPdfLink(quizData.pdf_link);
    
    if (pdfError) {
      return (
        <div className="text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium text-sm sm:text-base mb-2">Failed to load PDF</p>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 px-2">{pdfError}</p>
          <a 
            href={directPdfLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open PDF
          </a>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              {pdfLoading ? "Loading..." : `Page ${pageNumber} of ${numPages || '?'}`}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={zoomOut}
              disabled={pdfScale <= 0.5}
              className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Zoom Out"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-xs sm:text-sm text-gray-600 min-w-8 sm:min-w-12 text-center">
              {Math.round(pdfScale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={pdfScale >= 2.0}
              className="p-1 sm:p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Zoom In"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-center bg-gray-100 p-2 sm:p-4 min-h-[300px] sm:min-h-[600px]">
          {directPdfLink && directPdfLink.includes('drive.google.com') ? (
            <iframe
              src={directPdfLink}
              width="100%"
              height={isMobile ? "400" : "600"}
              style={{ 
                border: 'none',
                maxWidth: '100%',
                transform: `scale(${pdfScale})`,
                transformOrigin: 'top center'
              }}
              title="PDF Document"
              onLoad={() => setPdfLoading(false)}
              onError={() => {
                setPdfError("Failed to load PDF. Please try opening in a new tab.");
                setPdfLoading(false);
              }}
            />
          ) : (
            <Document
              file={directPdfLink}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                  <span className="ml-2 sm:ml-3 text-gray-600 text-sm">Loading PDF...</span>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber}
                scale={pdfScale}
                loading={
                  <div className="flex items-center justify-center py-8 sm:py-12">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                  </div>
                }
              />
            </Document>
          )}
        </div>

        {numPages > 1 && directPdfLink && !directPdfLink.includes('drive.google.com') && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 border-t">
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            <span className="text-xs sm:text-sm text-gray-600 px-2">
              {pageNumber} / {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
            >
              Next
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading {quizData?.pdf_link ? 'PDF test' : 'questions'}...</p>
        </div>
      </div>
    );
  }

  // Check if we have questions to render
  const hasPdfReference = quizData?.pdf_link;
  const hasQuestions = questions.length > 0;

  // Handle PDF tests with no questions
  if (hasPdfReference && !hasQuestions) {
    return (
      <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div className="sticky top-0 h-1.5 bg-[#2E99B0] transition-all duration-300 ease-out z-50" style={{ width: `100%` }} />
          
        <div className="px-4 sm:px-6 lg:px-12 xl:px-24 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <button onClick={handleBackToHome} className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-normal text-sm sm:text-base">Exit Test</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200" style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}>
              <img src={ClockIcon} className="w-4 h-4 sm:w-5 sm:h-5" alt="clock" />
              <span className="font-semibold text-gray-900 text-base sm:text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 sm:px-6 lg:px-12 xl:px-24 pb-8">
          <div className="max-w-full mx-auto">
            <div className="mb-4 sm:mb-6">
              <Stack spacing={2}>
                <Typography sx={{ color: '#1a1a1a', fontSize: { xs: 18, sm: 20, md: 24, lg: 28 }, fontWeight: 'bold', lineHeight: 1.3 }}>
                  PDF Test: {quizData.quiz_name}
                </Typography>
                <Typography sx={{ color: '#4a5568', fontSize: { xs: 14, sm: 16 }, lineHeight: 1.5 }}>
                  Please review the PDF document below. When you're ready, click the submit button to complete the test.
                </Typography>
              </Stack>
            </div>

            {/* PDF Viewer */}
            <div className="mb-6">
              {renderPdfViewer()}
            </div>

            {/* Submit Button for PDF Test */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 sm:px-12 py-3 sm:py-3.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Test
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <Footer />

        <Dialog open={modalState.open} onClose={closeModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', padding: '8px', m: 2 } }}>
          <DialogTitle sx={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', pb: 1 }}>{modalState.title}</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: '14px', color: '#4a5568', lineHeight: 1.6 }}>{modalState.message}</Typography>
          </DialogContent>
          <DialogActions sx={{ padding: '12px 16px', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
            {modalState.showCancel && (
              <Button onClick={closeModal} sx={{ 
                color: '#6b7280', 
                textTransform: 'none', 
                fontSize: '14px', 
                fontWeight: 500, 
                '&:hover': { backgroundColor: '#f3f4f6' },
                width: isMobile ? '100%' : 'auto'
              }}>
                Cancel 
              </Button>
            )}
            <Button onClick={modalState.onConfirm} variant="contained" sx={{ 
                bgcolor: modalState.type === 'exit' ? '#dc2626' : '#2E99B0',
                '&:hover': { bgcolor: modalState.type === 'exit' ? '#b91c1c' : '#267a8d' },
                textTransform: 'none', 
                fontSize: '14px', 
                fontWeight: 600, 
                boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.1)',
                width: isMobile ? '100%' : 'auto'
              }}>
              {modalState.type === 'exit' ? 'Exit Test' : 'OK'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // Regular Quiz Layout with questions
  if (!hasQuestions) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">This quiz doesn't have any questions yet.</p>
          <button onClick={() => navigate("/quiz-selection")} className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm sm:text-base">
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="sticky top-0 h-1.5 bg-[#2E99B0] transition-all duration-300 ease-out z-50" style={{ width: `${percentage}%` }} />
        
      <div className="px-4 sm:px-6 lg:px-12 xl:px-24 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={handleBackToHome} className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-normal text-sm sm:text-base">Exit Test</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200" style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}>
            <img src={ClockIcon} className="w-4 h-4 sm:w-5 sm:h-5" alt="clock" />
            <span className="font-semibold text-gray-900 text-base sm:text-lg">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-12 xl:px-24 pb-8">
        <div className="min-h-screen py-4">
          <div className="max-w-[1200px] mx-auto">
            {/* Split Screen Layout - PDF on left, Questions on right */}
            {hasPdfReference ? (
              <div className={`flex flex-col ${isMobile ? 'space-y-4' : 'lg:grid lg:grid-cols-[60%_40%] lg:gap-6'} min-h-[calc(100vh-10rem)]`}>
                {/* LEFT SIDE - PDF VIEWER */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
                  {/* PDF Header */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-cyan-600 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-base sm:text-lg">Reference Document</h3>
                          <p className="text-xs sm:text-sm text-blue-100">{quizData.title || 'Study Material'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* PDF Viewer Area */}
                  <div className="flex-1 overflow-auto bg-gray-800 p-3 sm:p-6">
                    {renderPdfViewer()}
                  </div>
                </div>

                {/* RIGHT SIDE - QUESTIONS */}
                <div className={isMobile ? "" : "lg:h-full"}>
                  {showAllQuestions ? renderAllQuestions() : renderSingleQuestion()}
                </div>
              </div>
            ) : (
              // NO PDF - Regular single column layout
              <div className="max-w-4xl mx-auto">
                {showAllQuestions ? renderAllQuestions() : (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 lg:p-8">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-gray-600">Progress</span>
                        <span className="text-xs sm:text-sm font-bold text-cyan-600">
                          Q{currentQuestionIndex + 1} / {questions.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Stack spacing={2}>
                        <Breadcrumbs separator="›" sx={{ mb: 1 }}>
                          <Typography sx={{ fontSize: { xs: 11, sm: 12, md: 14 } }}>
                            {getQuestionTypeLabel(currentQuestion.question_type)}
                          </Typography>
                          <Typography sx={{ color: '#2E99B0', fontSize: { xs: 11, sm: 12, md: 14 } }}>
                            Question {currentQuestionIndex + 1} / {questions.length}
                          </Typography>
                        </Breadcrumbs>
                        <Typography sx={{ color: '#1a1a1a', fontSize: { xs: 18, sm: 20, md: 24, lg: 28 }, fontWeight: 'bold', lineHeight: 1.3 }}>
                          {currentQuestion.question_text}
                        </Typography>
                      </Stack>
                    </div>

                    <div className="mb-6">
                      {currentQuestion.question_type === "DESC" ? (
                        <div>
                          <textarea
                            value={descriptiveAnswer}
                            onChange={(e) => setDescriptiveAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full p-4 rounded-xl text-sm sm:text-base font-normal border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none resize-none"
                            rows={isMobile ? 8 : 10}
                            style={{ minHeight: isMobile ? '200px' : '250px' }}
                          />
                          <p className="text-xs sm:text-sm text-gray-500 mt-2">Characters: {descriptiveAnswer.length}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentQuestion.options.map((option) => {
                            const isSelected = currentQuestion.question_type === "CB" 
                              ? selectedAnswers.includes(option.answer_id)
                              : selectedAnswer === option.answer_id;
                            
                            return (
                              <button
                                key={option.answer_id}
                                onClick={() => handleAnswerSelect(option.answer_id)}
                                className={`p-4 rounded-xl text-left text-sm sm:text-base font-normal transition-all duration-200 border-2 ${
                                  isSelected 
                                    ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-500 shadow-md" 
                                    : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                <div className="flex items-start gap-2 sm:gap-3">
                                  {currentQuestion.question_type === "CB" ? (
                                    <div className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center ${
                                      isSelected ? "bg-cyan-600 border-cyan-600" : "border-gray-400"
                                    }`}>
                                      {isSelected && (
                                        <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                  ) : (
                                    <div className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                                      isSelected ? "border-cyan-600" : "border-gray-400"
                                    }`}>
                                      {isSelected && <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-600 rounded-full"></div>}
                                    </div>
                                  )}
                                  <span className="leading-relaxed text-sm sm:text-base">{option.option_text}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 pt-4">
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={toggleQuestionView}
                          className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                          All Questions
                        </button>
                        
                        {currentQuestionIndex > 0 && (
                          <button
                            onClick={handlePrevious}
                            className="flex-1 sm:flex-none px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </button>
                        )}
                      </div>

                      <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 sm:px-12 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg hover:shadow-xl ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm sm:text-base">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm sm:text-base">
                              {currentQuestionIndex < questions.length - 1 ? "Next" : "Submit"}
                            </span>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <Dialog open={modalState.open} onClose={closeModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', padding: '8px', m: 2 } }}>
        <DialogTitle sx={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', pb: 1 }}>{modalState.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '14px', color: '#4a5568', lineHeight: 1.6 }}>{modalState.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '12px 16px', flexDirection: isMobile ? 'column' : 'row', gap: 1 }}>
          {modalState.showCancel && (
            <Button onClick={closeModal} sx={{ 
              color: '#6b7280', 
              textTransform: 'none', 
              fontSize: '14px', 
              fontWeight: 500, 
              '&:hover': { backgroundColor: '#f3f4f6' },
              width: isMobile ? '100%' : 'auto'
            }}>
              Cancel 
            </Button>
          )}
          <Button onClick={modalState.onConfirm} variant="contained" sx={{ 
              bgcolor: modalState.type === 'exit' ? '#dc2626' : '#2E99B0',
              '&:hover': { bgcolor: modalState.type === 'exit' ? '#b91c1c' : '#267a8d' },
              textTransform: 'none', 
              fontSize: '14px', 
              fontWeight: 600, 
              boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.1)',
              width: isMobile ? '100%' : 'auto'
            }}>
            {modalState.type === 'exit' ? 'Exit Test' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicantTestPage;