import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

import ClockIcon from "../../assets/Clock.svg";
import Footer from "../../components/applicant/Footer";
import {
  Breadcrumbs,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  getQuestions,
  getOptions,
  addResult,
  addBridge,
} from "../../../api/api";
import {
  countAnswer,
  formatAnswers,
  getQuestionTypeLabel,
} from "../../../helpers/helpers";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ApplicantTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [descriptiveAnswers, setDescriptiveAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [applicantData, setApplicantData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percentage, setPercentage] = useState(0);

  // PDF states
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [pdfScale, setPdfScale] = useState(1.0);

  // Modal states
  const [modalState, setModalState] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
    onConfirm: null,
    showCancel: false,
  });

  // Helper function to open modal
  const openModal = (type, title, message, onConfirm, showCancel = false) => {
    setModalState({
      open: true,
      type,
      title,
      message,
      onConfirm,
      showCancel,
    });
  };

  // Helper function to close modal
  const closeModal = () => {
    setModalState({
      open: false,
      type: "",
      title: "",
      message: "",
      onConfirm: null,
      showCancel: false,
    });
  };

  // Get PDF links array from quiz data
  const getPdfLinks = () => {
    if (!quizData?.pdf_link) return [];
    
    // Handle both array format and comma-separated string
    if (Array.isArray(quizData.pdf_link)) {
      return quizData.pdf_link;
    } else if (typeof quizData.pdf_link === 'string') {
      return quizData.pdf_link.split(',').map(link => link.trim()).filter(link => link);
    }
    
    return [];
  };

  // Initial data loading
  useEffect(() => {
    const selectedQuiz =
      location.state?.quizData ||
      JSON.parse(localStorage.getItem("selectedQuiz") || "null");
    const applicant =
      location.state?.applicantData ||
      JSON.parse(localStorage.getItem("applicantData") || "{}");

    console.log("Selected Quiz Data:", selectedQuiz);
    console.log("Applicant Data:", applicant);

    if (!selectedQuiz || !applicant.examiner_id) {
      openModal(
        "error",
        "⚠️ Error",
        "No quiz selected or applicant data missing. Redirecting...",
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

  // Progress bar percentage - enhanced for multiple documents
  useEffect(() => {
    if (questions.length > 0) {
      const answeredCount = Object.keys(selectedAnswers).length + Object.keys(descriptiveAnswers).length;
      const percent = (answeredCount / questions.length) * 100;
      setPercentage(percent);
    } else if (getPdfLinks().length > 0) {
      // For PDF tests, calculate progress based on documents viewed
      const totalDocs = getPdfLinks().length;
      const progressPerDoc = 100 / totalDocs;
      const baseProgress = currentDocumentIndex * progressPerDoc;
      setPercentage(Math.min(baseProgress + 10, 100)); // Add some progress for current doc
    }
  }, [selectedAnswers, descriptiveAnswers, questions, currentDocumentIndex, quizData]);

  const fetchQuestions = async (quizId) => {
    try {
      setLoading(true);
      const questionsData = await getQuestions(quizId);

      // Fetch all answers for the quiz at once (excluding is_correct)
      const answersData = await getOptions(quizId);

      // Group answers by question_id
      const answersByQuestion = {};
      answersData.forEach((answer) => {
        if (!answersByQuestion[answer.question_id]) {
          answersByQuestion[answer.question_id] = [];
        }
        answersByQuestion[answer.question_id].push(answer);
      });

      // Attach options to each question
      const questionsWithOptions = questionsData.map((question) => {
        let options = answersByQuestion[question.question_id] || [];

        // For DESC, if no options, provide a default (though not used in rendering)
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

      // Initialize answers state
      const initialSelectedAnswers = {};
      const initialDescriptiveAnswers = {};
      
      questionsWithOptions.forEach((question, index) => {
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
    } catch (error) {
      console.error("Error fetching questions:", error);
      // For PDF tests, it's okay if there are no questions
      if (getPdfLinks().length === 0) {
        openModal(
          "error",
          "⚠️ Error",
          "Failed to load questions. Please try again.",
          () => {
            closeModal();
            navigate("/quiz-selection");
          }
        );
      } else {
        // For PDF tests, set empty questions and proceed
        setQuestions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    openModal(
      "timeup",
      "⏰ Time's Up",
      "Time is up! Your answers will be submitted automatically.",
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

  const handleAnswerSelect = (questionIndex, answerId, questionType) => {
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
  };

  const handleDescriptiveAnswer = (questionIndex, answer) => {
    setDescriptiveAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmit = () => {
    if (isSubmitting) return;

    // For PDF tests with no questions, submit immediately
    if (getPdfLinks().length > 0 && questions.length === 0) {
      submitTest();
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = questions.filter((question, index) => {
      if (question.question_type === "DESC") {
        return !descriptiveAnswers[index]?.trim();
      } else if (question.question_type === "CB") {
        return !selectedAnswers[index] || selectedAnswers[index].length === 0;
      } else {
        return selectedAnswers[index] === null;
      }
    });

    if (unansweredQuestions.length > 0) {
      openModal(
        "validation",
        "⚠️ Incomplete Test",
        `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`,
        () => {
          closeModal();
          submitTest();
        },
        true
      );
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    try {
      if (!quizData || !applicantData) {
        openModal(
          "error",
          "⚠️ Error",
          "Quiz or applicant data not found. Cannot submit test.",
          closeModal
        );
        return;
      }

      // For PDF tests with no questions, submit with special handling
      let formattedAnswers = [];
      let answeredCount = 0;
      let status = "COMPLETED";

      if (getPdfLinks().length > 0 && questions.length === 0) {
        // PDF test with no questions - treat as completed with no answers
        formattedAnswers = [];
        answeredCount = 0;
        status = "COMPLETED";
      } else {
        // Combine all answers into the format expected by formatAnswers
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
      await addBridge({
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        result_id: resultData.result_id,
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
        "error",
        "⚠️ Submission Error",
        error.response?.data?.message ||
          "Failed to submit test. Please try again.",
        closeModal
      );
    }
  };

  const handleBackToHome = () => {
    openModal(
      "exit",
      "⚠️ Exit Test",
      "Are you sure you want to exit? Your progress will be lost.",
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
    setPageNumber(1); // Reset to first page when new document loads
    console.log("PDF loaded successfully, pages:", numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfError(
      "Failed to load PDF document. You can still view it by opening the link in a new tab."
    );
    setPdfLoading(false);
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const goToPreviousDocument = () => {
    if (currentDocumentIndex > 0) {
      setCurrentDocumentIndex(prev => prev - 1);
      setPageNumber(1);
      setPdfLoading(true);
      setPdfError(null);
    }
  };

  const goToNextDocument = () => {
    const pdfLinks = getPdfLinks();
    if (currentDocumentIndex < pdfLinks.length - 1) {
      setCurrentDocumentIndex(prev => prev + 1);
      setPageNumber(1);
      setPdfLoading(true);
      setPdfError(null);
    }
  };

  const zoomIn = () => {
    setPdfScale((prev) => Math.min(prev + 0.25, 2.0));
  };

  const zoomOut = () => {
    setPdfScale((prev) => Math.max(prev - 0.25, 0.5));
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

  // Get current PDF link
  const getCurrentPdfLink = () => {
    const pdfLinks = getPdfLinks();
    return pdfLinks[currentDocumentIndex] || null;
  };

  // Enhanced PDF Viewer with multiple document support
  const renderPdfViewer = () => {
    const pdfLinks = getPdfLinks();
    const currentPdfLink = getCurrentPdfLink();
    const directPdfLink = getDirectPdfLink(currentPdfLink);

    if (pdfLinks.length === 0) return null;

    return (
<div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden h-full max-h-screen">
  {/* Enhanced PDF Header with Document Navigation */}
  <div className="px-6 py-4 bg-cyan-600 text-white">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-lg">Reference Documents</h3>
          <p className="text-sm text-blue-100">
            Document {currentDocumentIndex + 1} of {pdfLinks.length}
          </p>
        </div>
      </div>
      
      {/* Document Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPreviousDocument}
          disabled={currentDocumentIndex === 0}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          title="Previous Document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="text-sm font-medium px-3 py-1 bg-white/20 rounded-md backdrop-blur-sm">
          {currentDocumentIndex + 1} / {pdfLinks.length}
        </span>
        
        <button
          onClick={goToNextDocument}
          disabled={currentDocumentIndex === pdfLinks.length - 1}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          title="Next Document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    {/* Progress Bar for Multiple Documents */}
    <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
      <div
        className="bg-white h-2 rounded-full transition-all duration-300"
        style={{
          width: `${((currentDocumentIndex + 1) / pdfLinks.length) * 100}%`
        }}
      />
    </div>
  </div>

  {/* PDF Viewer Area - Optimized to use all available space */}
  <div className="flex-1 overflow-hidden bg-gray-900 flex flex-col">
    {pdfError ? (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center py-12 bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-semibold mb-2">
            Failed to load PDF
          </p>
          <p className="text-gray-600 text-sm mb-4">{pdfError}</p>
          <a
            href={directPdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
          >
            Open PDF in New Tab
          </a>
        </div>
      </div>
    ) : (
      <div className="flex-1 flex flex-col">

        
        {/* PDF Content - Takes all remaining space */}
        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-center h-full">
            {directPdfLink && directPdfLink.includes("drive.google.com") ? (
              <div className="bg-white rounded-lg shadow-2xl w-full h-full flex">
                <iframe
                  src={directPdfLink}
                  width="100%"
                  height="100%"
                  style={{
                    border: "none",
                    borderRadius: "8px",
                    minHeight: "500px"
                  }}
                  title={`PDF Document ${currentDocumentIndex + 1}`}
                  onLoad={() => setPdfLoading(false)}
                  onError={() => {
                    setPdfError("Failed to load PDF.");
                    setPdfLoading(false);
                  }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-2xl p-4 flex justify-center h-full overflow-auto">
                <Document
                  file={directPdfLink}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <span className="text-gray-700 text-sm font-medium">
                          Loading Document {currentDocumentIndex + 1}...
                        </span>
                      </div>
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
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
</div>
    );
  };

  // Render single question component
  const renderQuestion = (question, index) => {
    const isSelected = (answerId) => {
      if (question.question_type === "CB") {
        return selectedAnswers[index]?.includes(answerId) || false;
      } else {
        return selectedAnswers[index] === answerId;
      }
    };

    return (
<div key={index} className="mb-10">
  {/* Question Card */}
  <div className="p-6 bg-white rounded-xl overflow-y-auto">
    {/* Question Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
          Q{index + 1}
        </span>
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
          {getQuestionTypeLabel(question.question_type)}
        </span>
      </div>
    </div>

    {/* Question Text */}
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
        {question.question_text}
      </h3>
    </div>

    {/* Answer Options */}
    <div className="space-y-3">
      {question.question_type === "DESC" ? (
        <div>
          <textarea
            value={descriptiveAnswers[index] || ""}
            onChange={(e) => handleDescriptiveAnswer(index, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-4 rounded-xl text-base border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none resize-none transition-all"
            rows={6}
            style={{ minHeight: "150px" }}
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-gray-500">
              Characters: {(descriptiveAnswers[index] || "").length}
            </p>
          </div>
        </div>
      ) : (
        question.options.map((option) => (
          <button
            key={option.answer_id}
            onClick={() =>
              handleAnswerSelect(index, option.answer_id, question.question_type)
            }
            className={`w-full p-4 rounded-xl text-left text-base transition-all duration-200 border-2 ${
              isSelected(option.answer_id)
                ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-500 shadow-md"
                : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              {question.question_type === "CB" ? (
                <div
                  className={`w-6 h-6 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected(option.answer_id)
                      ? "bg-cyan-600 border-cyan-600"
                      : "border-gray-400"
                  }`}
                >
                  {isSelected(option.answer_id) && (
                    <svg
                      className="w-4 h-4 text-white"
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
                  className={`w-6 h-6 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected(option.answer_id)
                      ? "border-cyan-600 bg-cyan-600"
                      : "border-gray-400"
                  }`}
                >
                  {isSelected(option.answer_id) && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              )}
              <span
                className={`leading-relaxed ${
                  isSelected(option.answer_id)
                    ? "font-medium text-gray-900"
                    : "text-gray-700"
                }`}
              >
                {option.option_text}
              </span>
            </div>
          </button>
        ))
      )}
    </div>
  </div>
  <style>
    {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
  </style>


  <hr className="mt-8 border-gray-300" />
</div>

    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading {getPdfLinks().length > 0 ? "PDF test" : "questions"}...
          </p>
        </div>
      </div>
    );
  }

  // Check if we have questions to render
  const hasPdfReference = getPdfLinks().length > 0;
  const hasQuestions = questions.length > 0;

  // Handle PDF tests with no questions
  if (hasPdfReference && !hasQuestions) {
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

        <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
          <div className="max-w-[1800px] mx-auto">
            <div className="mb-6">
              <Stack spacing={3}>
                <Typography
                  sx={{
                    color: "#1a1a1a",
                    fontSize: { xs: 20, sm: 24, md: 28, lg: 32 },
                    fontWeight: "bold",
                    lineHeight: 1.3,
                  }}
                >
                  PDF Test: {quizData.quiz_name}
                </Typography>
                <Typography
                  sx={{
                    color: "#4a5568",
                    fontSize: { xs: 16, sm: 18 },
                    lineHeight: 1.5,
                  }}
                >
                  Please review the PDF documents below. When you're ready, click the submit button to complete the test.
                </Typography>
              </Stack>
            </div>

            {/* Enhanced PDF Viewer */}
            {renderPdfViewer()}

            {/* Submit Button for PDF Test */}
            <div className="flex justify-end pt-6">
              <button
                onClick={handleSubmit}
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

        <Dialog
          open={modalState.open}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: "12px", padding: "8px" } }}
        >
          <DialogTitle
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1a1a1a",
              pb: 1,
            }}
          >
            {modalState.title}
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{ fontSize: "16px", color: "#4a5568", lineHeight: 1.6 }}
            >
              {modalState.message}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            {modalState.showCancel && (
              <Button
                onClick={closeModal}
                sx={{
                  color: "#6b7280",
                  textTransform: "none",
                  fontSize: "15px",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#f3f4f6" },
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={modalState.onConfirm}
              variant="contained"
              sx={{
                bgcolor: modalState.type === "exit" ? "#dc2626" : "#2E99B0",
                "&:hover": {
                  bgcolor: modalState.type === "exit" ? "#b91c1c" : "#267a8d",
                },
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 600,
                boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
              }}
            >
              {modalState.type === "exit" ? "Exit Test" : "OK"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  // Regular Quiz Layout with all questions
  if (!hasQuestions) {
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

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Enhanced Progress Bar */}
      <div
        className="sticky top-0 h-1.5 bg-[#2E99B0] transition-all duration-300 ease-out z-50"
        style={{ width: `${percentage}%` }}
      />

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

          {!hasPdfReference && (
            <div
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200"
            style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}
          >
            <img src={ClockIcon} className="w-5 h-5" alt="clock" />
            <span className="font-semibold text-gray-900 text-lg">
              {formatTime(timeRemaining)}
            </span>
          </div>
          )}
          
        </div>
      </div>

      <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
        <div className="max-w-[1300px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Stack spacing={3}>
              <Typography
                sx={{
                  color: "#1a1a1a",
                  fontSize: { xs: 20, sm: 24, md: 28, lg: 32 },
                  fontWeight: "bold",
                  lineHeight: 1.3,
                }}
              >
                {quizData.quiz_name}
              </Typography>
              <div className="flex items-center justify-between">
                <Typography
                  sx={{
                    color: "#4a5568",
                    fontSize: { xs: 12, sm: 15 },
                    lineHeight: 1.5,
                  }}
                >
                  {questions.length} questions • Answer all questions below
                </Typography>
                <div className="text-right">
          
                  <div className="text-xs text-gray-500">
                    {Object.keys(selectedAnswers).filter(k => selectedAnswers[k] !== null && selectedAnswers[k] !== undefined && (Array.isArray(selectedAnswers[k]) ? selectedAnswers[k].length > 0 : true)).length + Object.keys(descriptiveAnswers).filter(k => descriptiveAnswers[k]?.trim()).length} of {questions.length} answered
                  </div>
                </div>
              </div>
            </Stack>
          </div>

          {/* Split Screen Layout - PDF on left, Questions on right */}
          {hasPdfReference ? (
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 min-h-[calc(100vh-20rem)]">
              {/* LEFT SIDE - ENHANCED PDF VIEWER WITH MULTIPLE DOCUMENT SUPPORT */}
              {renderPdfViewer()}

              {/* RIGHT SIDE - ALL QUESTIONS */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col">
                <div className="flex-1 overflow-y-auto max-h-[calc(100vh-15rem)]">
                  <div className="space-y-6">
                    {questions.map((question, index) => renderQuestion(question, index))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
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
                        Submit Quiz
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
          ) : (
            // NO PDF - All questions in single column
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                {/* Questions List */}
                <div className="space-y-6">
                  {questions.map((question, index) => renderQuestion(question, index))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`bg-cyan-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-12 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 text-lg shadow-lg hover:shadow-xl ${
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
                        Submit Quiz
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
          )}
        </div>
      </div>

      <Footer />

      <Dialog
        open={modalState.open}
        onClose={closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", padding: "8px" } }}
      >
        <DialogTitle
          sx={{ fontSize: "20px", fontWeight: "bold", color: "#1a1a1a", pb: 1 }}
        >
          {modalState.title}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ fontSize: "16px", color: "#4a5568", lineHeight: 1.6 }}
          >
            {modalState.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          {modalState.showCancel && (
            <Button
              onClick={closeModal}
              sx={{
                color: "#6b7280",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 500,
                "&:hover": { backgroundColor: "#f3f4f6" },
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={modalState.onConfirm}
            variant="contained"
            sx={{
              bgcolor: modalState.type === "exit" ? "#dc2626" : "#2E99B0",
              "&:hover": {
                bgcolor: modalState.type === "exit" ? "#b91c1c" : "#267a8d",
              },
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 600,
              boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 0.1)",
            }}
          >
            {modalState.type === "exit" ? "Exit Test" : "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicantTestPage;