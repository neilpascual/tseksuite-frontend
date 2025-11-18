import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ClockIcon from "../../assets/Clock.svg";
import Footer from "../../components/applicant/Footer";
import { Breadcrumbs, Stack, Link, Typography } from '@mui/material'
import toast from "react-hot-toast";

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
  const [percentage, setPercentage] = useState(50)

  const API_BASE_URL = "http://localhost:3000/api";

  useEffect(() => {
    const selectedQuiz =
      location.state?.quizData ||
      JSON.parse(localStorage.getItem("selectedQuiz") || "null");

    const applicant =
      location.state?.applicantData ||
      JSON.parse(localStorage.getItem("applicantData") || "{}");

    if (!selectedQuiz || !applicant.examiner_id) {
      alert("No quiz selected or applicant data missing. Redirecting...");
      navigate("/quiz-selection");
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

      const questionsResponse = await axios.get(
        `${API_BASE_URL}/question/get/${quizId}`
      );

      const questionsData = questionsResponse.data.data || [];

      const questionsWithOptions = await Promise.all(
        questionsData.map(async (question) => {
          try {
            const optionsResponse = await axios.get(
              `${API_BASE_URL}/answer/test/${question.question_id}`
            );

            const options = optionsResponse.data.data || [];

            return {
              ...question,
              options: options.map((opt) => ({
                answer_id: opt.answer_id,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
              })),
               explanation: question.explanation ||  "",
            };
          } catch (err) {
            console.error(
              `Error fetching options for question ${question.question_id}:`,
              err
            );
            return { ...question, options: [],explanation: question.explanation || ""};
          }
        })
      );

      setQuestions(questionsWithOptions);
      setUserAnswers(new Array(questionsWithOptions.length).fill(null));
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions. Please try again.");
      navigate("/quiz-selection");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = async () => {
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    toast.success("Time is up! Submitting your answers...");
    await submitTest();
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
    if (isSubmitting) return; // Prevent actions during submission

    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.question_type === "CB") {
      if (selectedAnswers.length === 0) {
        alert("Please select at least one answer");
        return;
      }
    } else if (currentQuestion.question_type !== "DESC") {
      if (selectedAnswer === null) {
        alert("Please select an answer");
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
        alert("Quiz or applicant data not found. Cannot submit test.");
        return;
      }

      // Format answers for backend
      const formattedAnswers = questions.map((question, index) => {
        const userAnswer = answers[index];

        if (question.question_type === "CB") {
          // For checkbox, send array of answer IDs
          return {
            question_id: question.question_id,
            selected_answer: Array.isArray(userAnswer) ? userAnswer : [],
          };
        } else if (question.question_type === "DESC") {
          // For descriptive, send text
          return {
            question_id: question.question_id,
            selected_answer:
              typeof userAnswer === "string" ? userAnswer.trim() : "",
          };
        } else {
          // For MC/TF, send single answer ID
          return {
            question_id: question.question_id,
            selected_answer: userAnswer || null,
          };
        }
      });

      // Determine status based on answered questions
      const answeredCount = formattedAnswers.filter((ans) => {
        if (Array.isArray(ans.selected_answer)) {
          return ans.selected_answer.length > 0;
        }
        return ans.selected_answer !== null && ans.selected_answer !== "";
      }).length;

      const status =
        answeredCount < questions.length ? "ABANDONED" : "COMPLETED";

      // Submit to backend
      const payload = {
        examiner_id: applicantData.examiner_id,
        quiz_id: quizData.quiz_id,
        answers: formattedAnswers,
        status: status,
      };

      console.log("Submitting test:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/result/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultData = response.data.data;

      // Create bridge entry
      await axios.post(
        `${API_BASE_URL}/bridge/create`,
        {
          examiner_id: applicantData.examiner_id,
          quiz_id: quizData.quiz_id,
          result_id: resultData.result_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Navigate to results page with data
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
      alert(
        error.response?.data?.message ||
          "Failed to submit test. Please try again."
      );
    }
  };

  const handleBackToHome = () => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will be lost."
      )
    ) {
      navigate("/");
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      MC: "Multiple Choice",
      CB: "Multiple Select",
      TF: "True/False",
      DESC: "Descriptive",
    };
    return labels[type] || "Question";
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
    <Typography underline="hover" key="1" color="inherit" sx={{ fontSize:{
       xs:15,
      sm:20,
      md:25
    }}} fontSize={25}>
      { getQuestionTypeLabel(currentQuestion.question_type) }
    </Typography>,
    <Typography key="2" sx={{ color: '#2E99B0', fontSize:{
      xs:15,
      sm:20,
      md:25
    } }} >
      Question {currentQuestionIndex + 1} / {questions.length}
    </Typography>
  ];

  return (
    <div
      className="min-h-screen bg-white flex flex-col justify-between"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="sticky top-0 h-1 bg-[#2E99B0] transition-all duration-300 ease-out"style={{ width: `${percentage}%` }}/>
        
          <div className="flex items-center justify-between mt-10 md:mt-10 mb-10 sm:mb-12 mx-5 sm:mx-18 lg:mx-45 xl:mx-115">
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

      

      {/* Main Content */}
      
      <div className="flex flex-col justify-center mx-5 sm:mx-10 lg:mx-30 xl:mx-100 sm:px-8 lg:px-16 py-8 sm:py-12">

         {/* Header */}
          
          <div className="flex flex-col mb-5 gap-10"> 


         <Stack spacing={2} className="mb-10 sm:mb-10">
           <Breadcrumbs separator=">">
           { breadcrumbs }
          </Breadcrumbs>
          <Typography key="2" sx={{ color: 'text-base' }}fontSize={25} fontWeight={'bold'}>
            {currentQuestion.question_text}
          </Typography>
         </Stack>
          </div>

      
            <div className="flex flex-col gap-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 sm:mb-20">
              {currentQuestion.options.map((option) => {
                const isSelected =
                  currentQuestion.question_type === "CB"
                    ? selectedAnswers.includes(option.answer_id)
                    : selectedAnswer === option.answer_id;

                return (
                  <button
                    key={option.answer_id}
                    onClick={() => handleAnswerSelect(option.answer_id)}
                    className={`p-5 sm:p-6 rounded-lg text-left text-base sm:text-lg font-normal transition-all duration-200 border-2 ${
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
                      <span>{option.option_text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-10 sm:px-16 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-base sm:text-lg ${
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
    </div>
  );
};

export default ApplicantTestPage;
