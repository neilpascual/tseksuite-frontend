import React from "react";
import DesktopRow from "../cards/DesktopRow.jsx";

const DesktopView = ({ 
  currentGroups, 
  expandedGroups, 
  onToggleGroup, 
  onDeleteAttempt 
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Examinee
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Activity
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentGroups.map((group) => (
            <DesktopRow
              key={group.key}
              group={group}
              isExpanded={expandedGroups.has(group.key)}
              onToggleExpand={() => onToggleGroup(group.key)}
              onDeleteAttempt={onDeleteAttempt}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesktopView;