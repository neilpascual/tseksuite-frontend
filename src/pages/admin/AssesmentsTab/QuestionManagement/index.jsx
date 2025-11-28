import React from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useQuestionModals } from './hooks/useQuestionModals';
import { getTotalPoints } from './utils/questionUtils';

import Header from './components/Header';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import QuestionList from './components/QuestionList';
import QuestionModal from './modals/QuestionModal';
import DeleteModal from './modals/DeleteModal';
import ImportModal from './modals/ImportModal';

const QuestionManagement = ({ quiz, onBack }) => {
  const isPdfTest = quiz?.pdf_link ? true : false;
  
  const {
    questions,
    loading,
    isProcessing,
    saveQuestion,
    deleteQuestion,
  } = useQuestions(quiz?.quiz_id);

  const {
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
  } = useQuestionModals();

  const handleSaveQuestion = async () => {
    const success = await saveQuestion(currentQuestion, editingIndex);
    if (success) {
      closeModals();
    }
  };

  const handleDeleteQuestion = async () => {
    const questionToDelete = questions[deleteIndex];
    if (questionToDelete) {
      const success = await deleteQuestion(questionToDelete);
      if (success) {
        closeModals();
      }
    }
  };

  const handleImportComplete = (importedCount) => {
    closeModals();
  };

  const totalPoints = getTotalPoints(questions);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <Header
          quiz={quiz}
          totalPoints={totalPoints}
          questionsCount={questions.length}
          onBack={onBack}
          onAddQuestion={openAddModal}
          onImport={() => setImportModalOpen(true)}
        />

        {loading ? (
          <LoadingState />
        ) : questions.length === 0 ? (
          <EmptyState
            isPdfTest={isPdfTest}
            onAddQuestion={openAddModal}
            onImport={() => setImportModalOpen(true)}
          />
        ) : (
          <QuestionList
            questions={questions}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        )}

        <QuestionModal
          isOpen={modalOpen}
          onClose={closeModals}
          question={currentQuestion}
          setQuestion={setCurrentQuestion}
          onSave={handleSaveQuestion}
          isProcessing={isProcessing}
        />

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={closeModals}
          onConfirm={handleDeleteQuestion}
          questionText={questions[deleteIndex]?.question_text}
        />

        <ImportModal
          isOpen={importModalOpen}
          onClose={closeModals}
          onImport={handleImportComplete}
          quizId={quiz.quiz_id}
        />
      </div>
    </div>
  );
};

export default QuestionManagement;