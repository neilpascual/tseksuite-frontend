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

  const getApplicantName = () => {
    if (!applicantData) return "Applicant";

    const firstName = applicantData.firstName || applicantData.first_name || "";
    const lastName = applicantData.lastName || applicantData.last_name || "";

    const name = `${firstName} ${lastName}`.trim();
    return name || applicantData.email || "Applicant";
  };

  const getApplicantEmail = () => {
    return applicantData?.email || "No email provided";
  };

  const downloadCertificate = async () => {
    setGenerating(true);

    try {
      // Load the logo image first
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = "/assets/Suitelifer.png";
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size (A4 landscape)
      canvas.width = 1400;
      canvas.height = 990;

      // Modern gradient background
      const bgGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      bgGradient.addColorStop(0, "#f0f9ff");
      bgGradient.addColorStop(0.5, "#ffffff");
      bgGradient.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Modern geometric pattern overlay
      ctx.fillStyle = "rgba(33, 116, 134, 0.03)";
      for (let i = 0; i < canvas.width; i += 60) {
        for (let j = 0; j < canvas.height; j += 60) {
          ctx.fillRect(i, j, 30, 30);
        }
      }

      // Primary brand color border
      const borderGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      borderGradient.addColorStop(0, "#217486");
      borderGradient.addColorStop(0.5, "#2a93aa");
      borderGradient.addColorStop(1, "#217486");
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Inner accent line
      ctx.strokeStyle = "rgba(33, 116, 134, 0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

      // Top left modern diagonal accent
      const accentGradient = ctx.createLinearGradient(0, 0, 400, 300);
      accentGradient.addColorStop(0, "#217486");
      accentGradient.addColorStop(1, "rgba(33, 116, 134, 0.1)");
      ctx.fillStyle = accentGradient;
      ctx.beginPath();
      ctx.moveTo(50, 50);
      ctx.lineTo(400, 50);
      ctx.lineTo(50, 300);
      ctx.closePath();
      ctx.fill();

      // Top right accent shape
      ctx.fillStyle = accentGradient;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 400, 50);
      ctx.lineTo(canvas.width - 50, 50);
      ctx.lineTo(canvas.width - 50, 300);
      ctx.closePath();
      ctx.fill();

      // Bottom modern wave accent
      ctx.fillStyle = "rgba(33, 116, 134, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 150);
      ctx.quadraticCurveTo(
        canvas.width / 4,
        canvas.height - 200,
        canvas.width / 2,
        canvas.height - 150
      );
      ctx.quadraticCurveTo(
        (3 * canvas.width) / 4,
        canvas.height - 100,
        canvas.width,
        canvas.height - 150
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw logo on the left side over the diagonal accent
      const logoSize = 90;
      const logoX = 80;
      const logoY = 80;

      // Optional: Add a white circle background for the logo
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        logoX + logoSize / 2,
        logoY + logoSize / 2,
        logoSize / 2 + 10,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Add subtle shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      // Draw the logo
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Company branding area
      ctx.fillStyle = "#217486";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("FULLSUITE UNIVERSITY", canvas.width / 2, 120);

      ctx.fillStyle = "#2a93aa";
      ctx.font = "16px Arial, sans-serif";
      ctx.fillText(
        "Excellence in Learning & Development",
        canvas.width / 2,
        150
      );

      // Modern CERTIFICATE title
      const titleGradient = ctx.createLinearGradient(
        canvas.width / 2 - 300,
        0,
        canvas.width / 2 + 300,
        0
      );
      titleGradient.addColorStop(0, "#217486");
      titleGradient.addColorStop(0.5, "#1a5f6f");
      titleGradient.addColorStop(1, "#217486");
      ctx.fillStyle = titleGradient;
      ctx.font = "bold 90px Arial, sans-serif";
      ctx.fillText("CERTIFICATE", canvas.width / 2, 270);

      // Subtitle with modern styling
      ctx.fillStyle = "#217486";
      ctx.font = "600 32px Arial, sans-serif";
      ctx.letterSpacing = "8px";
      ctx.fillText("OF ACHIEVEMENT", canvas.width / 2, 320);

      // Modern decorative elements
      ctx.fillStyle = "#217486";
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 220, 340, 4, 0, Math.PI * 2);
      ctx.arc(canvas.width / 2 + 220, 340, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#217486";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 200, 340);
      ctx.lineTo(canvas.width / 2 - 50, 340);
      ctx.moveTo(canvas.width / 2 + 50, 340);
      ctx.lineTo(canvas.width / 2 + 200, 340);
      ctx.stroke();

      // "PROUDLY PRESENTED TO" text
      ctx.fillStyle = "#64748b";
      ctx.font = "500 18px Arial, sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("PROUDLY PRESENTED TO", canvas.width / 2, 400);

      // Applicant Name with modern styling
      const applicantName = getApplicantName();
      ctx.fillStyle = "#1e293b";
      ctx.font = "italic 70px Georgia, serif";

      // Name shadow for depth
      ctx.shadowColor = "rgba(33, 116, 134, 0.15)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillText(applicantName, canvas.width / 2, 490);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Modern underline with gradient
      const nameWidth = ctx.measureText(applicantName).width;
      const underlineGradient = ctx.createLinearGradient(
        canvas.width / 2 - nameWidth / 2,
        0,
        canvas.width / 2 + nameWidth / 2,
        0
      );
      underlineGradient.addColorStop(0, "rgba(33, 116, 134, 0.3)");
      underlineGradient.addColorStop(0.5, "#217486");
      underlineGradient.addColorStop(1, "rgba(33, 116, 134, 0.3)");
      ctx.strokeStyle = underlineGradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - nameWidth / 2 - 40, 510);
      ctx.lineTo(canvas.width / 2 + nameWidth / 2 + 40, 510);
      ctx.stroke();

      // Achievement description
      ctx.fillStyle = "#475569";
      ctx.font = "20px Arial, sans-serif";
      const percentage = Math.round(
        (resultData.score / resultData.max_score) * 100
      );

      ctx.fillText(
        "has successfully completed the assessment",
        canvas.width / 2,
        570
      );

      // Quiz name in modern badge
      const quizName = quizData?.quiz_name || "Online Assessment";
      ctx.fillStyle = "#217486";
      ctx.font = "bold 28px Arial, sans-serif";

      // Badge background
      const quizWidth = ctx.measureText(quizName).width;
      ctx.fillStyle = "rgba(33, 116, 134, 0.08)";
      ctx.fillRect(
        canvas.width / 2 - quizWidth / 2 - 35,
        585,
        quizWidth + 70,
        50
      );

      ctx.fillStyle = "#217486";
      ctx.fillText(quizName, canvas.width / 2, 618);

      // Score badge - modern circular design
      ctx.fillStyle = "#217486";
      ctx.font = "18px Arial, sans-serif";
      ctx.fillText("with a rating of", canvas.width / 2, 670);

      // Modern score circle
      const scoreGradient = ctx.createRadialGradient(
        canvas.width / 2,
        750,
        0,
        canvas.width / 2,
        750,
        70
      );
      scoreGradient.addColorStop(0, "#217486");
      scoreGradient.addColorStop(1, "#1a5f6f");
      ctx.fillStyle = scoreGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 750, 65, 0, Math.PI * 2);
      ctx.fill();

      // Score text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 42px Arial, sans-serif";
      ctx.fillText(`${percentage}%`, canvas.width / 2, 765);

      // Date with modern styling
      const currentDate = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      ctx.fillStyle = "#64748b";
      ctx.font = "16px Arial, sans-serif";
      ctx.fillText(`Issued on ${currentDate}`, canvas.width / 2, 850);

      // Modern signature section - centered
      const centerX = canvas.width / 2;
      const signatureY = canvas.height - 100;

      // Signature line
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 100, signatureY - 25);
      ctx.lineTo(centerX + 100, signatureY - 25);
      ctx.stroke();

      ctx.font = "16px Arial, sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("FullSuite University", centerX, signatureY + 25);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `FullSuite_University_Certificate_${applicantName.replace(
            /\s+/g,
            "_"
          )}.png`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        setGenerating(false);
      }, "image/png");
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate. Please try again.");
      setGenerating(false);
    }
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
