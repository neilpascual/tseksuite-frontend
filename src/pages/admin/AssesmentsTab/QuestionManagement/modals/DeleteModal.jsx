import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, questionText }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl mx-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
          Delete Question
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Are you sure you want to delete this question?
          <br />
          <span className="font-semibold text-gray-800 mt-2 block wrap-break-word">
            "{questionText}"
          </span>
        </p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-600/30 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;