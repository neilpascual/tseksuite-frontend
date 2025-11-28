import React from 'react';
import { Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';
import { getTypeLabel } from '../utils/questionUtils';

const QuestionItem = ({ question, index, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 sm:gap-3 mb-3">
              <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#217486] text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm">
                {index + 1}
              </span>
              <h3 className="font-semibold text-base sm:text-lg text-gray-800 leading-tight wrap-break-word">
                {question.question_text}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-9 sm:ml-11 mb-3">
              <span className="px-2.5 sm:px-3 py-1 bg-[#217486]/10 text-[#217486] rounded-lg text-xs font-semibold">
                {getTypeLabel(question.question_type)}
              </span>
              <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                {question.points} {question.points === 1 ? "point" : "points"}
              </span>
            </div>

            <div className="ml-9 sm:ml-11 space-y-2">
              {question.question_type === "DESC" ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    Expected Answers:
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    {question.options && question.options.length > 0 ? (
                      question.options.map((opt, optIndex) => (
                        <li key={optIndex} className="wrap-break-word">
                          {opt.option_text}
                        </li>
                      ))
                    ) : (
                      <li className="list-none">
                        No answer provided
                      </li>
                    )}
                  </ul>
                </div>
              ) : (
                question.options.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className={`flex items-start gap-2 text-xs sm:text-sm p-2 rounded-lg ${
                      opt.is_correct
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    {opt.is_correct ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`break-words ${
                        opt.is_correct
                          ? "text-green-800 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {opt.option_text}
                    </span>
                  </div>
                ))
              )}
            </div>

            {question.explanation && (
              <div className="ml-9 sm:ml-11 mt-3 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs sm:text-sm text-blue-900 wrap-break-word">
                  <span className="font-semibold">Explanation: </span>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>

          <div className="flex sm:flex-col gap-2 ml-4 sm:ml-4">
            <button
              onClick={() => onEdit(question, index)}
              className="flex-1 sm:flex-none p-2 sm:p-2.5 text-[#217486] hover:bg-[#217486]/10 rounded-lg transition-colors"
              title="Edit Question"
            >
              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>
            <button
              onClick={() => onDelete(index)}
              className="flex-1 sm:flex-none p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Question"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;