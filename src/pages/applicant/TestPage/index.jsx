import React from 'react';
import { useTestData } from './hooks/useTestData';
import { useTestTimer } from './hooks/useTestTimer';
import { useTestAnswers } from './hooks/useTestAnswers';
import { useTestModals } from './hooks/useTestModals';
import ProgressBar from './components/ProgressBar';
import Header from './components/Header';
import Footer from '../../../components/applicant/Footer';
import ConfirmationModal from './components/modals/ConfirmationModal';
import PDFTestLayout from './components/layouts/PDFTestLayout';
import StandardTestLayout from './components/layouts/StandardTestLayout';
import SplitScreenLayout from './components/layouts/SplitScreenLayout';
import { getPdfLinks } from './utils/pdfUtils';

const ApplicantTestPage = () => {
  const {
    quizData,
    applicantData,
    questions,
    loading,
    hasPdfReference,
    hasQuestions,
    fetchQuestions
  } = useTestData();

  const {
    timeRemaining,
    isSubmitting,
    percentage,
    handleTimeUp,
    submitTest,
    updateProgress
  } = useTestTimer(quizData, questions);

  const {
    selectedAnswers,
    descriptiveAnswers,
    handleAnswerSelect,
    handleDescriptiveAnswer,
    initializeAnswers
  } = useTestAnswers();

  const {
    modalState,
    openModal,
    closeModal,
    handleBackToHome,
    handleSubmit
  } = useTestModals({
    questions,
    selectedAnswers,
    descriptiveAnswers,
    isSubmitting,
    submitTest,
    hasPdfReference
  });

  // Initialize answers when questions are loaded
  React.useEffect(() => {
    if (questions.length > 0) {
      initializeAnswers(questions);
    }
  }, [questions, initializeAnswers]);

  // Update progress when answers change
  React.useEffect(() => {
    updateProgress(selectedAnswers, descriptiveAnswers);
  }, [selectedAnswers, descriptiveAnswers, updateProgress]);

  // Handle time up modal
  React.useEffect(() => {
    if (timeRemaining.rawTimeRemaining === 0 && !isSubmitting) {
      const timeUpModal = handleTimeUp();
      if (timeUpModal) {
        openModal(
          timeUpModal.type,
          timeUpModal.title,
          timeUpModal.message,
          () => {
            closeModal();
            if (applicantData) {
              submitTest(applicantData, selectedAnswers, descriptiveAnswers, hasPdfReference);
            }
          }
        );
      }
    }
  }, [timeRemaining.rawTimeRemaining, isSubmitting, handleTimeUp, openModal, closeModal, submitTest, applicantData, selectedAnswers, descriptiveAnswers, hasPdfReference]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading {hasPdfReference ? "PDF test" : "questions"}...
          </p>
        </div>
      </div>
    );
  }

  if (!quizData || !applicantData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Missing</h2>
          <p className="text-gray-600 mb-6">Quiz or applicant data not found.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  // PDF-only test (no questions)
  if (hasPdfReference && !hasQuestions) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <ProgressBar percentage={percentage} />
        <Header 
          onBack={handleBackToHome}
          timeRemaining={timeRemaining}
          showTimer={true}
        />
        
        <PDFTestLayout
          quizData={quizData}
          timeRemaining={timeRemaining}
          isSubmitting={isSubmitting}
          onSubmit={() => handleSubmit(applicantData)}
          pdfLinks={getPdfLinks(quizData)}
        />

        <Footer />
        <ConfirmationModal state={modalState} onClose={closeModal} />
      </div>
    );
  }

  // No questions available
  if (!hasQuestions) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">This quiz doesn't have any questions yet.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  // Standard test layout
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ProgressBar percentage={percentage} />
      <Header 
        onBack={handleBackToHome}
        timeRemaining={timeRemaining}
        showTimer={!hasPdfReference}
      />

      <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
        {hasPdfReference ? (
          <SplitScreenLayout
            quizData={quizData}
            questions={questions}
            selectedAnswers={selectedAnswers}
            descriptiveAnswers={descriptiveAnswers}
            onAnswerSelect={handleAnswerSelect}
            onDescriptiveAnswer={handleDescriptiveAnswer}
            isSubmitting={isSubmitting}
            onSubmit={() => handleSubmit(applicantData)}
            pdfLinks={getPdfLinks(quizData)}
          />
        ) : (
          <StandardTestLayout
            quizData={quizData}
            questions={questions}
            selectedAnswers={selectedAnswers}
            descriptiveAnswers={descriptiveAnswers}
            onAnswerSelect={handleAnswerSelect}
            onDescriptiveAnswer={handleDescriptiveAnswer}
            isSubmitting={isSubmitting}
            onSubmit={() => handleSubmit(applicantData)}
          />
        )}
      </div>

      <Footer />
      <ConfirmationModal state={modalState} onClose={closeModal} />
    </div>
  );
};

export default ApplicantTestPage;