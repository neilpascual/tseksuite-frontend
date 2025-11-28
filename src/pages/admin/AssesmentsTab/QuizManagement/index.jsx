import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import QuestionManagement from '../../../admin/AssesmentsTab/QuestionManagement/index';
import toast from 'react-hot-toast';

import { useQuizzes } from './hooks/useQuizzes';
import { useQuizModals } from './hooks/useQuizModals';
import { addQuiz, editQuiz, deleteQuiz, generateInviteLink } from '../../../../../api/api';

import Header from './components/Header';
import QuizCard from './components/QuizCard';
import AddQuizModal from './components/Modals/AddQuizModal';
import EditQuizModal from './components/Modals/EditQuizModal';
import DeleteQuizModal from './components/Modals/DeleteQuizModal';
import InviteModal from './components/Modals/InviteModal';

const QuizManagement = ({ department, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [generatedLink, setGeneratedLink] = useState('');

  const { quizzes, loading, error, refetchQuizzes } = useQuizzes(department.dept_id);
  
  const {
    showAddModal,
    showEditModal,
    showDeleteModal,
    showInviteModal,
    editingQuiz,
    deletingQuiz,
    selectedQuizForInvite,
    setShowAddModal,
    setEditingQuiz,
    setDeletingQuiz,
    setSelectedQuizForInvite,
    openEditModal,
    openDeleteModal,
    openInviteModal,
    closeModals,
  } = useQuizModals();

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddQuiz = async (newQuizData, deptId) => {
    setIsProcessing(true);

    try {
      let payload;

      if (newQuizData.is_pdf_test) {
        const validLinks = newQuizData.pdf_links.filter((link) => link.trim() !== '');
        payload = {
          dept_id: deptId,
          quiz_name: newQuizData.quiz_name,
          pdf_link: validLinks.join(','),
        };
      } else {
        payload = {
          dept_id: deptId,
          quiz_name: newQuizData.quiz_name,
          time_limit: parseInt(newQuizData.time_limit),
        };
      }

      await addQuiz(deptId, payload);
      await refetchQuizzes();
      toast.success(newQuizData.is_pdf_test ? 'PDF Test Added!' : 'Quiz Added!');
      closeModals();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create quiz';
      console.error('Error creating quiz:', err);
      toast.error(newQuizData.is_pdf_test ? 'PDF Test Creation Failed!' : 'Quiz Creation Failed!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateQuiz = async (quizData) => {
    setIsProcessing(true);

    try {
      let payload;

      if (quizData.is_pdf_test) {
        const validLinks = quizData.pdf_links.filter((link) => link.trim() !== '');
        payload = {
          quiz_name: quizData.quiz_name,
          pdf_link: validLinks.join(','),
        };
      } else {
        payload = {
          quiz_name: quizData.quiz_name,
          time_limit: parseInt(quizData.time_limit),
        };
      }

      await editQuiz(department.dept_id, quizData.quiz_id, payload);
      await refetchQuizzes();
      toast.success('Quiz Updated!');
      closeModals();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update quiz';
      console.error('Error updating quiz:', err);
      toast.error('Quiz Update Failed!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!deletingQuiz) return;
    try {
      await deleteQuiz(department.dept_id, deletingQuiz.quiz_id);
      await refetchQuizzes();
      toast.success('Quiz Deleted!');
      closeModals();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      toast.error('Quiz Deletion Failed!');
    }
  };

  const handleGenerateInvite = async (expiration, quizId) => {
    try {
      const payload = {
        email: null,
        expiration: expiration,
        quiz_id: quizId,
        dept_id: department.dept_id,
      };
      const link = await generateInviteLink(payload);
      setGeneratedLink(link);
    } catch (err) {
      console.error('Error generating invitation:', err);
      console.error('Error details:', err.response?.data);
    }
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
        <Header
          department={department}
          quizzes={quizzes}
          onBack={onBack}
          onAddQuiz={() => setShowAddModal(true)}
          isProcessing={isProcessing}
        />

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
              <QuizCard
                key={quiz.quiz_id}
                quiz={quiz}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onInvite={openInviteModal}
                onManage={setSelectedQuiz}
                onPreview={(url) => window.open(url, '_blank')}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <AddQuizModal
          isOpen={showAddModal}
          onClose={closeModals}
          onAdd={handleAddQuiz}
          department={department}
          isProcessing={isProcessing}
        />

        <EditQuizModal
          isOpen={showEditModal}
          onClose={closeModals}
          onUpdate={handleUpdateQuiz}
          editingQuiz={editingQuiz}
          setEditingQuiz={setEditingQuiz}
          isProcessing={isProcessing}
        />

        <DeleteQuizModal
          isOpen={showDeleteModal}
          onClose={closeModals}
          onDelete={handleDeleteQuiz}
          deletingQuiz={deletingQuiz}
        />

        <InviteModal
          isOpen={showInviteModal}
          onClose={closeModals}
          onGenerate={handleGenerateInvite}
          selectedQuizForInvite={selectedQuizForInvite}
          generatedLink={generatedLink}
        />
      </div>
    </div>
  );
};

export default QuizManagement;