import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Plus, Edit2, Trash2, X, ArrowLeft } from "lucide-react";

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
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <input
                  type="radio"
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="font-medium">{opt.option_text}</span>
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
                  className="w-4 h-4 text-teal-600"
                />
                <input
                  value={opt.option_text}
                  onChange={(e) =>
                    updateOption(i, "option_text", e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
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
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 text-gray-600"
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#2E99B0]">
            {question.question_id ? "Edit Question" : "Add Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-[#2E99B0]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Question Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["MC", "CB", "TF"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`py-2 rounded-lg ${
                    question.question_type === t
                      ? "bg-[#2E99B0] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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
          <textarea
            placeholder="Enter question text..."
            value={question.question_text}
            onChange={(e) => updateField("question_text", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows={3}
          />

          {/* Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              min={1}
              value={question.points}
              onChange={(e) => updateField("points", Number(e.target.value))}
              className="px-3 py-2 border rounded-lg w-24 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Options */}
          {renderOptions()}

          {/* Explanation */}
          <textarea
            placeholder="Explanation (optional)..."
            value={question.explanation || ""}
            onChange={(e) => updateField("explanation", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            rows={2}
          />
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#2E99B0] text-[#2E99B0] rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-[#2E99B0] text-white rounded-lg hover:bg-teal-600"
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-3">Delete Question</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this question?
          <br />
          <span className="font-medium">{questionText}</span>
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
    setCurrentQuestion(JSON.parse(JSON.stringify(questions[i]))); // deep clone
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
      // Update existing question
      await axios.put(
        `${API_BASE_URL}/question/${quiz.quiz_id}/update/${q.question_id}`,
        q
      );

      const original = questions[editingIndex];
      const originalIds = original.options
        .map((o) => o.answer_id)
        .filter(Boolean);

      // Update or create options
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

      // Delete removed options
      for (const oldId of originalIds) {
        if (!q.options.find((o) => o.answer_id === oldId)) {
          await axios.delete(`${API_BASE_URL}/answer/${oldId}/delete`);
        }
      }
    } else {
      // Create new question
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

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft /> Back
        </button>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-3 bg-[#2E99B0] text-white rounded-lg"
        >
          <Plus /> Add Question
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="text-center text-gray-600 py-10">No questions yet.</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 hover:shadow transition flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold">{q.question_text}</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {q.points} {q.points === 1 ? "point" : "points"} •{" "}
                  {q.question_type}
                </div>
                {q.options.map((opt, j) => (
                  <div
                    key={j}
                    className={`text-sm ${
                      opt.is_correct
                        ? "text-teal-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.option_text}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(i)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setDeleteIndex(i);
                    setDeleteModalOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
  );
};

export default QuestionManagement;
