import React from "react";
import { ChevronDown, ChevronUp, FileText, Calendar, Clock, Trash2, User } from "lucide-react";

const DesktopRow = ({ group, isExpanded, onToggleExpand, onDeleteAttempt }) => {
  return (
    <>
      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                {group.name?.charAt(0)?.toUpperCase() || "E"}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                {group.name}
              </p>
              {group.email && (
                <p className="text-xs text-gray-600 truncate mb-2 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {group.email}
                </p>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <FileText className="w-3 h-3" />
                {group.department}
              </span>
            </div>
          </div>
        </td>
      
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span className="font-medium">
                {group.attempts.length} attempt{group.attempts.length !== 1 ? 's' : ''}
              </span>
            </div>
            {group.attempts[0] && (
              <div className="text-xs text-gray-500 pl-6">
                Latest: {group.attempts[0].date}
              </div>
            )}
          </div>
        </td>
      
        <td className="px-4 py-4">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View Details
              </>
            )}
          </button>
        </td>
      </tr>

      {/* Expanded Attempts Section */}
      {isExpanded && (
        <tr className="bg-blue-50/30">
          <td colSpan="4" className="px-4 py-4">
            <div className="pl-12 pr-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Examination Attempts
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {group.attempts.length} total attempts
                  </span>
                </div>
              
                <div className="grid gap-2">
                  {group.attempts.map((attempt, index) => (
                    <div
                      key={attempt.attemptId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center justify-center w-6 h-6 bg-cyan-100 text-cyan-700 rounded font-semibold text-xs">
                          #{index + 1}
                        </div>
                      
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4 text-cyan-600" />
                            <span className="font-medium">{attempt.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-mono">{attempt.time}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded ml-4">
                          ID: {attempt.attemptId}
                        </div>
                      </div>
                    
                      <button
                        onClick={() => onDeleteAttempt({
                          attemptId: attempt.attemptId,
                          email: group.email,
                          name: group.name
                        })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              
                {group.attempts.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No examination attempts found</p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default DesktopRow;