import React, { useState, useEffect } from "react";
import ClockIcon from "../assets/Clock.svg";
import CorrectIcon from "../assets/Correct.svg";
import WrongIcon from "../assets/Wrong.svg";
import Footer from "../../components/applicant/Footer";

const TestPage = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(2);
  const [timeRemaining, setTimeRemaining] = useState(875); // 14:35 in seconds
  const totalQuestions = 5;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          alert("Time is up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Static data - will be replaced with backend data
  const questionData = {
    category: "Problem Solving",
    question:
      "Logical Deduction All roses are flowers. Some flowers fade quickly. Therefore:",
    options: [
      { id: 1, value: "All roses fade quickly.", correct: false },
      { id: 2, value: "Some roses may fade quickly.", correct: true },
      { id: 3, value: "No roses fade quickly.", correct: false },
      { id: 4, value: "None of the above.", correct: false },
    ],
  };

  const handleAnswerSelect = (id) => {
    setSelectedAnswer(id);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert("Please select an answer");
      return;
    }

    console.log("Selected answer:", selectedAnswer);

    // Move to next question logic here
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Test completed - redirect to CompletedTest page
      window.location.href = "/CompletedTest";
    }
  };

  const handleBackToHome = () => {
    console.log("Back to home");
    window.location.href = "/";
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Main Content */}
      <div className="flex-1 px-6 sm:px-8 lg:px-16 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header with Back Button and Timer */}
          <div className="flex items-center justify-between mb-10 sm:mb-12">
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
              <span className="font-normal text-base">Back to home</span>
            </button>

            {/* Timer */}
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

          {/* Question Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {questionData.category}
              </h1>
              <span className="text-cyan-600 font-normal text-lg sm:text-xl">
                &gt; Question {currentQuestion} / {totalQuestions}
              </span>
            </div>
            <p className="text-gray-900 text-base sm:text-lg leading-relaxed">
              {questionData.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 sm:mb-20">
            {questionData.options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrect = option.correct;

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  className={`p-5 sm:p-6 rounded-lg text-left text-base sm:text-lg font-normal transition-all duration-200 border-2 ${
                    isSelected && isCorrect
                      ? "bg-green-50 text-black border-green-500"
                      : isSelected && !isCorrect
                      ? "bg-red-50 text-black border-red-500"
                      : "bg-gray-50 text-black hover:bg-gray-100 border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isSelected && isCorrect && (
                      <img
                        src={CorrectIcon}
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        alt="correct"
                      />
                    )}
                    {isSelected && !isCorrect && (
                      <img
                        src={WrongIcon}
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        alt="wrong"
                      />
                    )}
                    <span>{option.value}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-10 sm:px-16 py-3.5 rounded-lg transition-colors duration-200 flex items-center gap-2 text-base sm:text-lg "
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              Next
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
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TestPage;