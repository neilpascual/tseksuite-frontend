import React from 'react';
import { ArrowLeft, Plus, Upload } from 'lucide-react';

const Header = ({ quiz, totalPoints, questionsCount, onBack, onAddQuestion, onImport }) => {
  const isPdfTest = quiz?.pdf_link ? true : false;

  return (
    <div className="mb-4 sm:mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#217486] mb-4 font-medium transition-colors text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Back to Quizzes</span>
        <span className="sm:hidden">Back</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 sm:mt-10">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#217486] mb-2 wrap-break-word">
            {quiz.quiz_name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            {isPdfTest && (
              <span className="flex items-center gap-1 bg-[#2a8fa5]/10 px-2 py-1 rounded-lg">
                <span className="font-semibold text-[#2a8fa5]">
                  PDF Test
                </span>
              </span>
            )}
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
              <span className="font-semibold text-[#217486]">
                {totalPoints}
              </span>
              {totalPoints === 1 ? "Point" : "Points"}
            </span>
            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
              <span className="font-semibold text-[#217486]">
                {questionsCount}
              </span>
              {questionsCount === 1 ? "Question" : "Questions"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onImport}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white text-[#217486] border border-[#217486] rounded-xl hover:bg-[#217486]/10 font-medium transition-all text-sm sm:text-base whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import CSV</span>
            <span className="sm:hidden">Import</span>
          </button>
          <button
            onClick={onAddQuestion}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all hover:shadow-xl hover:shadow-[#217486]/40 text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Question</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;