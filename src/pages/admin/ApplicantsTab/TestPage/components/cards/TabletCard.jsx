import React from "react";
import { ChevronDown, ChevronUp, FileText, Trash2 } from "lucide-react";

const TabletCard = ({ group, isExpanded, onToggleExpand, onDeleteAttempt }) => {
  const visibleAttempts = isExpanded ? group.attempts : group.attempts.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-linear-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {group.name?.charAt(0)?.toUpperCase() || "E"}
            </div>
          </div>
        
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 mb-1">{group.name}</p>
            {group.email && (
              <p className="text-sm text-gray-600 truncate mb-2">{group.email}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <FileText className="w-3 h-3" />
                {group.department}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {group.attempts.length} attempts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? "Show Less" : `Show All (${group.attempts.length})`}
        </button>
      </div>

      {/* Attempts List */}
      <div className="space-y-2">
        {visibleAttempts.map((attempt, index) => (
          <div
            key={attempt.attemptId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded flex items-center justify-center text-xs font-semibold shrink-0">
                #{index + 1}
              </div>
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900">{attempt.date}</div>
                <div className="text-xs text-gray-500 font-mono">{attempt.time}</div>
              </div>
            </div>
          
            <button
              onClick={() => onDeleteAttempt({
                attemptId: attempt.attemptId,
                email: group.email,
                name: group.name
              })}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100 transition-colors shrink-0 ml-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabletCard;