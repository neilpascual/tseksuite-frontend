import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Calendar, MoreVertical, Trash2 } from "lucide-react";

const MobileCard = ({ group, isExpanded, onToggleExpand, onDeleteAttempt, onDeleteAllAttempts }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
              {group.name?.charAt(0)?.toUpperCase() || "E"}
            </div>
          </div>
        
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate mb-1">
              {group.name}
            </p>
            {group.email && (
              <p className="text-xs text-gray-600 truncate mb-2">
                {group.email}
              </p>
            )}
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <FileText className="w-3 h-3" />
                {group.department}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-600" />
            {group.attempts.length} attempt{group.attempts.length !== 1 ? 's' : ''}
          </span>
          {group.attempts[0] && (
            <span className="text-gray-500">
              Latest: {group.attempts[0].date}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex-1 justify-center"
        >
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {isExpanded ? "Hide" : "View"} Details
        </button>
      
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveDropdown(activeDropdown === group.key ? null : group.key);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {activeDropdown === group.key && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => onDeleteAllAttempts({ email: group.email, name: group.name })}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 className="w-4 h-4" />
                Delete All Attempts
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Attempts */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Attempt Details</h4>
          <div className="space-y-2">
            {group.attempts.map((attempt, index) => (
              <div
                key={attempt.attemptId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded flex items-center justify-center text-xs font-semibold shrink-0">
                    #{index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">{attempt.date}</div>
                    <div className="text-xs text-gray-500 font-mono truncate">{attempt.time}</div>
                  </div>
                </div>
              
                <button
                  onClick={() => onDeleteAttempt({
                    attemptId: attempt.attemptId,
                    email: group.email,
                    name: group.name
                  })}
                  className="flex items-center gap-1 px-2 py-1.5 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 transition-colors shrink-0 ml-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCard;