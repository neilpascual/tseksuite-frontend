import { useState } from 'react';

export const useQuestionModals = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  const openAddModal = () => {
    setCurrentQuestion({ ...emptyQuestion });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (question, index) => {
    setCurrentQuestion(JSON.parse(JSON.stringify(question)));
    setEditingIndex(index);
    setModalOpen(true);
  };

  const openDeleteModal = (index) => {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  };

  const closeModals = () => {
    setModalOpen(false);
    setDeleteModalOpen(false);
    setImportModalOpen(false);
    setCurrentQuestion(null);
    setEditingIndex(null);
    setDeleteIndex(null);
  };

  return {
    modalOpen,
    deleteModalOpen,
    importModalOpen,
    currentQuestion,
    editingIndex,
    deleteIndex,
    setCurrentQuestion,
    setImportModalOpen,
    openAddModal,
    openEditModal,
    openDeleteModal,
    closeModals,
    emptyQuestion,
  };
};