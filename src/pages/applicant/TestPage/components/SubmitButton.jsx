const SubmitButton = ({ onSubmit, isSubmitting, label, fullWidth = false, variant = "primary" }) => {
  const getButtonStyles = () => {
    const baseStyles = `font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
      fullWidth ? 'w-full' : 'px-12'
    }`;

    const variants = {
      primary: `bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white border-2 border-cyan-700`,
      success: `bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-2 border-green-700`,
      danger: `bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-2 border-red-700`,
    };

    return `${baseStyles} ${variants[variant] || variants.primary}`;
  };

  return (
    <button
      onClick={onSubmit}
      disabled={isSubmitting}
      className={getButtonStyles()}
      style={{
        boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.2)",
        transform: "translateY(0)",
        transition: "all 0.2s ease-in-out"
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(2px)";
        e.currentTarget.style.boxShadow = "2px 2px 0px 0px rgba(0, 0, 0, 0.2)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "4px 4px 0px 0px rgba(0, 0, 0, 0.2)";
      }}
    >
      {isSubmitting ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting...</span>
          </div>
        </>
      ) : (
        <>
          <span className="font-semibold">{label}</span>
          <svg 
            className="w-5 h-5 transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </>
      )}
    </button>
  );
};

export default SubmitButton;