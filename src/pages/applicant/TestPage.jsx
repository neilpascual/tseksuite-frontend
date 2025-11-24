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

  // Initial data loading
  useEffect(() => {
    const selectedQuiz = location.state?.quizData || JSON.parse(localStorage.getItem("selectedQuiz") || "null");
    const applicant = location.state?.applicantData || JSON.parse(localStorage.getItem("applicantData") || "{}");

    console.log("Selected Quiz Data:", selectedQuiz);
    console.log("Applicant Data:", applicant);

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
    
    // Always try to fetch questions, even for PDF tests
    console.log("Fetching questions for quiz...");
    fetchQuestions(selectedQuiz.quiz_id);
  }, [location.state?.quizData, location.state?.applicantData]);

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
    if (questions.length === 0) return;
    
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
  }, [currentQuestionIndex, questions, userAnswers]);

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
      // For PDF tests, it's okay if there are no questions
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
        // For PDF tests, set empty questions and proceed
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

    // For PDF tests with no questions, submit immediately
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

      // For PDF tests with no questions, submit with special handling
      let formattedAnswers = [];
      let answeredCount = 0;
      let status = "COMPLETED";

      if (quizData.pdf_link && questions.length === 0) {
        // PDF test with no questions - treat as completed with no answers
        formattedAnswers = [];
        answeredCount = 0;
        status = "COMPLETED";
      } else {
        // Regular quiz or PDF test with questions
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

      console.log("Submitting test with payload:", payload);

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
    console.log("PDF loaded successfully, pages:", numPages);
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
    
    console.log("Original PDF Link:", driveLink);
    
    // Extract file ID from Google Drive link
    const match = driveLink.match(/\/d\/([^\/]+)/);
    if (match) {
      const fileId = match[1];
      const embedLink = `https://drive.google.com/file/d/${fileId}/preview`;
      console.log("Converted PDF Link:", embedLink);
      return embedLink;
    }
    
    return driveLink;
  };

  // Render PDF Viewer
  const renderPdfViewer = () => {
    const directPdfLink = getDirectPdfLink(quizData.pdf_link);
    
    if (pdfError) {
      return (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Failed to load PDF</p>
          <p className="text-gray-600 text-sm mb-4">{pdfError}</p>
          <a 
            href={directPdfLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open PDF in New Tab
          </a>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {pdfLoading ? "Loading PDF..." : `Page ${pageNumber} of ${numPages || '?'}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={pdfScale <= 0.5}
              className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-sm text-gray-600 min-w-12 text-center">
              {Math.round(pdfScale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={pdfScale >= 2.0}
              className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={resetZoom}
              className="p-2 text-gray-600 hover:text-gray-800"
              title="Reset Zoom"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-center bg-gray-100 p-4 min-h-[600px]">
          {directPdfLink && directPdfLink.includes('drive.google.com') ? (
            <iframe
              src={directPdfLink}
              width="100%"
              height="600"
              style={{ 
                border: 'none',
                maxWidth: '800px',
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
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading PDF document...</span>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber}
                scale={pdfScale}
                loading={
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                  </div>
                }
              />
            </Document>
          )}
        </div>

        {numPages > 1 && directPdfLink && !directPdfLink.includes('drive.google.com') && (
          <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 border-t">
            <button
              onClick={goToPreviousPage}
              disabled={pageNumber <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {quizData?.pdf_link ? 'PDF test' : 'questions'}...</p>
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
          
        <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 pb-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button onClick={handleBackToHome} className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-normal text-base">Exit Test</span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200" style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}>
              <img src={ClockIcon} className="w-5 h-5" alt="clock" />
              <span className="font-semibold text-gray-900 text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
          <div className="max-w-[1800px] mx-auto">
            <div className="mb-6">
              <Stack spacing={3}>
                <Typography sx={{ color: '#1a1a1a', fontSize: { xs: 20, sm: 24, md: 28, lg: 32 }, fontWeight: 'bold', lineHeight: 1.3 }}>
                  PDF Test: {quizData.quiz_name}
                </Typography>
                <Typography sx={{ color: '#4a5568', fontSize: { xs: 16, sm: 18 }, lineHeight: 1.5 }}>
                  Please review the PDF document below. When you're ready, click the submit button to complete the test.
                </Typography>
              </Stack>
            </div>

            {/* PDF Viewer */}
            <div className="mb-8">
              {renderPdfViewer()}
            </div>

            {/* Submit Button for PDF Test */}
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
                    Submit Test
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <Footer />

        <Dialog open={modalState.open} onClose={closeModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', padding: '8px' } }}>
          <DialogTitle sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', pb: 1 }}>{modalState.title}</DialogTitle>
          <DialogContent>
            <Typography sx={{ fontSize: '16px', color: '#4a5568', lineHeight: 1.6 }}>{modalState.message}</Typography>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            {modalState.showCancel && (
              <Button onClick={closeModal} sx={{ color: '#6b7280', textTransform: 'none', fontSize: '15px', fontWeight: 500, '&:hover': { backgroundColor: '#f3f4f6' } }}>
                Cancel 
              </Button>
            )}
            <Button onClick={modalState.onConfirm} variant="contained" sx={{ 
                bgcolor: modalState.type === 'exit' ? '#dc2626' : '#2E99B0',
                '&:hover': { bgcolor: modalState.type === 'exit' ? '#b91c1c' : '#267a8d' },
                textTransform: 'none', fontSize: '15px', fontWeight: 600, boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.1)'
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">This quiz doesn't have any questions yet.</p>
          <button onClick={() => navigate("/quiz-selection")} className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const breadcrumbs = [
    <Typography underline="hover" key="1" color="inherit" sx={{ fontSize: { xs: 14, sm: 16, md: 18 } }}>
      {getQuestionTypeLabel(currentQuestion.question_type)}
    </Typography>,
    <Typography key="2" sx={{ color: '#2E99B0', fontSize: { xs: 14, sm: 16, md: 18 } }}>
      Question {currentQuestionIndex + 1} / {questions.length}
    </Typography>
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div className="sticky top-0 h-1.5 bg-[#2E99B0] transition-all duration-300 ease-out z-50" style={{ width: `${percentage}%` }} />
        
      <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 pb-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button onClick={handleBackToHome} className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-normal text-base">Exit Test</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200" style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}>
            <img src={ClockIcon} className="w-5 h-5" alt="clock" />
            <span className="font-semibold text-gray-900 text-lg">{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
   <div className="min-h-screen py-4">
      <div className="max-w-[2000px] mx-auto px-4 lg:px-6">
        {/* Split Screen Layout - PDF on left, Questions on right */}
        {hasPdfReference ? (
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 min-h-[calc(100vh-20rem)]">
            {/* LEFT SIDE - ENHANCED PDF VIEWER */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
              {/* PDF Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Reference Document</h3>
                      <p className="text-sm text-blue-100">{quizData.title || 'Study Material'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* PDF Viewer Area - Much Larger */}
              <div className="flex-1 overflow-auto bg-gray-800 p-6">
                {pdfError ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-12 bg-white rounded-lg p-8">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-red-600 text-lg font-semibold mb-2">Failed to load PDF</p>
                      <p className="text-gray-600 text-sm">{pdfError}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    {getDirectPdfLink(quizData.pdf_link) && getDirectPdfLink(quizData.pdf_link).includes('drive.google.com') ? (
                      <div className="bg-white rounded-lg shadow-2xl w-full" style={{ maxWidth: '900px' }}>
                        <iframe
                          src={getDirectPdfLink(quizData.pdf_link)}
                          width="100%"
                          style={{ 
                            border: 'none',
                            minHeight: '800px',
                            height: '100%',
                            borderRadius: '8px'
                          }}
                          title="PDF Document"
                          onLoad={() => setPdfLoading(false)}
                          onError={() => {
                            setPdfError("Failed to load PDF.");
                            setPdfLoading(false);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg shadow-2xl">
                        <Document
                          file={getDirectPdfLink(quizData.pdf_link)}
                          onLoadSuccess={onDocumentLoadSuccess}
                          onLoadError={onDocumentLoadError}
                          loading={
                            <div className="flex items-center justify-center py-20">
                              <div className="text-center">
                                <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <span className="text-white text-sm font-medium">Loading PDF...</span>
                              </div>
                            </div>
                          }
                        >
                          <Page pageNumber={pageNumber} scale={pdfScale} />
                        </Document>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PDF Navigation Footer */}
              {numPages > 1 && getDirectPdfLink(quizData.pdf_link) && !getDirectPdfLink(quizData.pdf_link).includes('drive.google.com') && (
                <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-center gap-4">
                  <button 
                    onClick={goToPreviousPage}
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm flex items-center gap-2 transition-all text-gray-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button 
                    onClick={goToNextPage}
                    disabled={pageNumber >= numPages}
                    className="px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-sm flex items-center gap-2 transition-all text-gray-700"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT SIDE - QUESTIONS */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col overflow-y-auto">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-cyan-600">
                    Question {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Type Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {getQuestionTypeLabel(currentQuestion.question_type)}
                </span>
              </div>

              {/* Question Text */}
              <div className="mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                  {currentQuestion.question_text}
                </h2>
              </div>

              {/* Answer Options */}
              <div className="flex-1 mb-6">
                {currentQuestion.question_type === "DESC" ? (
                  <div>
                    <textarea
                      value={descriptiveAnswer}
                      onChange={(e) => setDescriptiveAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 rounded-xl text-base border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none resize-none transition-all"
                      rows={12}
                      style={{ minHeight: '300px' }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500">Characters: {descriptiveAnswer.length}</p>
                      <p className="text-xs text-gray-400">Press Tab to format</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = currentQuestion.question_type === "CB" 
                        ? selectedAnswers.includes(option.answer_id)
                        : selectedAnswer === option.answer_id;
                      
                      return (
                        <button
                          key={option.answer_id}
                          onClick={() => handleAnswerSelect(option.answer_id)}
                          className={`w-full p-4 rounded-xl text-left text-base transition-all duration-200 border-2 ${
                            isSelected 
                              ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-500 shadow-md transform scale-[1.02]" 
                              : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {currentQuestion.question_type === "CB" ? (
                              <div className={`w-6 h-6 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected ? "bg-cyan-600 border-cyan-600" : "border-gray-400"
                              }`}>
                                {isSelected && (
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            ) : (
                              <div className={`w-6 h-6 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? "border-cyan-600 bg-cyan-600" : "border-gray-400"
                              }`}>
                                {isSelected && (
                                  <div className="w-3 h-3 bg-white rounded-full"></div>
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

              {/* Action Button */}
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? "cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          // NO PDF - Regular single column layout
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-cyan-600">
                    Question {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <Stack spacing={3}>
                  <Breadcrumbs separator="›" sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: { xs: 12, sm: 14, md: 16 } }}>
                      {getQuestionTypeLabel(currentQuestion.question_type)}
                    </Typography>
                    <Typography sx={{ color: '#2E99B0', fontSize: { xs: 12, sm: 14, md: 16 } }}>
                      Question {currentQuestionIndex + 1} / {questions.length}
                    </Typography>
                  </Breadcrumbs>
                  <Typography sx={{ color: '#1a1a1a', fontSize: { xs: 20, sm: 24, md: 28, lg: 32 }, fontWeight: 'bold', lineHeight: 1.3 }}>
                    {currentQuestion.question_text}
                  </Typography>
                </Stack>
              </div>

              <div className="mb-8">
                {currentQuestion.question_type === "DESC" ? (
                  <div>
                    <textarea
                      value={descriptiveAnswer}
                      onChange={(e) => setDescriptiveAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-5 rounded-xl text-base font-normal border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none resize-none"
                      rows={10}
                      style={{ minHeight: '250px' }}
                    />
                    <p className="text-sm text-gray-500 mt-2">Characters: {descriptiveAnswer.length}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option) => {
                      const isSelected = currentQuestion.question_type === "CB" 
                        ? selectedAnswers.includes(option.answer_id)
                        : selectedAnswer === option.answer_id;
                      
                      return (
                        <button
                          key={option.answer_id}
                          onClick={() => handleAnswerSelect(option.answer_id)}
                          className={`p-5 rounded-xl text-left text-base font-normal transition-all duration-200 border-2 ${
                            isSelected 
                              ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-500 shadow-md" 
                              : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {currentQuestion.question_type === "CB" ? (
                              <div className={`w-5 h-5 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center ${
                                isSelected ? "bg-cyan-600 border-cyan-600" : "border-gray-400"
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            ) : (
                              <div className={`w-5 h-5 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? "border-cyan-600" : "border-gray-400"
                              }`}>
                                {isSelected && <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>}
                              </div>
                            )}
                            <span className="leading-relaxed">{option.option_text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-12 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 text-lg shadow-lg hover:shadow-xl ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Quiz"}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      </div>

      <Footer />

      <Dialog open={modalState.open} onClose={closeModal} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', padding: '8px' } }}>
        <DialogTitle sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a', pb: 1 }}>{modalState.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '16px', color: '#4a5568', lineHeight: 1.6 }}>{modalState.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          {modalState.showCancel && (
            <Button onClick={closeModal} sx={{ color: '#6b7280', textTransform: 'none', fontSize: '15px', fontWeight: 500, '&:hover': { backgroundColor: '#f3f4f6' } }}>
              Cancel 
            </Button>
          )}
          <Button onClick={modalState.onConfirm} variant="contained" sx={{ 
              bgcolor: modalState.type === 'exit' ? '#dc2626' : '#2E99B0',
              '&:hover': { bgcolor: modalState.type === 'exit' ? '#b91c1c' : '#267a8d' },
              textTransform: 'none', fontSize: '15px', fontWeight: 600, boxShadow: '2px 2px 0px 0px rgba(0, 0, 0, 0.1)'
            }}>
            {modalState.type === 'exit' ? 'Exit Test' : 'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicantTestPage;