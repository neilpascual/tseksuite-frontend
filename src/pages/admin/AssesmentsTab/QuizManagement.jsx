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
  FilePlus,
} from "lucide-react";
import QuestionManagement from "./QuestionManagement";
import toast from "react-hot-toast";
import {
  getQuizzes,
  addQuiz,
  deleteQuiz,
  editQuiz,
  generateInviteLink,
} from "../../../../api/api";

const QuizManagement = ({ department, onBack }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ 
    quiz_name: "", 
    time_limit: "", 
    pdf_link: "",
    is_pdf_test: false 
  });
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

  //added URL validation function
  const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
};


  const handleAddQuiz = async () => {
    if (!newQuiz.quiz_name.trim()) {
      toast.error("Please enter a quiz name");
      return;
    }

    // Standard quiz validation
    if (!newQuiz.is_pdf_test && !newQuiz.time_limit) {
      toast.error("Please enter time limit for standard quiz");
      return;
    }

    // PDF test validation
    if (newQuiz.is_pdf_test && !newQuiz.pdf_link.trim()) {
      toast.error("Please enter PDF link for PDF test");
      return;
    }

    try {
      // Try different payload structures
      let payload;
      
      if (newQuiz.is_pdf_test) {
        // For PDF test - only include pdf_link, exclude time_limit
        payload = {
          dept_id: department.dept_id,
          quiz_name: newQuiz.quiz_name,
          pdf_link: newQuiz.pdf_link.trim(),
          // Don't include time_limit for PDF tests
        };
      } else {
        // For standard quiz - only include time_limit, exclude pdf_link
        payload = {
          dept_id: department.dept_id,
          quiz_name: newQuiz.quiz_name,
          time_limit: parseInt(newQuiz.time_limit),
          // Don't include pdf_link for standard quizzes
        };
      }

      console.log("Creating quiz with payload:", payload);

      await addQuiz(department.dept_id, payload);
      await fetchQuizzes();
      setNewQuiz({ 
        quiz_name: "", 
        time_limit: "", 
        pdf_link: "",
        is_pdf_test: false 
      });
      toast.success(newQuiz.is_pdf_test ? "PDF Test Added!" : "Quiz Added!");
      setShowAddModal(false);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to create quiz";
      setError(errorMessage);
      console.error("Error creating quiz:", err);
      console.error("Error response data:", err.response?.data);
      toast.error(newQuiz.is_pdf_test ? "PDF Test Creation Failed!" : "Quiz Creation Failed!");
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz || !editingQuiz.quiz_name.trim()) return;

    // Standard quiz: time_limit required
    if (!editingQuiz.pdf_link && !editingQuiz.time_limit) {
      toast.error("Please enter time limit for standard quiz");
      return;
    }

    // PDF test: pdf_link required
    // if (editingQuiz.pdf_link && !editingQuiz.pdf_link.trim()) {
    //   toast.error("Please enter PDF link for PDF test");
    //   return;
    // }

    // PDF test: pdf_link required and must be valid URL
if (editingQuiz.is_pdf_test) {
  if (!editingQuiz.pdf_link.trim()) {
    toast.error("Please enter PDF link for PDF test");
    return;
  }
  if (!isValidURL(editingQuiz.pdf_link.trim())) {
    toast.error("Please enter a valid URL");
    return;
  }
}


    try {
      let payload;
      
      if (editingQuiz.pdf_link) {
        // For PDF test - only update pdf_link, exclude time_limit
        payload = {
          quiz_name: editingQuiz.quiz_name,
          pdf_link: editingQuiz.pdf_link.trim(),
          // Don't include time_limit when updating PDF tests
        };
      } else {
        // For standard quiz - only update time_limit, exclude pdf_link
        payload = {
          quiz_name: editingQuiz.quiz_name,
          time_limit: parseInt(editingQuiz.time_limit),
          // Don't include pdf_link when updating standard quizzes
        };
      }

      console.log("Update payload:", payload);

      await editQuiz(department.dept_id, editingQuiz.quiz_id, payload);
      await fetchQuizzes();
      toast.success("Quiz Updated!");
      setShowEditModal(false);
      setEditingQuiz(null);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to update quiz";
      setError(errorMessage);
      console.error("Error updating quiz:", err);
      toast.error("Quiz Update Failed!");
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    try {
      await deleteQuiz(department.dept_id, deletingQuiz.quiz_id);
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

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center justify-center gap-2 bg-[#217486] text-white px-6 py-3 rounded-xl hover:bg-[#1a5d6d] font-medium transition-all hover:shadow-xl hover:shadow-[#217486]/40"
              >
                <Plus className="w-5 h-5 hidden sm:inline" />
                Create Quiz
              </button>
            </div>
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
                <div
                  className={`p-4 sm:p-5 ${
                    quiz.pdf_link
                      ? "bg-gradient-to-br from-[#2a8fa5] to-[#217486]"
                      : "bg-gradient-to-br from-[#217486] to-[#2a8fa5]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-tight break-words">
                        {quiz.quiz_name}
                      </h3>
                      {quiz.pdf_link ? (
                          <span className="inline-block mt-2 px-2 py-1 bg-white/20 text-white text-xs rounded-md font-medium">
                            PDF Test
                          </span>
                        ) : (
                          <span className="inline-block mt-2 px-2 py-1 bg-white/20 text-white text-xs rounded-md font-medium">
                            Standard Test
                          </span>
                        )}
                    </div>
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
                              //added
                              setEditingQuiz({ ...quiz, is_pdf_test: !!quiz.pdf_link });
                              setShowEditModal(true);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-[#217486]" />
                            Edit {quiz.pdf_link ? "Test" : "Quiz"}
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
                            Delete {quiz.pdf_link ? "Test" : "Quiz"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/90">
                    {quiz.time_limit && (
                      <Clock className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {quiz.time_limit}{" "}
                      {!quiz.pdf_link && (quiz.time_limit === 1 ? "minute" : "minutes")}
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

                  <div className="flex flex-col gap-2">
                    {/* PDF test, if 0 questions, invite button disabled */}
                    {quiz.pdf_link ? (
                      <>
                        <div className="flex gap-2">
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
                              window.open(quiz.pdf_link, "_blank");
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            Preview
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInviteModal(quiz);
                          }}
                          disabled={!quiz.question_count || quiz.question_count === 0} 
                          className="w-full flex items-center justify-center gap-2 bg-[#217486] hover:bg-[#1a5d6d] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#217486]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#217486]"
                          title={
                            !quiz.question_count || quiz.question_count === 0
                              ? "Add questions before generating invites"
                              : "Generate invite link"
                          }
                        >
                          <LinkIcon className="w-4 h-4" />
                          Invite
                        </button>
                      </>
                    ) : (
                      <div className="flex gap-2">
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unified Add Quiz Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#217486] to-[#2a8fa5] p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Create New Quiz
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Add a new quiz to your department
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              {/* Quiz Type Toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quiz Type
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setNewQuiz({ ...newQuiz, is_pdf_test: false, pdf_link: "" })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                      !newQuiz.is_pdf_test
                        ? "border-[#217486] bg-[#217486] text-white shadow-lg shadow-[#217486]/30"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">Standard Quiz</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewQuiz({ ...newQuiz, is_pdf_test: true, time_limit: "" })}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                      newQuiz.is_pdf_test
                        ? "border-[#2a8fa5] bg-[#2a8fa5] text-white shadow-lg shadow-[#2a8fa5]/30"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <FilePlus className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm">PDF Test</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {newQuiz.is_pdf_test ? "Test" : "Quiz"} Name
                </label>
                <input
                  type="text"
                  value={newQuiz.quiz_name}
                  onChange={(e) =>
                    setNewQuiz({ ...newQuiz, quiz_name: e.target.value })
                  }
                  placeholder={`Enter ${newQuiz.is_pdf_test ? "test" : "quiz"} name`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleAddQuiz()}
                  autoFocus
                />
              </div>

              {/* Conditional Fields */}
              {!newQuiz.is_pdf_test ? (
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
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Drive PDF Link
                  </label>
                  <input
                    type="url"
                    value={newQuiz.pdf_link}
                    onChange={(e) =>
                      setNewQuiz({ ...newQuiz, pdf_link: e.target.value })
                    }
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a8fa5] focus:border-transparent text-sm sm:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Paste the shareable link from Google Drive
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewQuiz({ 
                    quiz_name: "", 
                    time_limit: "", 
                    pdf_link: "",
                    is_pdf_test: false 
                  });
                }}
                className="flex-1 px-4 py-3 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddQuiz}
                disabled={
                  !newQuiz.quiz_name.trim() || 
                  (!newQuiz.is_pdf_test && !newQuiz.time_limit) ||
                  // (newQuiz.is_pdf_test && !newQuiz.pdf_link.trim())
                  (newQuiz.is_pdf_test && (!newQuiz.pdf_link.trim() || !isValidURL(newQuiz.pdf_link.trim())))
                }
                className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base ${
                  newQuiz.is_pdf_test 
                    ? "bg-[#2a8fa5] hover:bg-[#217486] shadow-[#2a8fa5]/30" 
                    : "bg-[#217486] hover:bg-[#1a5d6d] shadow-[#217486]/30"
                }`}
              >
                Create {newQuiz.is_pdf_test ? "PDF Test" : "Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQuiz && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#217486] to-[#2a8fa5] p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Edit {editingQuiz.is_pdf_test ? "PDF Test" : "Quiz"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                Update {editingQuiz.is_pdf_test ? "pdf test" : "quiz"} information
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {editingQuiz.is_pdf_test ? "PDF Test" : "Quiz"} Name
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
                  placeholder={`${editingQuiz.is_pdf_test ? "PDF Test" : "Quiz"} name`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                  autoFocus
                />
              </div>
              
              {/* Conditional Fields */}
              {!editingQuiz.is_pdf_test ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={editingQuiz.time_limit || ""}
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
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Drive PDF Link
                  </label>
                  <input
                    type="url"
                    value={editingQuiz.pdf_link}
                    onChange={(e) =>
                      setEditingQuiz({
                        ...editingQuiz,
                        pdf_link: e.target.value,
                      })
                    }
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              )}
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
                  !editingQuiz.quiz_name.trim() || 
                  (!editingQuiz.pdf_link && !editingQuiz.time_limit) ||
                  // (editingQuiz.pdf_link && !editingQuiz.pdf_link.trim())
                   (editingQuiz.is_pdf_test && (!editingQuiz.pdf_link.trim() || !isValidURL(editingQuiz.pdf_link.trim())))
                }
                className="flex-1 px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
              >
                Update {editingQuiz.is_pdf_test ? "PDF Test" : "Quiz"}
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
              Delete {deletingQuiz.pdf_link ? "PDF Test" : "Quiz"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {deletingQuiz.quiz_name}
              </strong>
              ? This action cannot be undone
              {!deletingQuiz.pdf_link
                ? " and will remove all associated questions"
                : ""}
              .
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
                Delete {deletingQuiz.pdf_link ? "Test" : "Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Link Modal */}
      {showInviteModal && selectedQuizForInvite && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#217486] to-[#2a8fa5] p-6">
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
                      their email when accessing the{" "}
                      {selectedQuizForInvite.pdf_link ? "test" : "quiz"}.
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