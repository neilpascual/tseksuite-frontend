import React, { useState, useEffect } from 'react';
import { LinkIcon, Copy, Check, AlertCircle } from 'lucide-react';

const InviteModal = ({ 
  isOpen, 
  onClose, 
  onGenerate, 
  selectedQuizForInvite,
  generatedLink = '' // Add default value
}) => {
  const [inviteExpiration, setInviteExpiration] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInviteExpiration('');
      setCopied(false);
      setIsGenerating(false);
      setError('');
    }
  }, [isOpen]);

  const handleClose = () => {
    setInviteExpiration('');
    setCopied(false);
    setIsGenerating(false);
    setError('');
    onClose();
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!inviteExpiration) {
      setError('Please enter expiration hours');
      return;
    }

    if (!selectedQuizForInvite?.quiz_id) {
      setError('No quiz selected');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      await onGenerate(inviteExpiration, selectedQuizForInvite.quiz_id);
    } catch (err) {
      setError('Failed to generate link. Please try again.');
      console.error('Generate error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !selectedQuizForInvite) return null;

  const isPdfTest = selectedQuizForInvite.pdf_links && selectedQuizForInvite.pdf_links.length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#217486] to-[#2a8fa5] p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Generate Invite
              </h2>
              <p className="text-white/80 text-sm truncate">
                {selectedQuizForInvite.quiz_name}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!generatedLink ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Link Expiration (Hours)
                </label>
                <input
                  type="number"
                  value={inviteExpiration}
                  onChange={(e) => {
                    setInviteExpiration(e.target.value);
                    setError(''); // Clear error when user types
                  }}
                  placeholder="Enter hours until expiration"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#217486] focus:border-transparent text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  The invitation link will expire after the specified time
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium text-sm sm:text-base"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!inviteExpiration || isGenerating}
                  className="flex-1 px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#217486]/30 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Link'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invitation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-xs sm:text-sm truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 sm:px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors shrink-0"
                    disabled={!generatedLink}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Link copied to clipboard!
                  </p>
                )}
                {!generatedLink && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    No link generated
                  </p>
                )}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs sm:text-sm text-blue-900">
                  <strong className="font-semibold">Note:</strong> Share
                  this link with examinees. They will be prompted to enter
                  their email when accessing the {isPdfTest ? 'test' : 'quiz'}.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 bg-[#217486] hover:bg-[#1a5d6d] text-white rounded-xl transition-colors font-medium shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;