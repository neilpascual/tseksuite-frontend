import { useState } from 'react';

export const useQuizModals = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [deletingQuiz, setDeletingQuiz] = useState(null);
  const [selectedQuizForInvite, setSelectedQuizForInvite] = useState(null);

  const openEditModal = (quiz) => {
    setEditingQuiz({
      ...quiz,
      is_pdf_test: !!(quiz.pdf_links && quiz.pdf_links.length > 0),
      pdf_links: quiz.pdf_links && quiz.pdf_links.length > 0 ? [...quiz.pdf_links] : [''],
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (quiz) => {
    setDeletingQuiz(quiz);
    setShowDeleteModal(true);
  };

  const openInviteModal = (quiz) => {
    setSelectedQuizForInvite(quiz);
    setShowInviteModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowInviteModal(false);
    setEditingQuiz(null);
    setDeletingQuiz(null);
    setSelectedQuizForInvite(null);
  };

  return {
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
  };
};