function LoadingState() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#217486]/30 border-t-[#217486] rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600">Loading results...</p>
    </div>
  );
}

export default LoadingState;