import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Trophy,
  Clock,
  FileText,
  AlertCircle,
  Award,
  XCircle,
} from "lucide-react";
import Footer from "../../components/applicant/Footer";

const CompletedTestResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [detailedResults, setDetailedResults] = useState([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    try {
      // Get data from navigation state
      const { resultData, quizData, questions, applicantData } =
        location.state || {};

      if (!resultData || !quizData || !questions) {
        alert("No test results found. Redirecting...");
        navigate("/");
        return;
      }

      setResultData(resultData);
      setQuizData(quizData);
      setQuestions(questions);
      setDetailedResults(resultData.detailed_results || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading results:", error);
      alert("Failed to load results. Redirecting...");
      navigate("/");
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem("selectedQuiz");
    localStorage.removeItem("applicantData");
    navigate("/");
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return {
        level: "Outstanding",
        color: "text-green-600",
        bg: "bg-green-100",
      };
    if (percentage >= 80)
      return { level: "Excellent", color: "text-teal-600", bg: "bg-teal-100" };
    if (percentage >= 70)
      return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60)
      return { level: "Fair", color: "text-cyan-600", bg: "bg-cyan-100" };
    return {
      level: "Needs Improvement",
      color: "text-amber-600",
      bg: "bg-amber-100",
    };
  };

  const formatUserAnswer = (userAnswer, question) => {
    if (userAnswer === null || userAnswer === undefined) {
      return "No answer provided";
    }

    if (Array.isArray(userAnswer)) {
      if (userAnswer.length === 0) {
        return "No answer provided";
      }

      // For checkbox questions, match IDs to option text
      if (question.question_type === "CB") {
        const selectedOptions = question.options.filter((opt) =>
          userAnswer.includes(opt.answer_id)
        );
        return selectedOptions.length > 0
          ? selectedOptions.map((opt) => opt.option_text).join(", ")
          : "No answer provided";
      }

      return userAnswer.join(", ");
    }

    // For single choice questions (MC/TF), match ID to option text
    if (
      (question.question_type === "MC" || question.question_type === "TF") &&
      typeof userAnswer === "number"
    ) {
      const selectedOption = question.options.find(
        (opt) => opt.answer_id === userAnswer
      );
      return selectedOption ? selectedOption.option_text : "No answer provided";
    }

    return userAnswer.toString().trim() || "No answer provided";
  };

  const getQuestionIcon = (isCorrect) => {
    if (isCorrect === null) {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-gray-500" />
        </div>
      );
    }
    if (isCorrect) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
        <XCircle className="w-4 h-4 text-red-600" />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round(
    (resultData.score / resultData.max_score) * 100
  );
  const performance = getPerformanceLevel(percentage);
  const correctAnswers = detailedResults.filter(
    (r) => r.is_correct === true
  ).length;
  const incorrectAnswers = detailedResults.filter(
    (r) => r.is_correct === false
  ).length;
  const descriptiveQuestions = detailedResults.filter(
    (r) => r.is_correct === null
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 flex flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Success Banner */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-t-4 border-cyan-600">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-8 h-8 text-cyan-600" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    Test Completed!
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">{quizData.quiz_name}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className={`px-4 py-2 rounded-full ${performance.bg} ${performance.color} font-bold text-sm`}
                >
                  {performance.level}
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{quizData.time_limit} minutes</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-8 text-white text-center">
              <div className="mb-2 text-white/80 text-lg font-medium">
                Your Score
              </div>
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-6xl font-black">{percentage}%</div>
                <div className="text-left">
                  <div className="text-2xl font-bold">
                    {resultData.score} / {resultData.max_score}
                  </div>
                  <div className="text-white/80 text-sm">points</div>
                </div>
              </div>
              <div className="text-white/90 text-sm">
                {correctAnswers} correct • {incorrectAnswers} incorrect
                {descriptiveQuestions > 0 &&
                  ` • ${descriptiveQuestions} for review`}
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {questions.length}
              </div>
              <div className="text-gray-600 text-sm">Total Questions</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-gray-600 text-sm">Correct</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {incorrectAnswers}
              </div>
              <div className="text-gray-600 text-sm">Incorrect</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md text-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-600">
                {descriptiveQuestions}
              </div>
              <div className="text-gray-600 text-sm">For Review</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-cyan-600" />
              Answer Review
            </h2>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const detailedResult = detailedResults.find(
                  (dr) => dr.question_id === question.question_id
                );

                if (!detailedResult) {
                  return null;
                }

                const isCorrect = detailedResult.is_correct;
                const userAnswer = detailedResult.user_answer;
                const correctAnswers = detailedResult.correct_answers || [];

                return (
                  <div
                    key={question.question_id}
                    className={`rounded-xl border-2 p-5 transition-all ${
                      isCorrect === null
                        ? "bg-gray-50 border-gray-200"
                        : isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Question Number & Status Icon */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700">
                          {index + 1}
                        </div>
                        {getQuestionIcon(isCorrect)}
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        {/* Question Text */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs font-medium">
                              {question.question_type}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {question.points} point
                              {question.points !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium text-lg">
                            {question.question_text}
                          </p>
                        </div>

                        {/* Answer Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Your Answer */}
                          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                            <div className="text-xs font-bold text-gray-600 uppercase mb-2">
                              Your Answer
                            </div>
                            <div
                              className={`font-medium ${
                                isCorrect === null
                                  ? "text-gray-700"
                                  : isCorrect
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {formatUserAnswer(userAnswer, question)}
                            </div>
                          </div>

                          {/* Correct Answer */}
                          {isCorrect !== null && (
                            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                              <div className="text-xs font-bold text-green-600 uppercase mb-2">
                                Correct Answer
                              </div>
                              <div className="text-green-700 font-medium">
                                {correctAnswers.join(", ")}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Explanation */}
                        {question.explanation && (
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="text-xs font-bold text-blue-700 uppercase mb-1">
                              Explanation
                            </div>
                            <p className="text-blue-900 text-sm">
                              {question.explanation}
                            </p>
                          </div>
                        )}

                        {/* Descriptive Answer Note */}
                        {question.question_type === "DESC" &&
                          isCorrect === null && (
                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p className="text-amber-800 text-sm">
                                This answer will be reviewed manually by the
                                administrator.
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompletedTestResults;
