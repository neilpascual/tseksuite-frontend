import React, { useState } from 'react';
import { Plus, X, FileText, FilePlus } from 'lucide-react';
import { validateQuiz } from '../../utils/validation';

const AddQuizModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  department, 
  isProcessing 
}) => {
  const [newQuiz, setNewQuiz] = useState({
    quiz_name: '',
    time_limit: '',
    pdf_links: [''],
    is_pdf_test: false,
  });

  const resetForm = () => {
    setNewQuiz({
      quiz_name: '',
      time_limit: '',
      pdf_links: [''],
      is_pdf_test: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addPdfLink = () => {
    setNewQuiz({
      ...newQuiz,
      pdf_links: [...newQuiz.pdf_links, ''],
    });
  };

  const updatePdfLink = (index, value) => {
    const updatedLinks = [...newQuiz.pdf_links];
    updatedLinks[index] = value;
    setNewQuiz({
      ...newQuiz,
      pdf_links: updatedLinks,
    });
  };

  const removePdfLink = (index) => {
    if (newQuiz.pdf_links.length === 1) {
      const updatedLinks = [...newQuiz.pdf_links];
      updatedLinks[index] = '';
      setNewQuiz({
        ...newQuiz,
        pdf_links: updatedLinks,
      });
    } else {
      const updatedLinks = newQuiz.pdf_links.filter((_, i) => i !== index);
      setNewQuiz({
        ...newQuiz,
        pdf_links: updatedLinks,
      });
    }
  };

  const handleSubmit = () => {
    const validationError = validateQuiz(newQuiz, newQuiz.is_pdf_test);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    onAdd(newQuiz, department.dept_id);
  };

  if (!isOpen) return null;

  return (
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
                onClick={() =>
                  setNewQuiz({
                    ...newQuiz,
                    is_pdf_test: false,
                    pdf_links: [''],
                  })
                }
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  !newQuiz.is_pdf_test
                    ? 'border-[#217486] bg-[#217486] text-white shadow-lg shadow-[#217486]/30'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Standard Quiz</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewQuiz({
                    ...newQuiz,
                    is_pdf_test: true,
                    time_limit: '',
                  })
                }
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                  newQuiz.is_pdf_test
                    ? 'border-[#2a8fa5] bg-[#2a8fa5] text-white shadow-lg shadow-[#2a8fa5]/30'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <FilePlus className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">PDF Test</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {newQuiz.is_pdf_test ? 'Test' : 'Quiz'} Name
            </label>
            <input
              type="text"
              value={newQuiz.quiz_name}
              onChange={(e) =>
                setNewQuiz({ ...newQuiz, quiz_name: e.target.value })
              }
              placeholder={`Enter ${
                newQuiz.is_pdf_test ? 'test' : 'quiz'
              } name`}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
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
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Drive PDF Links
              </label>

              {newQuiz.pdf_links.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => updatePdfLink(index, e.target.value)}
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a8fa5] focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePdfLink(index)}
                    className="mt-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove link"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addPdfLink}
                className="flex items-center gap-2 px-4 py-2 text-[#2a8fa5] hover:text-[#217486] font-medium text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another PDF Link
              </button>

              <p className="text-xs text-gray-500">
                Paste shareable links from Google Drive. Multiple PDFs are
                supported.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !newQuiz.quiz_name.trim() ||
              (!newQuiz.is_pdf_test && !newQuiz.time_limit) ||
              (newQuiz.is_pdf_test &&
                newQuiz.pdf_links.filter((link) => link.trim() !== '').length === 0)
            }
            className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base ${
              newQuiz.is_pdf_test
                ? 'bg-[#2a8fa5] hover:bg-[#217486] shadow-[#2a8fa5]/30'
                : 'bg-[#217486] hover:bg-[#1a5d6d] shadow-[#217486]/30'
            }`}
          >
            Create {newQuiz.is_pdf_test ? 'PDF Test' : 'Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuizModal;