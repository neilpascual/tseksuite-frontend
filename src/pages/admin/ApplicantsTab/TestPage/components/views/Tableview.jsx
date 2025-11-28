import React from "react";
import TabletCard from "../cards/TabletCard";

const TableView = ({ currentGroups, expandedGroups, onToggleGroup, onDeleteAttempt }) => {
  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {currentGroups.map((group) => (
        <TabletCard
          key={group.key}
          group={group}
          isExpanded={expandedGroups.has(group.key)}
          onToggleExpand={() => onToggleGroup(group.key)}
          onDeleteAttempt={onDeleteAttempt}
        />
      ))}
    </div>
  );
};

export default TableView;