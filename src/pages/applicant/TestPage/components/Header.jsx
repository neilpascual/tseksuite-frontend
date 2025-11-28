import Timer from './Timer';

const Header = ({ onBack, timeRemaining, showTimer }) => (
  <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 pb-6">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-normal text-base">Exit Test</span>
      </button>
      {showTimer && <Timer timeRemaining={timeRemaining} />}
    </div>
  </div>
);

export default Header;