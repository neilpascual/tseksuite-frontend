import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Plus, Edit2, Trash2, X, ArrowLeft } from "lucide-react";

const QuestionModal = ({ isOpen, onClose, question, setQuestion, onSave }) => {
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
      options: [...prev.options, { option_text: "", is_correct: false }],
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
    } else {
      setQuestion((prev) => ({
        ...prev,
        options: prev.options.map((opt, i) => ({
          ...opt,
          is_correct: i === index,
        })),
      }));
    }
  };

  const renderOptionsForType = () => {
    switch (question.question_type) {
      case "TF":
        return (
          <div className="space-y-2">
            {[
              { text: "True", value: true },
              { text: "False", value: false },
            ].map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="radio"
                  checked={question.options[i]?.is_correct || false}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="flex-1 font-medium">{opt.text}</span>
              </div>
            ))}
          </div>
        );

      case "MC":
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-teal-600 flex-shrink-0"
                />
                <input
                  value={opt.option_text}
                  onChange={(e) =>
                    updateOption(i, "option_text", e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
            >
              + Add Option
            </button>
          </div>
        );

      case "CB":
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-teal-600 flex-shrink-0"
                />
                <input
                  value={opt.option_text}
                  onChange={(e) =>
                    updateOption(i, "option_text", e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-colors"
            >
              + Add Option
            </button>
          </div>
        );

      default:
         return (
            <p className="text-gray-500 italic">
              Unsupported question type.
            </p>
          );
    }
  };

  const handleQuestionTypeChange = (newType) => {
    updateField("question_type", newType);

    if (newType === "TF") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "True", is_correct: false },
          { option_text: "False", is_correct: false },
        ],
      }));
    } 
    else if (newType === "MC" || newType === "CB") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
        ],
      }));
    }else{
      setQuestion((prev) => ({
        ...prev,
        options: [],
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-blur bg-opacity-50 flex backdrop-blur-sm items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#2E99B0] ">
              {question.question_id ? "Edit Question" : "Add New Question"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#2E99B0]" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "MC", label: "Multiple Choice" },
                { value: "CB", label: "Checkbox" },
                { value: "TF", label: "True/False" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleQuestionTypeChange(type.value)}
                  className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    question.question_type === type.value
                      ? "bg-[#2E99B0] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea
              value={question.question_text}
              onChange={(e) => updateField("question_text", e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              value={question.points}
              onChange={(e) => updateField("points", Number(e.target.value))}
              min="1"
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {question.question_type !== "DESC" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {question.question_type === "TF" ? "Correct Answer" : "Options"}
                {question.question_type === "CB" && (
                  <span className="text-gray-500 text-xs ml-2">
                    (Select all correct answers)
                  </span>
                )}
              </label>
              {renderOptionsForType()}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={question.explanation || ""}
              onChange={(e) => updateField("explanation", e.target.value)}
              placeholder="Add an explanation for this question..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#2E99B0] rounded-lg text-[#2E99B0] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-[#2E99B0] text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
};

const QuestionManagement = ({ quiz, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api";

  const emptyQuestion = {
    question_text: "",
    question_type: "MC",
    points: 1,
    explanation: "",
    options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  };

  const [currentQuestion, setCurrentQuestion] = useState(emptyQuestion);

  useEffect(() => {
    if (quiz?.quiz_id) {
      fetchQuestions();
    }
  }, [quiz?.quiz_id]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/question/get/${quiz.quiz_id}`
      );

      const questionsData = response.data.data || [];

      // Fetch options for each question individually
      const questionsWithOptions = await Promise.all(
        questionsData.map(async (q) => {
          try {
            const optionsResponse = await axios.get(
              `${API_BASE_URL}/answer/get/${q.question_id}`
            );
            const questionOptions = optionsResponse.data.data || [];

            return {
              ...q,
              options: questionOptions.map((opt) => ({
                answer_id: opt.answer_id,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
              })),
            };
          } catch (err) {
            console.error(
              `Error fetching options for question ${q.question_id}:`,
              err
            );
            return { ...q, options: [] };
          }
        })
      );

      setQuestions(questionsWithOptions);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch questions");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setCurrentQuestion(emptyQuestion);
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (index) => {
    setCurrentQuestion({ ...questions[index] });
    setEditingIndex(index);
    setModalOpen(true);
  };

  const saveQuestion = async () => {
    if (!currentQuestion.question_text.trim()) {
      return alert("Question text is required.");
    }

    if (currentQuestion.question_type !== "DESC") {
      if (
        currentQuestion.question_type === "MC" ||
        currentQuestion.question_type === "TF"
      ) {
        if (!currentQuestion.options.some((o) => o.is_correct)) {
          return alert("Please select the correct answer.");
        }
      } else if (currentQuestion.question_type === "CB") {
        if (!currentQuestion.options.some((o) => o.is_correct)) {
          return alert("Please select at least one correct answer.");
        }
      }

      if (
        currentQuestion.question_type !== "TF" &&
        currentQuestion.options.some((o) => !o.option_text.trim())
      ) {
        return alert("All options must have text.");
      }
    }

    try {
      if (editingIndex !== null) {
        // Update existing question
        await axios.put(
          `${API_BASE_URL}/question/${quiz.quiz_id}/update/${currentQuestion.question_id}`,
          {
            quiz_id: quiz.quiz_id,
            question_text: currentQuestion.question_text,
            question_type: currentQuestion.question_type,
            points: currentQuestion.points,
            explanation: currentQuestion.explanation,
          }
        );

        // Update or create options
        for (const option of currentQuestion.options) {
          if (option.answer_id) {
            // Update existing option
            await axios.put(
              `${API_BASE_URL}/answer/${option.answer_id}/update`,
              {
                option_text: option.option_text,
                is_correct: option.is_correct,
              }
            );
          } else {
            // Create new option
            await axios.post(
              `${API_BASE_URL}/answer/${currentQuestion.question_id}/create`,
              {
                option_text: option.option_text,
                is_correct: option.is_correct,
              }
            );
          }
        }

        // Handle deleted options (if any)
        const originalQuestion = questions[editingIndex];
        const currentOptionIds = currentQuestion.options
          .map((opt) => opt.answer_id)
          .filter(Boolean);
        const deletedOptions = originalQuestion.options.filter(
          (opt) => opt.answer_id && !currentOptionIds.includes(opt.answer_id)
        );

        for (const deletedOpt of deletedOptions) {
          await axios.delete(
            `${API_BASE_URL}/answer/${deletedOpt.answer_id}/delete`
          );
        }
      } else {
        // Create new question
        const questionResponse = await axios.post(
          `${API_BASE_URL}/question/${quiz.quiz_id}/create`,
          {
            quiz_id: quiz.quiz_id,
            question_text: currentQuestion.question_text,
            question_type: currentQuestion.question_type,
            points: currentQuestion.points,
            explanation: currentQuestion.explanation,
          }
        );

        const newQuestionId = questionResponse.data.data.question_id;

        // Create options for the new question
        if (currentQuestion.question_type !== "DESC") {
          for (const option of currentQuestion.options) {
            await axios.post(`${API_BASE_URL}/answer/${newQuestionId}/create`, {
              option_text: option.option_text,
              is_correct: option.is_correct,
            });
          }
        }
      }

      await fetchQuestions();
      setModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save question");
      console.error("Error saving question:", err);
      alert("Error saving question. Please try again.");
    }
  };

  const deleteQuestion = async (index) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    const question = questions[index];

    try {
      // Delete all answer options first
      for (const option of question.options) {
        if (option.answer_id) {
          await axios.delete(
            `${API_BASE_URL}/answer/${option.answer_id}/delete`
          );
        }
      }

      // Delete the question
      await axios.delete(
        `${API_BASE_URL}/question/${quiz.quiz_id}/delete/${question.question_id}`
      );

      await fetchQuestions();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question");
      console.error("Error deleting question:", err);
      alert("Error deleting question. Please try again.");
    }
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      MC: "Multiple Choice",
      CB: "Checkbox",
      TF: "True/False",
      // DESC: "Descriptive",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Quizzes</span>
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-[#2E99B0]">
              {quiz?.quiz_name || "Question Bank"}
            </h1>
            <p className="text-gray-600 mt-1">Manage your test questions</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-3 bg-[#2E99B0] text-white rounded-lg hover:bg-cyan-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>
        </div>
        <div className="mb-5">
          <p className="text-2xl">Questions</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium text-sm">Error</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first question
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                        {getQuestionTypeLabel(q.question_type)}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600 text-sm">
                        <Clock className="w-4 h-4" />
                        {q.points} {q.points === 1 ? "point" : "points"}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium text-lg mb-2">
                      {q.question_text}
                    </p>
                    {q.question_type !== "DESC" &&
                      q.options &&
                      q.options.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {q.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-2 text-sm ${
                                opt.is_correct
                                  ? "text-teal-700 font-medium"
                                  : "text-gray-600"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  opt.is_correct ? "bg-teal-500" : "bg-gray-300"
                                }`}
                              ></span>
                              {opt.option_text}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(i)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(i)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <QuestionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          question={currentQuestion}
          setQuestion={setCurrentQuestion}
          onSave={saveQuestion}
        />
      </div>
    </div>
  );
};

export default QuestionManagement;