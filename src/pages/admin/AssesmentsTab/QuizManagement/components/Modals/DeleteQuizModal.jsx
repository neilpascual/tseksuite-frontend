import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteQuizModal = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  deletingQuiz 
}) => {
  if (!isOpen || !deletingQuiz) return null;

  const isPdfTest = deletingQuiz.pdf_links && deletingQuiz.pdf_links.length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center">
          Delete {isPdfTest ? 'PDF Test' : 'Quiz'}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
          Are you sure you want to delete{' '}
          <strong className="text-gray-900">
            {deletingQuiz.quiz_name}
          </strong>
          ? This action cannot be undone
          {!isPdfTest ? ' and will remove all associated questions' : ''}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-red-600/30 text-sm sm:text-base"
          >
            Delete {isPdfTest ? 'Test' : 'Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuizModal;