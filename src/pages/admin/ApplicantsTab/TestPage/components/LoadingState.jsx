import React from "react";

const LoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-sm">Loading examiners data...</p>
    </div>
  );
};

export default LoadingState;