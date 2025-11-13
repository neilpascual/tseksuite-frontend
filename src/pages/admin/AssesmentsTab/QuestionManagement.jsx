import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Plus, Edit2, Trash2, X, ArrowLeft, CheckCircle, Circle } from "lucide-react";

const API_BASE_URL = "http://localhost:3000/api";

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
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#217486] transition-colors"
              >
                <input
                  type="radio"
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-[#217486] focus:ring-[#217486]"
                />
                <span className="font-medium text-gray-700">{opt.option_text}</span>
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
                  className="w-4 h-4 text-[#217486] focus:ring-[#217486]"
                />
                <input
                  value={opt.option_text}
                  onChange={(e) =>
                    updateOption(i, "option_text", e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#217486] hover:bg-gray-50 text-gray-600 transition-colors"
            >
              + Add Option
            </button>
          </div>
        );
      default:
        return <p className="italic text-gray-500">Unsupported type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-5 bg-gradient-to-r from-[#217486] to-[#2a8fa5] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {question.question_id ? "Edit Question" : "Add New Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Type Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Question Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["MC", "CB", "TF"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`py-2.5 rounded-lg font-medium transition-all ${
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
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Question Text
            </label>
            <textarea
              placeholder="Enter your question here..."
              value={question.question_text}
              onChange={(e) => updateField("question_text", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Points */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Points
            </label>
            <input
              type="number"
              min={1}
              value={question.points}
              onChange={(e) => updateField("points", Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg w-24 focus:ring-2 focus:ring-[#217486] focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Answer Options
            </label>
            {renderOptions()}
          </div>

          {/* Explanation */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Explanation (Optional)
            </label>
            <textarea
              placeholder="Add an explanation for the correct answer..."
              value={question.explanation || ""}
              onChange={(e) => updateField("explanation", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="p-5 bg-gray-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-[#217486] text-white rounded-lg hover:bg-[#1a5d6d] font-medium transition-colors shadow-lg shadow-[#217486]/30"
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
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Delete Question</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this question?
          <br />
          <span className="font-semibold text-gray-800 mt-2 block">"{questionText}"</span>
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-600/30"
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
      const res = await axios.get(
        `${API_BASE_URL}/question/get/${quiz.quiz_id}`
      );
      const data = res.data.data || [];

      const withOptions = await Promise.all(
        data.map(async (q) => {
          const optRes = await axios.get(
            `${API_BASE_URL}/answer/get/${q.question_id}`
          );
          return { ...q, options: optRes.data.data || [] };
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
      await axios.delete(
        `${API_BASE_URL}/question/${quiz.quiz_id}/delete/${question.question_id}`
      );
      setDeleteModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSave = async () => {
    const q = currentQuestion;
    if (!q.question_text.trim()) return alert("Question text required");

    if (editingIndex !== null) {
      await axios.put(
        `${API_BASE_URL}/question/${quiz.quiz_id}/update/${q.question_id}`,
        q
      );

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
          await axios.post(
            `${API_BASE_URL}/answer/${q.question_id}/create`,
            opt
          );
        }
      }

      for (const oldId of originalIds) {
        if (!q.options.find((o) => o.answer_id === oldId)) {
          await axios.delete(`${API_BASE_URL}/answer/${oldId}/delete`);
        }
      }
    } else {
      const res = await axios.post(
        `${API_BASE_URL}/question/${quiz.quiz_id}/create`,
        q
      );
      const newId = res.data.data.question_id;
      for (const opt of q.options) {
        await axios.post(`${API_BASE_URL}/answer/${newId}/create`, opt);
      }
    }

    setModalOpen(false);
    fetchQuestions();
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case "MC": return "Multiple Choice";
      case "CB": return "Checkbox";
      case "TF": return "True/False";
      default: return type;
    }
  };

  const getTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#217486] mb-4 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Quizzes
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#217486] mb-2">
                {quiz.quiz_name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-[#217486]">{questions.length}</span> Questions
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold text-[#217486]">{getTotalPoints()}</span> Total Points
                </span>
              </div>
            </div>
          
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30 hover:shadow-xl hover:shadow-[#217486]/40"
            >
              <Plus className="w-5 h-5" /> Add Question
            </button>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-[#217486]/20 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading questions...</p>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Circle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Questions Yet</h3>
            <p className="text-gray-500 mb-6">Start building your quiz by adding your first question.</p>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30"
            >
              <Plus className="w-5 h-5" /> Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-[#217486] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <h3 className="font-semibold text-lg text-gray-800 leading-tight">
                          {q.question_text}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-11 mb-3">
                        <span className="px-3 py-1 bg-[#217486]/10 text-[#217486] rounded-lg text-xs font-semibold">
                          {getTypeLabel(q.question_type)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                          {q.points} {q.points === 1 ? "point" : "points"}
                        </span>
                      </div>

                      <div className="ml-11 space-y-2">
                        {q.options.map((opt, j) => (
                          <div
                            key={j}
                            className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                              opt.is_correct
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50"
                            }`}
                          >
                            {opt.is_correct ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className={opt.is_correct ? "text-green-800 font-medium" : "text-gray-600"}>
                              {opt.option_text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openEdit(i)}
                        className="p-2.5 text-[#217486] hover:bg-[#217486]/10 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteIndex(i);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="ml-11 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-semibold">Explanation: </span>
                        {q.explanation}
                      </p>
                    </div>
                  )}
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