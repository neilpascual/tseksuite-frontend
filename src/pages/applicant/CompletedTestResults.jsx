import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Trophy,
  Award,
  XCircle,
  Download,
  Sparkles,
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
  const [applicantData, setApplicantData] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    try {
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
      setApplicantData(applicantData);
      setDetailedResults(resultData.detailed_results || []);
      setLoading(false);
    } catch (error) {
      console.error("Error loading results:", error);
      alert("Failed to load results. Redirecting...");
      navigate("/");
    }
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90)
      return { level: "Master", color: "#10B981", bgColor: "#D1FAE5" };
    if (percentage >= 80)
      return { level: "Excellent", color: "#14B8A6", bgColor: "#CCFBF1" };
    if (percentage >= 70)
      return { level: "Great", color: "#3B82F6", bgColor: "#DBEAFE" };
    if (percentage >= 60)
      return { level: "Good", color: "#06B6D4", bgColor: "#CFFAFE" };
    return {
      level: "Keep Trying",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
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

  const downloadCertificate = () => {
    setGenerating(true);

    setTimeout(() => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size (A4 landscape proportions)
      canvas.width = 1200;
      canvas.height = 850;

      // Background gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, "#f0f9ff");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer border
      ctx.strokeStyle = "#217486";
      ctx.lineWidth = 8;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Inner border
      ctx.strokeStyle = "#2E99B0";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Corner decorations
      const drawCorner = (x, y) => {
        ctx.save();

        // Outer circle
        ctx.fillStyle = "#217486";
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      drawCorner(100, 100);
      drawCorner(canvas.width - 100, 100);
      drawCorner(canvas.width - 100, canvas.height - 100);
      drawCorner(100, canvas.height - 100);

      // Main heading
      ctx.fillStyle = "#217486";
      ctx.font = "bold 56px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.letterSpacing = "4px";
      ctx.fillText("CERTIFICATE", canvas.width / 2, 150);

      // Subheading
      ctx.font = "32px Arial, sans-serif";
      ctx.fillStyle = "#2E99B0";
      ctx.letterSpacing = "2px";
      ctx.fillText("OF ACHIEVEMENT", canvas.width / 2, 195);

      // Decorative line
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 200, 220);
      ctx.lineTo(canvas.width / 2 + 200, 220);
      ctx.stroke();

      // Text: "This is to certify that"
      ctx.fillStyle = "#374151";
      ctx.font = "24px Arial, sans-serif";
      ctx.fillText("This is to certify that", canvas.width / 2, 280);

      // Applicant name
      const applicantName = applicantData.name || "Applicant";
      ctx.fillStyle = "#217486";
      ctx.font = "bold 48px Arial, sans-serif";
      ctx.letterSpacing = "2px";
      ctx.fillText(applicantName.toUpperCase(), canvas.width / 2, 350);

      // Underline for name
      ctx.strokeStyle = "#217486";
      ctx.lineWidth = 2;
      ctx.beginPath();
      const nameMetrics = ctx.measureText(applicantName.toUpperCase());
      ctx.moveTo(canvas.width / 2 - nameMetrics.width / 2, 365);
      ctx.lineTo(canvas.width / 2 + nameMetrics.width / 2, 365);
      ctx.stroke();

      // Text: "has successfully completed the"
      ctx.fillStyle = "#374151";
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText("has successfully completed the", canvas.width / 2, 420);

      // Quiz name
      ctx.fillStyle = "#2E99B0";
      ctx.font = "bold 32px Arial, sans-serif";
      const quizName = quizData.quiz_name || "Quiz";
      const quizMetrics = ctx.measureText(quizName);

      // Wrap text if too long
      if (quizMetrics.width > 800) {
        ctx.font = "bold 26px Arial, sans-serif";
      }
      ctx.fillText(quizName, canvas.width / 2, 470);

      // Text: "with a score of"
      ctx.fillStyle = "#374151";
      ctx.font = "22px Arial, sans-serif";
      ctx.fillText("with a score of", canvas.width / 2, 530);

      // Score percentage
      const percentage = Math.round(
        (resultData.score / resultData.max_score) * 100
      );
      ctx.fillStyle = "#217486";
      ctx.font = "bold 52px Arial, sans-serif";
      ctx.fillText(`${percentage}%`, canvas.width / 2, 600);

      // Performance badge
      const performance = getPerformanceLevel(percentage);

      // Badge background
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, 670, 90, 35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Badge text
      ctx.fillStyle = "#217486";
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillText(performance.level, canvas.width / 2, 678);

      // Date
      ctx.fillStyle = "#6B7280";
      ctx.font = "18px Arial, sans-serif";
      const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.fillText(`Date: ${currentDate}`, canvas.width / 2, 760);

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `Certificate_${quizData.quiz_name.replace(
          /\s+/g,
          "_"
        )}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setGenerating(false);
      });
    }, 100);
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Header Card */}
          <div className="bg-gradient-to-r from-[#217486] to-[#2c8fa3] rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{quizData.quiz_name}</h1>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-black">{percentage}%</div>
                <div className="text-white/80 text-lg">/ 100%</div>
              </div>

              {/* Download Certificate Button */}
              <button
                onClick={downloadCertificate}
                disabled={generating}
                className="flex items-center gap-2 bg-white text-[#217486] px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </>
                )}
              </button>
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
