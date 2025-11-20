import React, { useState, useEffect } from "react";
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
  FileText,
} from "lucide-react";
import QuestionManagement from "./QuestionManagement";
import toast from "react-hot-toast";
import { getQuizzes, addQuiz, deleteQuiz, editQuiz, generateInviteLink } from "../../../../api/api";

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
  const [inviteExpiration, setInviteExpiration] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

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

      const response = await getQuizzes(department.dept_id);

      setQuizzes(response);
      setError(null);
    } catch (err) {
      if (err.response?.status === 400) {
        setQuizzes([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || "Failed to fetch quizzes");
        console.error("Error fetching quizzes:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuiz = async () => {
    if (!newQuiz.quiz_name.trim() || !newQuiz.time_limit) return;

    try {
      const payload = {
        dept_id: department.dept_id,
        quiz_name: newQuiz.quiz_name,
        time_limit: parseInt(newQuiz.time_limit),
      };

      await addQuiz(department.dept_id, payload);

      await fetchQuizzes();
      setNewQuiz({ quiz_name: "", time_limit: "" });
      toast.success("Quiz Added!");
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz");
      console.error("Error creating quiz:", err);
      toast.error("Quiz Creation Failed!");
    }
  };

  const handleUpdateQuiz = async () => {
    if (
      !editingQuiz ||
      !editingQuiz.quiz_name.trim() ||
      !editingQuiz.time_limit
    )
      return;

    try {
      const payload = {
          quiz_name: editingQuiz.quiz_name,
          time_limit: parseInt(editingQuiz.time_limit),
        }
      
      await editQuiz(department.dept_id, editingQuiz.quiz_id, payload)

      await fetchQuizzes();
      toast.success("Quiz Updated!");
      setShowEditModal(false);
      setEditingQuiz(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quiz");
      console.error("Error updating quiz:", err);
      toast.error("Quiz Update Failed!");
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    try {
      await deleteQuiz(department.dept_id, deletingQuiz.quiz_id)
      await fetchQuizzes();
      toast.success("Quiz Deleted!");
      setShowDeleteModal(false);
      setDeletingQuiz(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete quiz");
      console.error("Error deleting quiz:", err);
      toast.error("Quiz Deletion Failed!");
    }
  };

  const handleGenerateInvite = async () => {
    if (!inviteExpiration || !selectedQuizForInvite) return;

    try {
      const payload = {
        email: null,
        expiration: inviteExpiration,
        quiz_id: selectedQuizForInvite.quiz_id,
        dept_id: department.dept_id,
      };
      const link = await generateInviteLink(payload);

      setGeneratedLink(link);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate invitation link"
      );
      console.error("Error generating invitation:", err);
      console.error("Error details:", err.response?.data);
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
    setInviteExpiration("");
    setGeneratedLink("");
    setCopied(false);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    setSelectedQuizForInvite(null);
    setInviteExpiration("");
    setGeneratedLink("");
    setCopied(false);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedQuiz) {
    return (
      <QuestionManagement
        quiz={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white mb-20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Card */}
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
                  </span>{" "}
                  {quizzes.length === 1 ? "Quiz" : "Quizzes"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-[#217486] text-white px-6 py-3 rounded-xl hover:bg-[#1a5d6d] font-medium transition-all hover:shadow-xl hover:shadow-[#217486]/40 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 hidden sm:inline" />
              Create Quiz
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 sm:px-5 py-4 rounded-xl mb-6 shadow-sm">
            <p className="font-semibold text-sm mb-1">Error Occurred</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-[#217486]/20 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quizzes...</p>
            </div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-[#217486]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-[#217486]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Quizzes Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first quiz to get started with assessments.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30"
            >
              <Plus className="w-5 h-5" />
              Create First Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.quiz_id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group"
              >
                <div className="bg-linear-to-br from-[#217486] to-[#2a8fa5] p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex-1 pr-2 leading-tight wrap-break-word">
                      {quiz.quiz_name}
                    </h3>
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === quiz.quiz_id ? null : quiz.quiz_id
                          );
                        }}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {openMenuId === quiz.quiz_id && (
                        <div className="absolute right-0 top-12 w-44 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingQuiz({ ...quiz });
                              setShowEditModal(true);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-[#217486]" />
                            Edit Quiz
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingQuiz(quiz);
                              setShowDeleteModal(true);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {quiz.time_limit}{" "}
                      {quiz.time_limit === 1 ? "minute" : "minutes"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4 text-[#217486]" />
                      <span className="text-sm font-medium">
                        <span className="text-[#217486] font-bold">
                          {quiz.question_count || 0}
                        </span>{" "}
                        {quiz.question_count === 1 ? "Question" : "Questions"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => setSelectedQuiz(quiz)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Manage
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInviteModal(quiz);
                      }}
                      disabled={
                        !quiz.question_count || quiz.question_count === 0
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-[#217486] hover:bg-[#1a5d6d] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#217486]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#217486]"
                      title={
                        !quiz.question_count || quiz.question_count === 0
                          ? "Add questions before generating invites"
                          : "Generate invite link"
                      }
                    >
                      <LinkIcon className="w-4 h-4" />
                      Invite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-linear-to-r from-[#217486] to-[#2a8fa5] p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Create New Quiz
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Add a new quiz to your department
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quiz Name
                </label>
                <input
                  type="text"
                  value={newQuiz.quiz_name}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, quiz_name: e.target.value })
                  }
                  placeholder="Enter quiz name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleAddQuiz()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewQuiz({ quiz_name: "", time_limit: "" });
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuiz}
                disabled={!newQuiz.quiz_name.trim() || !newQuiz.time_limit}
                className="flex-1 px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQuiz && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-linear-to-r from-[#217486] to-[#2a8fa5] p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Edit Quiz
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Update quiz information
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleUpdateQuiz()}
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingQuiz(null);
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateQuiz}
                disabled={
                  !editingQuiz.quiz_name.trim() || !editingQuiz.time_limit
                }
                className="flex-1 px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
              >
                Update Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingQuiz && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
              Delete Quiz
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {deletingQuiz.quiz_name}
              </strong>
              ? This action cannot be undone and will remove all associated
              questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingQuiz(null);
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-red-600/30 text-sm sm:text-base"
              >
                Delete Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Link Modal */}
      {showInviteModal && selectedQuizForInvite && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-linear-to-r from-[#217486] to-[#2a8fa5] p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Generate Invite
                  </h2>
                  <p className="text-white/80 text-sm truncate">
                    {selectedQuizForInvite.quiz_name}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {!generatedLink ? (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Link Expiration (Hours)
                    </label>
                    <input
                      type="number"
                      value={inviteExpiration}
                      onChange={(e) => setInviteExpiration(e.target.value)}
                      placeholder="Enter hours until expiration"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleGenerateInvite()
                      }
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      The invitation link will expire after the specified time
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={closeInviteModal}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateInvite}
                      disabled={!inviteExpiration}
                      className="flex-1 px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
                    >
                      Generate Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Invitation Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-xs sm:text-sm truncate"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-3 sm:px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors shrink-0"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Link copied to clipboard!
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs sm:text-sm text-blue-900">
                      <strong className="font-semibold">Note:</strong> Share
                      this link with examinees. They will be prompted to enter
                      their email when accessing the quiz.
                    </p>
                  </div>
                  <button
                    onClick={closeInviteModal}
                    className="w-full px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
