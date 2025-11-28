import React from 'react';
import { Plus, X } from 'lucide-react';
import { validateQuiz } from '../../utils/validation';

const EditQuizModal = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  editingQuiz, 
  setEditingQuiz,
  isProcessing 
}) => {
  if (!isOpen || !editingQuiz) return null;

  const addEditingPdfLink = () => {
    setEditingQuiz({
      ...editingQuiz,
      pdf_links: [...editingQuiz.pdf_links, ''],
    });
  };

  const updateEditingPdfLink = (index, value) => {
    const updatedLinks = [...editingQuiz.pdf_links];
    updatedLinks[index] = value;
    setEditingQuiz({
      ...editingQuiz,
      pdf_links: updatedLinks,
    });
  };

  const removeEditingPdfLink = (index) => {
    if (editingQuiz.pdf_links.length === 1) {
      const updatedLinks = [...editingQuiz.pdf_links];
      updatedLinks[index] = '';
      setEditingQuiz({
        ...editingQuiz,
        pdf_links: updatedLinks,
      });
    } else {
      const updatedLinks = editingQuiz.pdf_links.filter((_, i) => i !== index);
      setEditingQuiz({
        ...editingQuiz,
        pdf_links: updatedLinks,
      });
    }
  };

  const handleSubmit = () => {
    const validationError = validateQuiz(editingQuiz, editingQuiz.is_pdf_test);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    onUpdate(editingQuiz);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#217486] to-[#2a8fa5] p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Edit {editingQuiz.is_pdf_test ? 'PDF Test' : 'Quiz'}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Update {editingQuiz.is_pdf_test ? 'pdf test' : 'quiz'} information
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {editingQuiz.is_pdf_test ? 'PDF Test' : 'Quiz'} Name
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
              placeholder={`${
                editingQuiz.is_pdf_test ? 'PDF Test' : 'Quiz'
              } name`}
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
                value={editingQuiz.time_limit || ''}
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
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Google Drive PDF Links
              </label>

              {editingQuiz.pdf_links.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={link}
                      onChange={(e) =>
                        updateEditingPdfLink(index, e.target.value)
                      }
                      placeholder="https://drive.google.com/file/d/..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a8fa5] focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEditingPdfLink(index)}
                    className="mt-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove link"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addEditingPdfLink}
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
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !editingQuiz.quiz_name.trim() ||
              (!editingQuiz.is_pdf_test && !editingQuiz.time_limit) ||
              (editingQuiz.is_pdf_test &&
                editingQuiz.pdf_links.filter((link) => link.trim() !== '')
                  .length === 0)
            }
            className="flex-1 px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
          >
            Update {editingQuiz.is_pdf_test ? 'PDF Test' : 'Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuizModal;