import React from "react";

const Header = ({ totalExaminees, totalAttempts }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-cyan-900 mb-2">
            Examinees
          </h1>
          <p className="text-gray-600 text-sm">
            Total examinees:{" "}
            <span className="font-semibold">{totalExaminees}</span> • Total
            attempts: <span className="font-semibold">{totalAttempts}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
