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
      return { level: "Master", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80)
      return { level: "Excellent", color: "text-teal-600", bg: "bg-teal-100" };
    if (percentage >= 70)
      return { level: "Great", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 60)
      return { level: "Good", color: "text-cyan-600", bg: "bg-cyan-100" };
    return {
      level: "Keep Trying",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#217486] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Header Card */}
          <div className="bg-gradient-to-r from-[#217486] to-[#2c8fa3] rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{quizData.quiz_name}</h1>
                <p className="text-white/80 text-sm">
                  Test Completed Successfully
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-black">{percentage}%</div>
                <div className="text-white/80 text-lg">/ 100%</div>
              </div>
              <div
                className={`px-4 py-2 rounded-full ${performance.bg} ${performance.color} font-bold text-sm`}
              >
                {performance.level}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">
                {resultData.score}/{resultData.max_score}
              </div>
              <div className="text-[#2E99B0] text-sm">Points</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <FileText className="w-8 h-8 text-[#217486] mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">
                {questions.length}
              </div>
              <div className="text-[#2E99B0] text-sm">Questions</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
              <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">
                {quizData.time_limit}
              </div>
              <div className="text-[#2E99B0] text-sm">Minutes</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-[#2E99B0] text-sm">Correct</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
              <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-red-600">
                {incorrectAnswers}
              </div>
              <div className="text-[#2E99B0] text-sm">Incorrect</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-amber-600">
                {descriptiveQuestions}
              </div>
              <div className="text-[#2E99B0] text-sm">For Review</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2E99B0]" />
              <p className="text-[#2E99B0]">Quiz Summary</p>
            </h2>

            <div className="space-y-4">
              {questions.map((question, index) => {
                const detailedResult =
                  detailedResults.find(
                    (dr) => dr.question_id === question.question_id
                  ) || {};

                const isCorrect = detailedResult.is_correct;
                const userAnswer = detailedResult.user_answer;
                const correctAnswers = detailedResult.correct_answers || [];

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      isCorrect === null
                        ? "bg-gray-50 border-gray-200"
                        : isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${
                          isCorrect === null
                            ? "bg-gray-100 border-gray-300 text-gray-600"
                            : isCorrect
                            ? "bg-green-100 border-green-300 text-green-700"
                            : "bg-red-100 border-red-300 text-red-700"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-gray-900 font-medium text-sm flex-1">
                            {question.question_text}
                          </p>
                          <div className="flex gap-1">
                            <span className="px-2 py-1 bg-[#217486] text-white rounded text-xs font-medium">
                              {question.question_type}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                              {question.points} pt
                              {question.points !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-gray-600 text-xs font-medium mb-1">
                              YOUR ANSWER
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

                          {isCorrect !== null && (
                            <div className="bg-white rounded-lg p-3 border border-green-200">
                              <div className="text-green-600 text-xs font-medium mb-1">
                                CORRECT ANSWER
                              </div>
                              <div className="text-green-700 font-medium">
                                {correctAnswers.join(", ")}
                              </div>
                            </div>
                          )}
                        </div>

                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-blue-700 text-xs font-medium mb-1">
                              EXPLANATION
                            </div>
                            <div className="text-blue-800 text-sm">
                              {question.explanation}
                            </div>
                          </div>
                        )}


                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompletedTestResults;
