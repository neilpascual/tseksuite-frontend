import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useTestModals = ({
  questions,
  selectedAnswers,
  descriptiveAnswers,
  isSubmitting,
  submitTest,
  hasPdfReference
}) => {
  const navigate = useNavigate();
  const [modalState, setModalState] = useState({
    open: false,
    type: "",
    title: "",
    message: "",
    onConfirm: null,
    showCancel: false,
  });

  const openModal = useCallback((type, title, message, onConfirm, showCancel = false) => {
    setModalState({ open: true, type, title, message, onConfirm, showCancel });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ open: false, type: "", title: "", message: "", onConfirm: null, showCancel: false });
  }, []);

  const handleBackToHome = useCallback(() => {
    openModal(
      "exit",
      "⚠️ Exit Test",
      "Are you sure you want to exit? Your progress will be lost.",
      () => {
        closeModal();
        navigate("/test-instructions");
      },
      true
    );
  }, [openModal, closeModal, navigate]);

  const handleSubmit = useCallback((applicantData) => {
    if (isSubmitting) return;

    // Validate applicant data before submission
    if (!applicantData || !applicantData.examiner_id) {
      openModal(
        "error",
        "⚠️ Submission Error",
        "Applicant data is missing. Cannot submit test.",
        closeModal
      );
      return;
    }

    // For PDF tests with no questions, submit immediately
    if (hasPdfReference && questions.length === 0) {
      submitTest(applicantData, selectedAnswers, descriptiveAnswers, true);
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = questions.filter((question, index) => {
      if (question.question_type === "DESC") {
        return !descriptiveAnswers[index]?.trim();
      } else if (question.question_type === "CB") {
        return !selectedAnswers[index] || selectedAnswers[index].length === 0;
      } else {
        return selectedAnswers[index] === null;
      }
    });

    if (unansweredQuestions.length > 0) {
      openModal(
        "validation",
        "⚠️ Incomplete Test",
        `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`,
        () => {
          closeModal();
          submitTest(applicantData, selectedAnswers, descriptiveAnswers);
        },
        true
      );
    } else {
      submitTest(applicantData, selectedAnswers, descriptiveAnswers);
    }
  }, [
    questions,
    selectedAnswers,
    descriptiveAnswers,
    isSubmitting,
    hasPdfReference,
    submitTest,
    openModal,
    closeModal
  ]);

  return {
    modalState,
    openModal,
    closeModal,
    handleBackToHome,
    handleSubmit
  };
};