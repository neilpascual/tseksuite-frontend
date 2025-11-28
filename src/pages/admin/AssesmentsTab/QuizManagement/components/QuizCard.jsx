import React, { useState } from 'react';
import { MoreVertical, Trash2, Edit2, Clock, LinkIcon, FileText } from 'lucide-react';

const QuizCard = ({ 
  quiz, 
  onEdit, 
  onDelete, 
  onInvite, 
  onManage, 
  onPreview,
  openMenuId,
  setOpenMenuId 
}) => {
  const isPdfTest = quiz.pdf_links && quiz.pdf_links.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
      <div
        className={`p-4 sm:p-5 ${
          isPdfTest
            ? 'bg-gradient-to-br from-[#2a8fa5] to-[#217486]'
            : 'bg-gradient-to-br from-[#217486] to-[#2a8fa5]'
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 pr-2">
            <h3 className="text-lg sm:text-xl text-white leading-tight wrap-break-word">
              {quiz.quiz_name}
            </h3>
          </div>
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === quiz.quiz_id ? null : quiz.quiz_id);
              }}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {openMenuId === quiz.quiz_id && (
              <div className="absolute right-0 top-12 w-44 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(quiz);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-[#217486]" />
                  Edit {isPdfTest ? 'PDF Test' : 'Quiz'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(quiz);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete {isPdfTest ? 'PDF Test' : 'Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-white/90">
          <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs rounded-md font-medium">
            {isPdfTest ? 'PDF Test' : 'Standard Test'}
          </span>

          <div className="flex items-center gap-2">
            {quiz.time_limit && <Clock className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {quiz.time_limit}{' '}
              {!isPdfTest && (quiz.time_limit === 1 ? 'minute' : 'minutes')}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4 text-[#217486]" />
            <span className="text-sm font-medium">
              <span className="text-[#217486] font-bold">
                {quiz.question_count || 0}
              </span>{' '}
              {quiz.question_count === 1 ? 'Question' : 'Questions'}
            </span>
          </div>
          {isPdfTest && (
            <div className="flex items-center gap-2 text-gray-600">
              <FileText className="w-4 h-4 text-[#217486]" />
              <span className="text-sm font-medium">
                <span className="text-[#217486] font-bold">
                  {quiz.pdf_links.length}
                </span>{' '}
                {quiz.pdf_links.length === 1 ? 'PDF' : 'PDFs'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isPdfTest ? (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => onManage(quiz)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Manage
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(quiz.pdf_links[0]);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Preview
                </button>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInvite(quiz);
                }}
                disabled={!quiz.question_count || quiz.question_count === 0}
                className="w-full flex items-center justify-center gap-2 bg-[#217486] hover:bg-[#1a5d6d] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#217486]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#217486]"
                title={
                  !quiz.question_count || quiz.question_count === 0
                    ? 'Add questions before generating invites'
                    : 'Generate invite link'
                }
              >
                <LinkIcon className="w-4 h-4" />
                Invite
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onManage(quiz)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Manage
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInvite(quiz);
                }}
                disabled={!quiz.question_count || quiz.question_count === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-[#217486] hover:bg-[#1a5d6d] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-[#217486]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#217486]"
                title={
                  !quiz.question_count || quiz.question_count === 0
                    ? 'Add questions before generating invites'
                    : 'Generate invite link'
                }
              >
                <LinkIcon className="w-4 h-4" />
                Invite
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;