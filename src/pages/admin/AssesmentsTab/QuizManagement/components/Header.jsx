import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

const Header = ({ department, quizzes, onBack, onAddQuiz, isProcessing }) => {
  return (
    <div className="mb-8 sm:mb-12 lg:mb-15">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#217486] mb-4 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Departments</span>
        <span className="sm:hidden">Back</span>
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-[#217486] mb-2">
            {department.dept_name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4 text-[#217486]" />
              <span className="font-semibold text-[#217486]">
                {quizzes.length}
              </span>{' '}
              {quizzes.length === 1 ? 'Quiz' : 'Quizzes'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={onAddQuiz}
            className="flex items-center justify-center gap-2 bg-[#217486] text-white px-6 py-3 rounded-xl hover:bg-[#1a5d6d] font-medium transition-all hover:shadow-xl hover:shadow-[#217486]/40"
            disabled={isProcessing}
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;