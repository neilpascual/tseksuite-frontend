import { getQuestionTypeLabel } from "../../../../../helpers/helpers";

const QuestionCard = ({ 
  question, 
  index, 
  selectedAnswers, 
  descriptiveAnswers, 
  onAnswerSelect, 
  onDescriptiveAnswer 
}) => {
  const isSelected = (answerId) => {
    if (question.question_type === "CB") {
      return selectedAnswers[index]?.includes(answerId) || false;
    } else {
      return selectedAnswers[index] === answerId;
    }
  };

  return (
    <div className="mb-10">
      <div className="p-6 bg-white rounded-xl overflow-y-auto"  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
              Q{index + 1}
            </span>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
              {getQuestionTypeLabel(question.question_type)}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 leading-relaxed">
            {question.question_text}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.question_type === "DESC" ? (
            <div>
              <textarea
                value={descriptiveAnswers[index] || ""}
                onChange={(e) => onDescriptiveAnswer(index, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-4 rounded-xl text-base border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none resize-none transition-all"
                rows={6}
                style={{ minHeight: "150px" }}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500">
                  Characters: {(descriptiveAnswers[index] || "").length}
                </p>
              </div>
            </div>
          ) : (
            question.options.map((option) => (
              <button
                key={option.answer_id}
                onClick={() => onAnswerSelect(index, option.answer_id, question.question_type)}
                className={`w-full p-4 rounded-xl text-left text-base transition-all duration-200 border-2 ${
                  isSelected(option.answer_id)
                    ? "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-500 shadow-md"
                    : "bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  {question.question_type === "CB" ? (
                    <div
                      className={`w-6 h-6 shrink-0 mt-0.5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected(option.answer_id)
                          ? "bg-cyan-600 border-cyan-600"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected(option.answer_id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`w-6 h-6 shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected(option.answer_id)
                          ? "border-cyan-600 bg-cyan-600"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected(option.answer_id) && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  )}
                  <span
                    className={`leading-relaxed ${
                      isSelected(option.answer_id) ? "font-medium text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {option.option_text}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
        <style>
    {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
  </style>
      </div>
      <hr className="mt-8 border-gray-300" />
    </div>
  );
};

export default QuestionCard;