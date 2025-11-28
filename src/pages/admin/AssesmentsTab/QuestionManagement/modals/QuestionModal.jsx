import React from 'react';
import { X, CheckCircle, Circle } from 'lucide-react';
import { getTypeLabel } from '../utils/questionUtils';

const QuestionModal = ({
  isOpen,
  onClose,
  question,
  setQuestion,
  onSave,
  isProcessing
}) => {
  if (!isOpen) return null;

  const updateField = (field, value) => {
    setQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const updateOption = (index, field, value) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const addOption = () => {
    setQuestion((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          option_text: "",
          is_correct: prev.question_type === "DESC" ? true : false,
        },
      ],
    }));
  };

  const removeOption = (index) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const setCorrectAnswer = (index) => {
    if (question.question_type === "CB") {
      updateOption(index, "is_correct", !question.options[index].is_correct);
    } else if (
      question.question_type === "MC" ||
      question.question_type === "TF"
    ) {
      setQuestion((prev) => ({
        ...prev,
        options: prev.options.map((opt, i) => ({
          ...opt,
          is_correct: i === index,
        })),
      }));
    }
  };

  const handleTypeChange = (type) => {
    updateField("question_type", type);
    if (type === "TF") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "True", is_correct: true },
          { option_text: "False", is_correct: false },
        ],
      }));
    } else if (type === "DESC") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "", is_correct: true },
          { option_text: "", is_correct: true },
        ],
      }));
    } else {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "", is_correct: true },
          { option_text: "", is_correct: false },
        ],
      }));
    }
  };

  const renderOptions = () => {
    switch (question.question_type) {
      case "DESC":
        return (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 mb-2">
                <span className="font-semibold">Note:</span> This is a
                descriptive question. Enter the correct/expected answer below.
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Correct Answers
              </label>
              <div className="space-y-2">
                {question.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt.option_text}
                      onChange={(e) =>
                        updateOption(i, "option_text", e.target.value)
                      }
                      placeholder={`Key Answer ${i + 1}`}
                      className="flex-1 px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent"
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="w-full py-2 text-sm sm:text-base border-2 border-dashed border-gray-300 rounded-lg hover:border-[#217486] hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </div>
        );
      case "TF":
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#217486] transition-colors"
              >
                <input
                  type="radio"
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-[#217486] focus:ring-[#217486] shrink-0"
                />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  {opt.option_text}
                </span>
              </div>
            ))}
          </div>
        );
      case "MC":
      case "CB":
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type={question.question_type === "MC" ? "radio" : "checkbox"}
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-[#217486] focus:ring-[#217486] shrink-0"
                />
                <input
                  value={opt.option_text}
                  onChange={(e) =>
                    updateOption(i, "option_text", e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-2 text-sm sm:text-base border-2 border-dashed border-gray-300 rounded-lg hover:border-[#217486] hover:bg-gray-50 text-gray-600 transition-colors"
            >
              + Add Option
            </button>
          </div>
        );
      default:
        return (
          <p className="italic text-gray-500 text-sm">Unsupported type.</p>
        );
    }
  };

  const questionTypes = ["MC", "CB", "TF", "DESC"];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 bg-linear-to-r from-[#217486] to-[#2a8fa5] flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold text-white">
            {question.question_id ? "Edit Question" : "Add New Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Question Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {questionTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    question.question_type === t
                      ? "bg-[#217486] text-white shadow-lg shadow-[#217486]/30"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {getTypeLabel(t)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Question Text
            </label>
            <textarea
              placeholder="Enter your question here..."
              value={question.question_text}
              onChange={(e) => updateField("question_text", e.target.value)}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Points
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="number"
                min={1}
                value={question.points}
                onChange={(e) => updateField("points", Number(e.target.value))}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg w-24 focus:ring-2 focus:ring-[#217486] focus:border-transparent"
              />
              {question.question_type === "CB" && (
                <span className="text-xs text-gray-600 bg-cyan-50 border border-cyan-600 p-2 sm:p-3 rounded-lg">
                  <span className="font-semibold text-gray-800">Note: </span>
                  Each correct answer is equivalent to the points allocated.
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              {question.question_type === "DESC"
                ? "Expected Answers"
                : "Answer Options"}
            </label>
            {renderOptions()}
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Explanation (Optional)
            </label>
            <textarea
              placeholder="Add an explanation for the correct answer..."
              value={question.explanation || ""}
              onChange={(e) => updateField("explanation", e.target.value)}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-gray-50 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#217486] text-white rounded-lg hover:bg-[#1a5d6d] font-medium transition-colors shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
            disabled={isProcessing}
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;