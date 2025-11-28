import React from 'react';

const LoadingState = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
      <div className="animate-pulse">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#217486]/20 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm sm:text-base">
          Loading questions...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;