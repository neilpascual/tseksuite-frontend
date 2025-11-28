import React from 'react';
import { FileText, Plus, Upload } from 'lucide-react';

const EmptyState = ({ isPdfTest, onAddQuestion, onImport }) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
      <div className="w-20 h-20 bg-[#217486]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-10 h-10 text-[#217486]" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
        No Questions Yet
      </h3>
      <p className="text-sm sm:text-base text-gray-500 mb-6">
        Start building your {isPdfTest ? "test" : "quiz"} by adding your
        first question.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onImport}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-[#217486] border border-[#217486] rounded-xl hover:bg-[#217486]/10 font-medium transition-all text-sm sm:text-base"
        >
          <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
          Import from CSV
        </button>
        <button
          onClick={onAddQuestion}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add First Question
        </button>
      </div>
    </div>
  );
};

export default EmptyState;