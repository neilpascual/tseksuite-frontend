import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  MoreVertical,
  Trash2,
  Edit2,
  ArrowLeft,
  Clock,
  Link as LinkIcon,
  Copy,
  Check,
} from "lucide-react";
import QuestionManagement from "./QuestionManagement";

const QuizManagement = ({ department, onBack }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ quiz_name: "", time_limit: "" });
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [deletingQuiz, setDeletingQuiz] = useState(null);
  const [selectedQuizForInvite, setSelectedQuizForInvite] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const API_BASE_URL = `http://localhost:3000/api/quiz`;
  const INVITE_API_BASE_URL = `http://localhost:3000/api/invitation`;

  useEffect(() => {
    fetchQuizzes();
  }, [department.dept_id]);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/get/${department.dept_id}`);
      setQuizzes(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch quizzes");
      console.error("Error fetching quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.quiz_name.trim() || !newQuiz.time_limit) return;

    try {
      await axios.post(
        `${API_BASE_URL}/${department.dept_id}/create`,
        {
          dept_id: department.dept_id,
          quiz_name: newQuiz.quiz_name,
          time_limit: parseInt(newQuiz.time_limit),
        }
      );

      await fetchQuizzes();
      setNewQuiz({ quiz_name: "", time_limit: "" });
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
      console.error("Error creating quiz:", err);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz || !editingQuiz.quiz_name.trim() || !editingQuiz.time_limit) return;

    try {
      await axios.put(
        `${API_BASE_URL}/${department.dept_id}/update/${editingQuiz.quiz_id}`,
        {
          quiz_name: editingQuiz.quiz_name,
          time_limit: parseInt(editingQuiz.time_limit),
        }
      );

      await fetchQuizzes();
      setShowEditModal(false);
      setEditingQuiz(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quiz");
      console.error("Error updating quiz:", err);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/${department.dept_id}/delete/${deletingQuiz.quiz_id}`
      );

      await fetchQuizzes();
      setShowDeleteModal(false);
      setDeletingQuiz(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete quiz");
      console.error("Error deleting quiz:", err);
    }
  };

  const handleGenerateInvite = async () => {
    if (!inviteEmail.trim() || !selectedQuizForInvite) return;

    try {
      const response = await axios.post(`${INVITE_API_BASE_URL}/generate`, {
        email: inviteEmail,
        quiz_id: selectedQuizForInvite.quiz_id,
        dept_id: department.dept_id,
      });

      setGeneratedLink(response.data.data.link);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate invitation link");
      console.error("Error generating invitation:", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInviteModal = (quiz) => {
    setSelectedQuizForInvite(quiz);
    setShowInviteModal(true);
    setInviteEmail("");
    setGeneratedLink("");
    setCopied(false);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setSelectedQuizForInvite(null);
    setInviteEmail("");
    setGeneratedLink("");
    setCopied(false);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If a quiz is selected, show the question management page
  if (selectedQuiz) {
    return (
      <QuestionManagement
        quiz={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Categories</span>
        </button>

        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl text-[#2E99B0] mb-1 font-['Poppins']">
                {department.dept_name}
              </h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#2E99B0] text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm hover:bg-cyan-700"
            >
              <Plus size={20} />
              <span className="font-medium">Add Test Categories</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg text-gray-700 font-['Poppins']">Quizzes</h2>
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
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg">No quizzes found</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first quiz to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredQuizzes.map((quiz) => (
              <div
                onClick={() => setSelectedQuiz(quiz)}
                key={quiz.quiz_id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow relative"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-['Poppins'] text-[#2E99B0] mb-1">
                      {quiz.quiz_name}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === quiz.quiz_id ? null : quiz.quiz_id
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === quiz.quiz_id && (
                    <div className="absolute right-5 top-14 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => {
                          setEditingQuiz({ ...quiz });
                          setShowEditModal(true);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingQuiz(quiz);
                          setShowDeleteModal(true);
                          setOpenMenuId(null);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <Clock size={14} className="text-teal-600" />
                  <span className="text-xs text-gray-600 font-medium">
                    {quiz.time_limit} min
                  </span>
                </div>

                {/* <div className="h-24 mb-4"></div> */}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => openInviteModal(quiz)}
                    className="flex items-center gap-2 bg-[#2E99B0] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-emerald-700"
                  >
                    <LinkIcon size={18} />
                    Invite
                  </button>
                  {/* <button 
                    onClick={() => setSelectedQuiz(quiz)}
                    className="bg-[#2E99B0] text-white px-6 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-cyan-700"
                  >
                    View
                  </button> */}
                </div>

                <div className="mt-3">
                  <p className="text-xs text-gray-400">12 / 20</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-blur bg-opacity-50  backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Quiz
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Name
                </label>
                <input
                  type="text"
                  value={newQuiz.quiz_name}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, quiz_name: e.target.value })
                  }
                  placeholder="Enter quiz name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleAddQuiz()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={newQuiz.time_limit}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, time_limit: e.target.value })
                  }
                  placeholder="Enter time limit"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewQuiz({ quiz_name: "", time_limit: "" });
                }}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuiz}
                disabled={!newQuiz.quiz_name.trim() || !newQuiz.time_limit}
                className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQuiz && (
        <div className="fixed inset-0 bg-blur bg-opacity-100 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Quiz</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Name
                </label>
                <input
                  type="text"
                  value={editingQuiz.quiz_name}
                  onChange={(e) =>
                    setEditingQuiz({
                      ...editingQuiz,
                      quiz_name: e.target.value,
                    })
                  }
                  placeholder="Quiz name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleUpdateQuiz()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={editingQuiz.time_limit}
                  onChange={(e) =>
                    setEditingQuiz({
                      ...editingQuiz,
                      time_limit: e.target.value,
                    })
                  }
                  placeholder="Time limit"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingQuiz(null);
                }}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuiz}
                disabled={
                  !editingQuiz.quiz_name.trim() || !editingQuiz.time_limit
                }
                className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingQuiz && (
        <div className="fixed inset-0 bg-blur bg-opacity-50 flex backdrop-blur-sm items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Delete Quiz
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {deletingQuiz.quiz_name}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingQuiz(null);
                }}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Link Modal */}
      {showInviteModal && selectedQuizForInvite && (
        <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon size={28} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Generate Invite Link
            </h2>
            <p className="text-gray-600 text-center mb-6">
              {selectedQuizForInvite.quiz_name}
            </p>
            
            {!generatedLink ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Participant Email
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && handleGenerateInvite()}
                    autoFocus
                  />
                  {/* edit for time */}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration
                  </label>
                  <input
                    type="number"
                    // value={inviteEmail}
                    // onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter Expiration Time(Hours)"
                    min={1}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    // onKeyPress={(e) => e.key === "Enter" && handleGenerateInvite()}
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeInviteModal}
                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGenerateInvite}
                    disabled={!inviteEmail.trim()}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Link
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invitation Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check size={20} className="text-emerald-600" />
                      ) : (
                        <Copy size={20} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  {copied && (
                    <p className="text-sm text-emerald-600 mt-2">
                      Link copied to clipboard!
                    </p>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    This link will expire in 24 hours and can only be used once.
                  </p>
                </div>
                <button
                  onClick={closeInviteModal}
                  className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;