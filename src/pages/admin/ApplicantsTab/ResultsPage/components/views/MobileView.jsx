import React from "react";
import MobileCard from "../cards/MobileCard";

const MobileView = ({ 
  currentGroups, 
  expandedGroups, 
  onToggleGroup, 
  onDeleteAttempt, 
  onDeleteAllAttempts 
}) => {
  return (
    <div className="p-4">
      {currentGroups.map((group) => (
        <MobileCard
          key={group.key}
          group={group}
          isExpanded={expandedGroups.has(group.key)}
          onToggleExpand={() => onToggleGroup(group.key)}
          onDeleteAttempt={onDeleteAttempt}
          onDeleteAllAttempts={onDeleteAllAttempts}
        />
      ))}
    </div>
  );
};

export default MobileView;