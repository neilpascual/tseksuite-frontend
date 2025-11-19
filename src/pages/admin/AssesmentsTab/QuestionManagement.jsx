import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowLeft,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Plus, Edit2, Trash2, X, ArrowLeft, CheckCircle, Circle } from "lucide-react";
import toast from "react-hot-toast";
import { addAnswer, addQuestion, deleteAnswer, deleteQuestion, getAnswer, getQuestions, updateAnswer, updateQuestion } from "../../../../api/api";

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

  const handleTypeChange = (type) => {
    updateField("question_type", type);
    if (type === "TF") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "True", is_correct: false },
          { option_text: "False", is_correct: false },
        ],
      }));
    } else {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
        ],
      }));
    }
  };

  const renderOptions = () => {
    switch (question.question_type) {
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
                <span className="font-medium text-gray-700">
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
        return <p className="italic text-gray-500 text-sm">Unsupported type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#217486] to-[#2a8fa5] flex justify-between items-center">
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
          {/* Type Selector */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Question Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["MC", "CB", "TF"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    question.question_type === t
                      ? "bg-[#217486] text-white shadow-lg shadow-[#217486]/30"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {t === "MC"
                    ? "Multiple Choice"
                    : t === "CB"
                    ? "Checkbox"
                    : "True/False"}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
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

          {/* Points */}
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

          {/* Options */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Answer Options
            </label>
            {renderOptions()}
          </div>

          {/* Explanation */}
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
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, questionText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl mx-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Delete Question</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Are you sure you want to delete this question?
          <br />
          <span className="font-semibold text-gray-800 mt-2 block break-words">"{questionText}"</span>
        </p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-600/30 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const QuestionManagement = ({ quiz, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (quiz?.quiz_id) fetchQuestions();
  }, [quiz?.quiz_id]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await getQuestions(quiz.quiz_id)

      const withOptions = await Promise.all(
        res.map(async (q) => {
          const optRes = await getAnswer(q.question_id)
          return { ...q, options: optRes };
        })
      );

      setQuestions(withOptions);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setCurrentQuestion({ ...emptyQuestion });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEdit = (i) => {
    setCurrentQuestion(JSON.parse(JSON.stringify(questions[i])));
    setEditingIndex(i);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    const question = questions[deleteIndex];
    try {
      await deleteQuestion(quiz.quiz_id, question.question_id)
      //added toast
      toast.success("Question Deleted!");
      setDeleteModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Question Deletion Failed!");
    }
  };

  const handleSave = async () => {
    const q = currentQuestion;
    if (!q.question_text.trim()) return toast.error("Question text required");

    //added to check if the options are empty
    if (q.question_type === "MC" || q.question_type === "CB") {
      if (!q.options || q.options.length < 2) {
        return toast.error("At least 2 options are required");
      }
      // Also check that all options have text
    if ((q.question_type === "MC" || q.question_type === "CB")) {
      if (!q.options || q.options.length < 2) {
        return toast.error("At least 2 options are required");
      }
      for (let i = 0; i < q.options.length; i++) {
        if (!q.options[i].option_text.trim()) {
          return toast.error(`All options must have text!`);
        }
      }
    }

    if (editingIndex !== null) {
      await updateQuestion(quiz.quiz_id, q.question_id, q)
      //added updated toast
      toast.success("Question Updated!");
      const original = questions[editingIndex];
      const originalIds = original.options
        .map((o) => o.answer_id)
        .filter(Boolean);

      for (const opt of q.options) {
        if (opt.answer_id) {
          await axios.put(
            `${API_BASE_URL}/answer/${opt.answer_id}/update`,
            opt
          );
        } else {
          await addAnswer(q.question_id, opt)
        }
      }

      for (const oldId of originalIds) {
        if (!q.options.find((o) => o.answer_id === oldId)) {
          await deleteAnswer(oldId)
        }
      }
    } else {
      const { question_id } = await addQuestion(quiz.quiz_id, q)
      //added toast
      toast.success("Question Added!");
      const newId = res.data.data.question_id;
      for (const opt of q.options) {
        await addAnswer(question_id, opt)
      }
    }
    setModalOpen(false);
    fetchQuestions();
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "MC":
        return "Multiple Choice";
      case "CB":
        return "Checkbox";
      case "TF":
        return "True/False";
      default:
        return type;
    }
  };

  const getTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
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
              <h1 className="text-2xl sm:text-3xl font-bold text-[#217486] mb-2 break-words">
                {quiz.quiz_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="font-semibold text-[#217486]">{getTotalPoints()}</span> Total Points
                </span>
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="font-semibold text-[#217486]">{questions.length}</span> Questions
                </span>
              </div>
            </div>

            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all hover:shadow-xl hover:shadow-[#217486]/40"
            >
              <Plus className="w-5 h-5 hidden sm:inline" /> Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="animate-pulse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#217486]/20 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading questions...</p>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Circle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Questions Yet</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">Start building your quiz by adding your first question.</p>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3 mb-3">
                        <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#217486] text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm">
                          {i + 1}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 leading-tight break-words">
                          {q.question_text}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 ml-11 mb-3">
                        <span className="px-3 py-1 bg-[#217486]/10 text-[#217486] rounded-lg text-xs font-semibold">
                          {getTypeLabel(q.question_type)}
                        </span>
                        <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                          {q.points} {q.points === 1 ? "point" : "points"}
                        </span>
                      </div>

                      <div className="ml-9 sm:ml-11 space-y-2">
                        {q.options.map((opt, j) => (
                          <div
                            key={j}
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
                            <span className={`break-words ${opt.is_correct ? "text-green-800 font-medium" : "text-gray-600"}`}>
                              {opt.option_text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <div className="ml-9 sm:ml-11 mt-3 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs sm:text-sm text-blue-900 break-words">
                            <span className="font-semibold">Explanation: </span>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 ml-4 sm:ml-4">
                      <button
                        onClick={() => openEdit(i)}
                        className="flex-1 sm:flex-none p-2 sm:p-2.5 text-[#217486] hover:bg-[#217486]/10 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteIndex(i);
                          setDeleteModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                    </div>
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
          onSave={handleSave}
        />

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          questionText={questions[deleteIndex]?.question_text}
        />
      </div>
    </div>
  );
};

export default QuestionManagement;
